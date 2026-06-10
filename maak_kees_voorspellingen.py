#!/usr/bin/env python3
"""
Genereert AI Kees's Tempetoto 2026 voorspellingen.
Eénmalig uitvoeren vóór aftrap (11 juni 2026 21:00).

Gebruik: python3 maak_kees_voorspellingen.py
"""

import json
import re
import subprocess
import urllib.request
import urllib.error
from pathlib import Path

from dotenv import load_dotenv
import anthropic

REPO_DIR = Path(__file__).parent
load_dotenv(REPO_DIR / '.env')

import os
API_KEY = os.getenv('ANTHROPIC_API_KEY')


# ── Data ophalen uit data.js ──────────────────────────────────────────────────

def get_match_data() -> dict:
    result = subprocess.run(
        ['node', '-e', '''
const {GROUP_MATCHES, RANKING, GROUPS, FAVORITES, OUTSIDERS, SCORING} = require('./data.js');
const out = {
  matches: GROUP_MATCHES.map(m => ({id: m.id, group: m.group, home: m.home, away: m.away})),
  ranking: RANKING,
  favorieten: FAVORITES,
  outsiders: OUTSIDERS,
  scoring: SCORING,
  groups: GROUPS,
};
console.log(JSON.stringify(out));
'''],
        capture_output=True, text=True, check=True, cwd=REPO_DIR,
    )
    return json.loads(result.stdout)


# ── Odds ophalen ──────────────────────────────────────────────────────────────

def fetch_url(url: str) -> str:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=12) as r:
            return r.read().decode('utf-8', errors='replace')[:6000]
    except Exception as e:
        return f"[ophalen mislukt: {e}]"


def fetch_odds_context() -> str:
    bronnen = [
        ("Oddschecker WK winnaar odds",
         "https://www.oddschecker.com/football/world-cup/winner"),
        ("BBC Sport WK 2026 preview",
         "https://www.bbc.com/sport/football/articles/c4g00g7erego"),
        ("ESPN WK 2026 power rankings",
         "https://www.espn.com/soccer/story/_/id/44188888"),
    ]
    context = ""
    for naam, url in bronnen:
        print(f"  Ophalen: {naam}...")
        content = fetch_url(url)
        context += f"\n\n=== {naam} ===\n{content[:3000]}"
    return context


# ── Claude aanroepen ──────────────────────────────────────────────────────────

PROMPT_TEMPLATE = """Je bent AI Kees — deelnemer aan de Tempetoto 2026 voetbalpoule.
Je hebt een master Finance en een piratenmasker. Je bent contrair en droog intelligent.
Je haat hype en marktconsensus. Je finance-achtergrond komt af en toe naar boven maar je
gooit daar niet constant mee — alleen als het écht ergens op slaat.
Je woont in Zwitserland en bent er chauvinistisch over: je verrassing is Zwitserland —
je woont er, je gelooft erin, en je verkoopt dat als koele analyse. Je mag in je
Zwitserland-scores licht bevooroordeeld zijn, maar niet absurd.

Je taak: maak voorspellingen voor ALLE 72 WK 2026 groepswedstrijden + prematch inzet.
Je doet dit serieus — dit zijn echte punten en echte eer. Geen random scores.

=== PUNTENSYSTEEM ===
Groepswedstrijd:
  - Juiste uitslag (W/G/V): 3 punten
  - Exact goede score: +2 punten extra (dus 5 totaal)

Prematch:
  - Kampioen correct: 40 punten | kampioen haalt finale: 16 punten
  - Verrassing (outsider die ver komt): punten schalen met FIFA-ranking + hoe ver
  - Deceptie (favoriet die vroeg uitvalt): punten schalen met hoe hoog gerankt + hoe vroeg
  - Topscorer p1: 35 | p2: 18 | p3: 9 | exact goals: +8
  - Totaal goals WK: 25 - |verschil| (negatief = 0)
  - Gele kaarten totaal: 12 - |verschil|
  - Rode kaarten totaal: 12 - |verschil|

=== FIFA RANKINGS ===
{rankings}

=== FAVORIETEN (top-12 FIFA) ===
{favorieten}

=== OUTSIDERS ===
{outsiders}

=== ALLE 72 GROEPSWEDSTRIJDEN ===
{wedstrijden}

=== ODDS & EXPERT CONTEXT ===
{odds_context}

=== INSTRUCTIES ===
1. Analyseer de odds, rankings en context als een value investor: zoek waar de markt het bij het
   verkeerde eind heeft. Kees gaat contrair waar hij waarde ziet — maar niet per se overal.
2. Maak voor ELKE wedstrijd een score voorspelling in formaat "X-Y" (thuisploeg-uitploeg).
3. Kies een kampioen, verrassing (= Zwitserland), deceptie, topscorer en de statistieken.
4. Verantwoord je picks kort (Kees-stijl: droog, finance-lens, max 1 zin per pick).

Geef je antwoord als GELDIG JSON (niets anders):
{{
  "prematch": {{
    "champion": "<land in het Nederlands>",
    "finalist_predicted": "<land in het Nederlands>",
    "surprise": "<outsider-land in het Nederlands>",
    "deception": "<favoriet-land in het Nederlands>",
    "topscorer": "<spelersnaam, alléén achternaam, bijv. 'Mbappé'>",
    "topscorerGoals": "<getal>",
    "totalGoals": "<getal>",
    "yellow": "<getal>",
    "red": "<getal>"
  }},
  "group": {{
    "A1": "X-Y",
    ... alle 72 matchIds ...
  }},
  "motivatie": {{
    "champion": "<1 zin>",
    "surprise": "<1 zin>",
    "deception": "<1 zin>",
    "topscorer": "<1 zin>"
  }}
}}"""


