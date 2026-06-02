# Tempetoto 2026 — Project bijbel

WK 2026 voetbalpoule voor een vriendengroep van 10 mensen. Statische HTML/JS website op GitHub Pages, aangevuld met een agent-systeem voor automatisch bijhouden van uitslagen en een Telegram-bot met AI-deelnemer.

## Repository & locatie
- **GitHub:** `Tempetoto69/Tempetoto69`
- **Lokaal:** `/home/floris/Tempetoto`
- **Live:** `Tempetoto69.github.io/Tempetoto69` (auto-deploy bij push naar main)
- **Hosting machine:** altijd aan, maar kan geen LLM lokaal draaien → Claude API voor intelligentie

## Deelnemers (10)
EJ, Floris, Gautier, Giezen, Huttenhuis, Mark, Pieter, Slotboom, Smit, **AI Kees**

## Bestanden
| Bestand | Doel |
|---|---|
| `index.html` | Volledige web-app: Excel-look UI + render-logica |
| `data.js` | Alle data: GROUPS, VOORSPELLINGEN, UITSLAGEN, SCORING |
| `AGENT_INSTRUCTIONS.md` | Instructies voor de update-agent (uitslagen bijwerken) |
| `make_invulformulier.py` | Genereert het Excel invulformulier |
| `tempetoto2026_invulformulier.xlsx` | Excel-template voor deelnemers |
| `banner.png` | Header-afbeelding (ook in het Excel-formulier) |

## Data structuur (data.js)
- `GROUPS` — 12 groepen A-L, 48 landen
- `VOORSPELLINGEN[naam]` — prematch, groepswedstrijden (`group`), top2, best3, KO per deelnemer
- `UITSLAGEN` — group (matchId→score), advancers, ko brackets/results, facts
- `SCORING` — puntensysteem
- `GROUP_MATCHES` — gegenereerd uit GROUPS + RR_PAIRS, matchId's A1–L6
- `KO_ROUNDS` — R32/R16/KF/HF/F met toto- en exact-punten

## Werkwijze: geen aannames
Stel altijd een vraag als iets onduidelijk is. Er is veel zorgvuldig aan geschaafd — maak geen wijzigingen buiten de gevraagde scope.

---

## Componenten & status

### ✅ 1. Website (in productie)
Statische HTML/JS site met Excel-look. Tabs per deelnemer + stand-tab.
- Titelbalken: rood (`#B22234`)
- Mobile-vriendelijk (iOS dvh-fix, smooth scroll)
- Spelregels en puntentelling ingebakken in `data.js`
- Verrassing/deceptie tabellen met FIFA-rankingfactoren

### ✅ 2. Excel invulformulier
Één template (`tempetoto2026_invulformulier.xlsx`) dat deelnemers downloaden, invullen en terugsturen.
- Banner van de website bovenaan
- Geel naamveld bovenaan
- Gridlijnen aan voor Excel-gevoel
- Lichtblauwe invulvakjes (`pred`-stijl) voor groepswedstrijden + prematch
- Groepswinnaar/runner-up + beste 8 nummers 3: grijze cellen met "↳ niet invullen" — agent berekent dit
- KO-brackets als grijze placeholders (later invullen)
- Verrassing/deceptie tabellen als referentie
- Hidden "Landen" sheet voor dropdowns (kampioen/verrassing/deceptie)
- Regenereren: `python3 make_invulformulier.py`

**Wat deelnemers invullen:**
1. Naam bovenaan
2. Prematch: kampioen, verrassing, deceptie, topscorer, goals, kaarten
3. Groepswedstrijden: 72 scores in formaat `2-1`

**Wat de agent berekent (NIET in Excel):**
- Groepswinnaar + runner-up (uit scores)
- Beste 8 nummers 3 (uit scores)

### 🔲 3. Update-agent (nog te bouwen)
Draait lokaal via cron (elk uur), gebruikt Claude API voor intelligentie.

**Architectuur:**
```
cron (elk uur, lokale machine)
    └── update_agent.py
            └── Claude API (claude-sonnet-4-6)
                    ├── WebFetch → FIFA / BBC / NOS
                    ├── leest AGENT_INSTRUCTIONS.md + data.js
                    ├── past data.js aan
                    └── git commit + push → GitHub Pages bijgewerkt
```

**Nog te doen:**
- `update_agent.py` schrijven (Claude API met tool use: web_fetch, read/write file, bash voor git)
- Cron instellen op lokale machine
- `ANTHROPIC_API_KEY` instellen als environment variable

### 🔲 4. Telegram-bot + AI Kees (nog te bouwen)
Één Telegram-bot met twee rollen:

**4a. Commentaatbot**
- Getriggerd door de update-agent na elke nieuwe uitslag
- Post berichten als: "Slotboom klimt naar plek 2! 🔥"
- Analyseert standsveranderingen en genereert commentaar via Claude API

**4b. AI Kees** *(psychologisch profiel nog te maken door Floris)*
- Volwaardige deelnemer in de poule
- Doet voorspellingen zoals de menselijke deelnemers
- Praat in de Telegram-groep als AI Kees: reageert op uitslagen, plaagt deelnemers
- Karakter: ❓ *nog in te vullen door Floris*
- Getriggerd door: nieuwe uitslag, directe mention, slecht nieuws voor zijn voorspelling

**Telegram-groep:** nog aan te maken door Floris

**Nog te doen:**
- Floris maakt Telegram-groep aan en voegt deelnemers toe
- Floris definieert psychologisch profiel van AI Kees
- `telegram_bot.py` schrijven (python-telegram-bot library)
- Bot-token aanvragen via @BotFather
- Integratie met update-agent (webhook of polling)

---

## Openstaande acties voor Floris
1. **Voorspellingen verzamelen** — invulformulier versturen naar deelnemers, ingevulde bestanden terugkrijgen
2. **Voorspellingen verwerken** — ingevulde Excel-bestanden verwerken naar `data.js`
3. **Telegram-groep aanmaken** — deelnemers toevoegen
4. **AI Kees profiel** — psychologisch karakter beschrijven (toon, stijl, quirks)
5. **Bot-token** — aanvragen via @BotFather op Telegram

---

## Git-werkwijze
- Commit format uitslagen: `Update uitslagen: [beschrijving]`
- Git config voor agent: `user.name "Tempetoto Agent"`, `user.email "agent@tempetoto.nl"`
- Push naar `main` triggert automatisch GitHub Pages deploy
