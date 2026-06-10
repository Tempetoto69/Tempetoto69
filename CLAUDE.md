# Tempetoto 2026 — Project bijbel

WK 2026 voetbalpoule voor een vriendengroep van 10 mensen. Statische HTML/JS website op GitHub Pages, aangevuld met een agent-systeem voor automatisch bijhouden van uitslagen en een Telegram-bot met AI-deelnemer.

## Repository & locatie
- **GitHub:** `Tempetoto69/Tempetoto69`
- **Lokaal:** `/home/floris/Tempetoto`
- **Live:** `Tempetoto69.github.io/Tempetoto69` (auto-deploy bij push naar main)
- **Hosting machine:** altijd aan, maar kan geen LLM lokaal draaien → Claude API voor intelligentie

## Deelnemers (10)
EJ, Floris, Daniel, Giezen, Huttenhuis, Mark, Pieter, Slotboom, Smit, **AI Kees**

## Bestanden
| Bestand | Doel |
|---|---|
| `index.html` | Volledige web-app: Excel-look UI + render-logica |
| `data.js` | Alle data: GROUPS, VOORSPELLINGEN, UITSLAGEN, SCORING |
| `AGENT_INSTRUCTIONS.md` | Instructies voor de update-agent (uitslagen bijwerken) |
| `make_invulformulier.py` | Genereert het Excel invulformulier |
| `tempetoto2026_invulformulier.xlsx` | Excel-template voor deelnemers |
| `banner.jpg` | Header-afbeelding (ook in het Excel-formulier) |
| `AI_KEES_PROFIEL.md` | Volledig karakterprofiel + system prompt basis voor AI Kees |
| `telegram_bot.py` | AI Kees bot: chat, dagelijkse update (`--daily-update`), pre-match preview (`--pre-match`) |
| `bereken_stand.js` | Berekent de actuele stand (JSON op stdout) |
| `valideer_data.js` | Valideert data.js (integriteit + scoretests) vóór elke write/push |
| `prewedstrijd.js` | Voorspellingen per wedstrijd voor de pre-match preview |
| `wedstrijden.json` | Speelschema: datum, tijd, stad, stadion per wedstrijd #1-#104 |
| `maak_kees_voorspellingen.py` | Eenmalig: genereert AI Kees's voorspellingen |
| `verwerk_voorspelling.py` | Verwerkt ingevulde formulieren (xlsx) naar VOORSPELLINGEN in data.js |
| `stand_historie.json` | Dagelijkse stand-snapshots (bot schrijft na de 08:00-update) → standverloop-grafiek |
| `tempetoto-bot.service` | systemd unit voor de bot (chat-modus) |
| `requirements.txt` | Python-dependencies (venv: `.venv/`) |

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
Statische HTML/JS site met Excel-look. Tabs: Stand, Stats, per deelnemer, All Time.
- Stand-tab: ook "Max" (maximaal haalbare eindscore) + standverloop-grafiek (uit `stand_historie.json`)
- Stats-tab: kampioen/topscorer/verrassing/deceptie-verdeling, optimisme, eigenwijsheid, gelijkenis tussen deelnemers
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
- Groepswinnaar/runner-up + beste 8 nummers 3: vrij invulbaar met dropdowns (vrije voorspelling, mag afwijken van de eigen scores)
- KO-brackets als grijze placeholders (later invullen)
- Verrassing/deceptie tabellen als referentie
- Hidden "Landen" sheet voor dropdowns (kampioen/verrassing/deceptie)
- Regenereren: `python3 make_invulformulier.py`

**Wat deelnemers invullen:**
1. Naam bovenaan
2. Prematch: kampioen, verrassing, deceptie, topscorer, goals, kaarten
3. Groepswedstrijden: 72 scores in formaat `2-1`
4. Groepswinnaar + runner-up per groep én de 8 beste nummers 3 (vrije voorspelling — telt mee in de scoring)

**Verwerken van ingevulde formulieren:** `python3 verwerk_voorspelling.py <naam>.xlsx`
— parseert het formulier, valideert de invoer (alleen scores/landnamen/getallen) en injecteert in `data.js`. Idempotent: opnieuw draaien vervangt de voorspelling van die deelnemer.
De agent berekent dus NIETS aan voorspellingen — hij vult alleen werkelijke uitslagen en `UITSLAGEN.advancers` in.

### ✅ 3. Dagelijkse update-agent (in productie)
Geïntegreerd in `telegram_bot.py --daily-update`. Geen apart `update_agent.py`.

**Architectuur:**
```
cron (08:00, lokale machine) → telegram_bot.py --daily-update
    └── Claude API (claude-sonnet-4-6) met tools:
            ├── get_tournament_stats → football API (uitslagen, kaarten, topscorers)
            ├── get_standings / get_data / get_schedule / fetch_url
            ├── write_data  → schrijft data.js, valideer_data.js draait direct (rollback bij fout)
            └── git_push    → validatie + commit + push → GitHub Pages bijgewerkt
    └── post stand-update als AI Kees in de Telegram-groep
```
Deduplicatie via `geposte_updates.json` (max één update per dag).
Cron-output gaat naar `cron.log`; de bot logt zelf naar `bot.log` (geroteerd, max ~2MB ×4).

**Uitslagen-checker (elk kwartier, deterministisch — geen LLM):** `--check-uitslagen`
pollt de football API alleen als er volgens `wedstrijden.json` een groepswedstrijd
1u45–6u geleden begon waarvan de uitslag nog mist. Nieuwe uitslag → data.js bijwerken
(regex op UITSLAGEN.group, validatie + rollback), pushen, stand-snapshot. Pakt iemand
de leiding, dan meldt Kees dat in de groep (Haiku). KO-uitslagen, advancers, topscorers
en kaarten blijven bij de dagelijkse 08:00-update (Sonnet).

### ✅ 4. Telegram-bot + AI Kees (in productie)
Draait als systemd service `tempetoto-bot` (chat-modus, polling).
Herstart na code-wijzigingen: `sudo systemctl restart tempetoto-bot`.

- **Chat:** reageert op @mention, "kees", Smit/uitslag-triggers en actieve gesprekken (Haiku, alleen read-tools)
- **Dagelijkse update:** zie component 3 (Sonnet, met write-tools)
- **Pre-match preview:** cron elke 5 min (`--pre-match`) post ~15 min vóór elke groepswedstrijd de voorspellingen
- Karakter: master Finance, piratenmasker, contrair, droge humor, finance-jargon spaarzaam — zie `AI_KEES_PROFIEL.md`

**Telegram-groep:** ✅ aangemaakt — chat ID `-5030253572`, bot `@ai_kees_bot` actief
**Configuratie:** `/home/floris/Tempetoto/.env` (niet in git)

---

## Openstaande acties voor Floris
1. **Voorspellingen verzamelen** — invulformulier versturen naar deelnemers, ingevulde bestanden terugkrijgen
2. **Voorspellingen verwerken** — ingevulde Excel-bestanden verwerken naar `data.js`
3. **AI Kees voorspellingen** — `maak_kees_voorspellingen.py` draaien vóór de aftrap (11 juni 2026)

---

## Git-werkwijze
- Commit format uitslagen: `Update uitslagen: [beschrijving]`
- Git config voor agent: `user.name "Tempetoto Agent"`, `user.email "agent@tempetoto.nl"`
- Push naar `main` triggert automatisch GitHub Pages deploy