def genereer_voorspellingen(match_data: dict, odds_context: str) -> dict:
    rankings_str = "\n".join(
        f"  {land}: #{pos}" for land, pos in
        sorted(match_data['ranking'].items(), key=lambda x: x[1])
    )
    wedstrijden_str = "\n".join(
        f"  {m['id']}: {m['home']} vs {m['away']} "
        f"(FIFA #{match_data['ranking'].get(m['home'], '?')} vs #{match_data['ranking'].get(m['away'], '?')})"
        for m in match_data['matches']
    )

    prompt = PROMPT_TEMPLATE.format(
        rankings=rankings_str,
        favorieten=", ".join(match_data['favorieten']),
        outsiders=", ".join(match_data['outsiders']),
        wedstrijden=wedstrijden_str,
        odds_context=odds_context,
    )

    client = anthropic.Anthropic(api_key=API_KEY)
    print("  Claude aan het werk...")
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=4000,
        messages=[{"role": "user", "content": prompt}],
    )

    tekst = response.content[0].text.strip()

    # JSON extraheren (Claude kan soms wat tekst ervoor/erna zetten)
    match = re.search(r'\{.*\}', tekst, re.DOTALL)
    if not match:
        raise ValueError(f"Geen JSON gevonden in response:\n{tekst[:500]}")
    return json.loads(match.group())


# ── Valideren ─────────────────────────────────────────────────────────────────

def valideer(voorspellingen: dict, match_data: dict) -> list[str]:
    fouten = []
    re_score = re.compile(r'^\d+-\d+$')
    group = voorspellingen.get('group', {})

    for m in match_data['matches']:
        score = group.get(m['id'])
        if not score:
            fouten.append(f"Missende voorspelling: {m['id']} ({m['home']} vs {m['away']})")
        elif not re_score.match(score):
            fouten.append(f"Ongeldig formaat {m['id']}: '{score}'")

    prematch = voorspellingen.get('prematch', {})
    alle_landen = [m['home'] for m in match_data['matches']] + [m['away'] for m in match_data['matches']]
    for veld in ['champion', 'surprise', 'deception']:
        val = prematch.get(veld, '')
        if val and val not in alle_landen:
            fouten.append(f"Onbekend land in prematch.{veld}: '{val}'")

    return fouten


# ── Schrijven naar data.js ────────────────────────────────────────────────────

