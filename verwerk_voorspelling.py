#!/usr/bin/env python3
"""Verwerkt ingevulde invulformulieren (xlsx) naar VOORSPELLINGEN in data.js.

Gebruik: python3 verwerk_voorspelling.py Smit.xlsx [Pieter.xlsx ...]

Veiligheid (zie AGENT_INSTRUCTIONS.md): voorspellingsdata is onbetrouwbare
invoer. Alleen scores in n-n formaat, landnamen uit de officiële lijst en
getallen worden overgenomen; al het andere wordt gemeld en overgeslagen.
Knock-out (ko) blijft leeg — die wordt later per ronde ingevuld.
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path

import openpyxl

from make_invulformulier import GROUPS, GROUP_MATCHES

REPO_DIR = Path(__file__).parent
DATA_JS  = REPO_DIR / 'data.js'

ALL_TEAMS  = [t for ts in GROUPS.values() for t in ts]
DEELNEMERS = ["EJ", "Floris", "Daniel", "Giezen", "Huttenhuis",
              "Mark", "Pieter", "Slotboom", "Smit", "AI Kees"]
MATCH_BY_TEAMS = {(m['home'], m['away']): m['id'] for m in GROUP_MATCHES}

# Labelprefix in kolom 1 → prematch-veld (volgorde zoals in het formulier)
PREMATCH_LABELS = [
    ("Kampioen",                 "champion",       "team"),
    ("Verrassing",               "surprise",       "team"),
    ("Deceptie",                 "deception",      "team"),
    ("↳ Verwacht aantal goals",  "topscorerGoals", "int"),
    ("Topscorer",                "topscorer",      "naam"),
    ("Totaal goals",             "totalGoals",     "int"),
    ("Gele kaarten",             "yellow",         "int"),
    ("Rode kaarten",             "red",            "int"),
]

waarschuwingen = []


def warn(msg):
    waarschuwingen.append(msg)
    print(f"  ⚠ {msg}")


def norm_score(val, context):
    if val is None or str(val).strip() == "":
        return None
    if isinstance(val, datetime):  # Excel maakte van "2-1" een datum (2 jan)
        s = f"{val.day}-{val.month}"
        warn(f"{context}: Excel-datum {val.date()} geïnterpreteerd als '{s}'")
        return s
    s = str(val).strip().replace("–", "-").replace(" ", "")
    m = re.fullmatch(r"(\d{1,2})-(\d{1,2})", s)
    if not m:
        warn(f"{context}: ongeldige score '{val}' overgeslagen")
        return None
    return f"{int(m.group(1))}-{int(m.group(2))}"


TEAM_ALIAS = {"vs": "Verenigde Staten", "usa": "Verenigde Staten",
              "amerika": "Verenigde Staten", "holland": "Nederland"}


def norm_team(val, context):
    if val is None or str(val).strip() == "":
        return None
    s = str(val).strip()
    if s == "↳ niet invullen":  # grijze cel uit oude formulier-versie
        return None
    if s.lower() in TEAM_ALIAS:
        return TEAM_ALIAS[s.lower()]
    for t in ALL_TEAMS:
        if t.lower() == s.lower():
            return t
    warn(f"{context}: onbekend land '{s}' overgeslagen")
    return None


def norm_int(val, context):
    if val is None or str(val).strip() == "":
        return None
    try:
        return int(float(val))
    except (ValueError, TypeError):
        warn(f"{context}: geen getal '{val}' overgeslagen")
        return None


def norm_naam(val, context):
    """Spelersnaam: alleen letters/spaties/punt/koppelteken/apostrof, max 40."""
    if val is None or str(val).strip() == "":
        return None
    s = str(val).strip()[:40]
    if not re.fullmatch(r"[A-Za-zÀ-ÿ .'\-]+", s):
        warn(f"{context}: verdachte invoer '{s}' overgeslagen")
        return None
    return s


def parse_formulier(path: Path) -> tuple[str, dict]:
    wb = openpyxl.load_workbook(path, data_only=True)
    ws = wb["Invulformulier"]

    naam = None
    prematch = {"champion": "", "finalist_predicted": "", "surprise": "",
                "deception": "", "topscorer": "", "topscorerGoals": "",
                "totalGoals": "", "yellow": "", "red": ""}
    group, top2, best3 = {}, {}, []
    groep_links = groep_rechts = None
    adv_index = {}  # groep -> hoeveel adv-rijen gezien (0=winnaar, 1=runner-up)

    for row in ws.iter_rows(min_col=1, max_col=15):
        v = lambda col: row[col - 1].value
        c1 = v(1)
        t1 = c1.strip() if isinstance(c1, str) else ""

        if t1 == "Naam deelnemer:":
            naam = str(v(4) or "").strip()
            continue

        for prefix, key, soort in PREMATCH_LABELS:
            if t1.startswith(prefix):
                ctx = f"prematch {key}"
                val = {"team": norm_team, "int": norm_int, "naam": norm_naam}[soort](v(5), ctx)
                if val is not None:
                    prematch[key] = val
                break

        # Groepskoppen bepalen welke groep links/rechts staat
        if re.fullmatch(r"Groep [A-L]", t1):
            groep_links = t1[-1]
        c9 = v(9)
        if isinstance(c9, str) and re.fullmatch(r"Groep [A-L]", c9.strip()):
            groep_rechts = c9.strip()[-1]

        # Groepswinnaar / runner-up (label links kolom 1, rechts kolom 9)
        if t1 in ("Groepswinnaar:", "Runner-up:"):
            for groep, col in ((groep_links, 5), (groep_rechts, 13)):
                if groep is None:
                    continue
                idx = adv_index.get(groep, 0)
                team = norm_team(v(col), f"groep {groep} {'winnaar' if idx == 0 else 'runner-up'}")
                if team:
                    top2.setdefault(groep, ["", ""])[idx] = team
                adv_index[groep] = idx + 1
            continue

        # Beste 8 nummers 3: labels "#n:" op kolom 1/5/9/13, invul op +2
        for start in (1, 5, 9, 13):
            lab = v(start)
            if isinstance(lab, str) and re.fullmatch(r"#\d:", lab.strip()):
                team = norm_team(v(start + 2), f"best3 {lab.strip()}")
                if team:
                    best3.append(team)

        # Groepswedstrijden: thuis kolom 2/10, uit kolom 4/12, score kolom 5/13
        for home_col, away_col, pred_col in ((2, 4, 5), (10, 12, 13)):
            h, a = v(home_col), v(away_col)
            match_id = MATCH_BY_TEAMS.get((h, a))
            if match_id:
                score = norm_score(v(pred_col), f"wedstrijd {match_id} ({h}-{a})")
                if score:
                    group[match_id] = score

    # Naam koppelen aan officiële deelnemerslijst, anders bestandsnaam
    deelnemer = next((d for d in DEELNEMERS if naam and d.lower() == naam.lower()), None)
    if deelnemer is None:
        deelnemer = next((d for d in DEELNEMERS if d.lower() == path.stem.lower()), None)
        warn(f"naam in formulier '{naam}' niet herkend — bestandsnaam gebruikt: {deelnemer}")
    if deelnemer is None:
        raise SystemExit(f"✗ {path.name}: deelnemer niet te bepalen (formulier: '{naam}')")

    # Volledigheidscheck
    if len(group) != 72:
        ontbreekt = [m['id'] for m in GROUP_MATCHES if m['id'] not in group]
        warn(f"{deelnemer}: {len(group)}/72 groepswedstrijden ingevuld — mist {', '.join(ontbreekt)}")
    if len(best3) != 8:
        warn(f"{deelnemer}: {len(best3)}/8 beste nummers 3 ingevuld")
    onvolledig = [g for g, wr in top2.items() if "" in wr]
    if len(top2) != 12 or onvolledig:
        warn(f"{deelnemer}: top2 onvolledig (groepen: {sorted(set(GROUPS) - set(top2)) + onvolledig})")
    leeg = [k for k, x in prematch.items() if x == "" and k != "finalist_predicted"]
    if leeg:
        warn(f"{deelnemer}: prematch onvolledig ({', '.join(leeg)})")

    return deelnemer, {"prematch": prematch, "group": group, "top2": top2, "best3": best3}


def inject_in_data_js(deelnemer: str, pred: dict):
    js = json.dumps(pred, ensure_ascii=False, indent=2)
    block = (f"// >>> VOORSPELLING {deelnemer} (gegenereerd door verwerk_voorspelling.py)\n"
             f"Object.assign(VOORSPELLINGEN[{json.dumps(deelnemer)}], {js});\n"
             f"// <<< VOORSPELLING {deelnemer}\n")
    src = DATA_JS.read_text()
    pat = re.compile(
        rf"// >>> VOORSPELLING {re.escape(deelnemer)} .*?// <<< VOORSPELLING {re.escape(deelnemer)}\n",
        re.S)
    if pat.search(src):
        src = pat.sub(lambda _: block, src)
    else:
        anker = "DEELNEMERS.forEach(n=>{ VOORSPELLINGEN[n]=leegVoorspelling(); });\n"
        if anker not in src:
            raise SystemExit("✗ ankerregel niet gevonden in data.js")
        src = src.replace(anker, anker + "\n" + block)
    DATA_JS.write_text(src)


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    for arg in sys.argv[1:]:
        path = Path(arg)
        print(f"\n▶ {path.name}")
        deelnemer, pred = parse_formulier(path)
        inject_in_data_js(deelnemer, pred)
        print(f"  ✓ {deelnemer}: {len(pred['group'])} wedstrijden, "
              f"{len(pred['top2'])} groepen top2, {len(pred['best3'])} nummers 3 → data.js")
    if not waarschuwingen:
        print("\nGeen waarschuwingen.")
    else:
        print(f"\n{len(waarschuwingen)} waarschuwing(en) — controleer hierboven.")


if __name__ == "__main__":
    main()