def schrijf_naar_datajs(voorspellingen: dict):
    data_js = (REPO_DIR / 'data.js').read_text()

    # top2/best3 afleiden uit de eigen scores (zelfde logica als --afleiden)
    from verwerk_voorspelling import leid_top2_best3_af
    pred = {"group": voorspellingen['group'], "top2": {}, "best3": []}
    leid_top2_best3_af("AI Kees", pred)

    # Bouw het JS-blok
    group_entries = ",\n    ".join(
        f'"{k}": "{v}"' for k, v in sorted(voorspellingen['group'].items())
    )
    top2_js = json.dumps(pred['top2'], ensure_ascii=False)
    best3_js = json.dumps(pred['best3'], ensure_ascii=False)
    p = voorspellingen['prematch']
    motivatie = voorspellingen.get('motivatie', {})

    blok = f'''
// AI Kees voorspellingen — gegenereerd door maak_kees_voorspellingen.py
// Motivatie: kampioen={motivatie.get("champion","")}, verrassing={motivatie.get("surprise","")},
//            deceptie={motivatie.get("deception","")}, topscorer={motivatie.get("topscorer","")}
VOORSPELLINGEN["AI Kees"] = {{
  prematch: {{
    champion: {json.dumps(p.get("champion",""))},
    finalist_predicted: {json.dumps(p.get("finalist_predicted",""))},
    surprise: {json.dumps(p.get("surprise",""))},
    deception: {json.dumps(p.get("deception",""))},
    topscorer: {json.dumps(p.get("topscorer",""))},
    topscorerGoals: {json.dumps(str(p.get("topscorerGoals","")))},
    totalGoals: {json.dumps(str(p.get("totalGoals","")))},
    yellow: {json.dumps(str(p.get("yellow","")))},
    red: {json.dumps(str(p.get("red","")))},
  }},
  group: {{
    {group_entries}
  }},
  top2: {top2_js},
  best3: {best3_js},
  ko: {{R32:[],R16:[],KF:[],HF:[],F:[]}},
}};'''

    # Vervang bestaand blok als het er al in zit, anders append
    marker_start = '// AI Kees voorspellingen'
    marker_end   = 'ko: {R32:[],R16:[],KF:[],HF:[],F:[]},\n};'

    if marker_start in data_js:
        start = data_js.index(marker_start)
        end   = data_js.index(marker_end, start) + len(marker_end)
        data_js = data_js[:start] + blok.lstrip('\n') + data_js[end:]
    else:
        # Voeg in vóór de module.exports regel
        exports_marker = 'module.exports'
        if exports_marker in data_js:
            pos = data_js.index(exports_marker)
            data_js = data_js[:pos] + blok + '\n\n' + data_js[pos:]
        else:
            data_js += blok

    (REPO_DIR / 'data.js').write_text(data_js)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("\n=== AI Kees voorspellingen genereren ===\n")

    print("[1] Match- en rankingdata ophalen uit data.js...")
    match_data = get_match_data()
    print(f"    {len(match_data['matches'])} wedstrijden geladen")

    print("\n[2] Odds ophalen...")
    odds_context = fetch_odds_context()

    print("\n[3] Claude Opus vraagt om voorspellingen...")
    voorspellingen = genereer_voorspellingen(match_data, odds_context)

    print("\n[4] Valideren...")
    fouten = valideer(voorspellingen, match_data)
    if fouten:
        print(f"    ❌ {len(fouten)} fout(en) gevonden:")
        for f in fouten:
            print(f"       - {f}")
        print("\n    Stoppen zonder schrijven. Controleer de output hierboven.")
        print("\nRuwe JSON:")
        print(json.dumps(voorspellingen, ensure_ascii=False, indent=2))
        return

    print(f"    ✓ Alle {len(match_data['matches'])} wedstrijden aanwezig en correct")

    print("\n[5] Motivatie van AI Kees:")
    for k, v in voorspellingen.get('motivatie', {}).items():
        print(f"    {k}: {v}")

    print("\n[6] Schrijven naar data.js...")
    schrijf_naar_datajs(voorspellingen)
    print("    ✓ data.js bijgewerkt")

    print("\n[7] Valideer met valideer_data.js...")
    import subprocess as sp
    result = sp.run(['node', 'valideer_data.js'], capture_output=True, text=True, cwd=REPO_DIR)
    print(result.stdout)
    if result.returncode != 0:
        print("    ❌ Validatie mislukt — controleer data.js")
    else:
        print("✅ Klaar! Commit en push wanneer alle voorspellingen binnen zijn.\n")


if __name__ == '__main__':
    main()
