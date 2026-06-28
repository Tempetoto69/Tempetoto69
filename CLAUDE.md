# Tempetoto 2026 — Project bijbel

WK 2026 voetbalpoule voor een vriendengroep van 10 mensen. Statische HTML/JS website op GitHub Pages, aangevuld met een agent-systeem voor automatisch bijhouden van uitslagen en een Telegram-bot met AI-deelnemer.

## Repository & locatie
- **GitHub:** `Tempetoto69/Tempetoto69`
- **Lokaal:** `/home/floris/Tempetoto`
- **Live:** `Tempetoto69.github.io/Tempetoto69` (auto-deploy bij push naar main)
- **Hosting machine:** altijd aan, maar kan geen LLM lokaal draaien → LLM via API: Venice AI (Kimi K2, primair) + Claude API (fallback)

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
| `telegram_bot.py` | AI Kees bot: chat + versiebeheer (`VERSIE`), dagelijkse update (`--daily-update`), pre-match (`--pre-match`), uitslagen + na-wedstrijd recap (`--check-uitslagen`) |
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
    └── LLM (Kimi K2 via Venice; fallback Claude Sonnet) met tools:
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
(regex op UITSLAGEN.group, validatie + rollback), pushen, stand-snapshot. Daarna post Kees
ná elke groepswedstrijd een recap (Haiku): wie voorspelde het goed (exact goede toto =
eervolle vermelding) en wat het met de stand doet, met standbewustzijn (koploper loopt uit /
voorsprong slinkt). Helpers `_match_recap` (punten per wedstrijd) + `_recap_opdracht`.

**Doorgangers + KO-fase (deterministisch, API-gedreven — geen LLM):** dezelfde kwartiercheck
draait ook `sync_advancers_en_ko()` (eigen gate `_ko_sync_nodig`). Die leidt álles af uit de
football API: groepsdoorgangers (`advancers.top2` + beste 8 nummers 3) uit `standings` (FIFA-
tiebreakers al toegepast, incl. het 13e "Group Stage"-blok = ranglijst nummers 3), en per
KO-ronde de affiches (`ko.brackets`) + uitslagen (`ko.results`) uit de fixtures. De vaste
bracket-boom staat als `KO_TREE` in de code (FIFA M73-M104). Idempotent & self-healing:
elke run opnieuw afgeleid, write alleen bij wijziging (valideer_data.js + rollback), dan push.
Regels: **punten = stand na 90 min** (`score.fulltime`); **doorgang = echte winnaar** (API
winner-vlag, dus penalty's tellen voor de bracket maar niet voor de scorepunten).
**Toto bij gelijkspel:** voorspelt iemand een gelijkspel dat ook gelijk eindigt, dan krijgt hij
de toto-punten alleen als zijn **gekozen doorgaander** (`VOORSPELLINGEN[n].ko_door[ronde][i]`)
ook echt doorging (`UITSLAGEN.ko.door` = winnaar na verlenging/penalty's). De exacte-uitslag-
punten krijgt hij sowieso bij de juiste 90-min score. Deze logica zit gelijk in `bereken_stand.js`,
`valideer_data.js` (10 KO-testcases) én `index.html` (`scoreKo` met `predDoor`/`realDoor`).
De sync vult `UITSLAGEN.ko.door`; via de DM levert Floris de doorgaander aan (Kees vraagt erom
bij een gelijkspel zonder opgave), en Kees kiest er zelf één bij zijn eigen gelijkspel-picks.
Na elke nieuw afgeloten KO-wedstrijd post Kees een recap (zoals bij groepswedstrijden):
uitslag, wie door is (`advancer`) en — als iemand het voorspeld had — wie er punten pakte
(`_ko_match_recap` + `_ko_recap_opdracht`). Segment-winnaars (`meld_ronde_winnaar`) en
uitgeschakelde kampioenen (`meld_dode_kampioenen`) worden in de KO-fase óók vanuit deze
sync-tak gemeld (de groeps-check doet een vroege return zodra de groepsfase klaar is).
Topscorers en kaarten blijven bij de dagelijkse 08:00-update (Sonnet); champion/finalist ook.
**AI Kees vult zijn eigen KO-voorspellingen automatisch in** (`genereer_kees_ko`, eigen tak in
de kwartiercheck): zodra een ronde onthuld is voorspelt hij in karakter (Venice/Kimi) elke
nog-niet-begonnen wedstrijd, via dezelfde veilige schrijfroute als de DM-invoer. Eerlijkheids-
regel: alleen wedstrijden met aftrap in de toekomst (`_kees_ko_te_voorspellen`), idempotent
(vult enkel lege slots). Zo voorspelt hij nooit ná een uitslag.

### ✅ 4. Telegram-bot + AI Kees (in productie)
Draait als systemd service `tempetoto-bot` (chat-modus, polling).
Herstart na code-wijzigingen: `sudo systemctl restart tempetoto-bot`.

- **Chat:** reageert op @mention, "kees", Smit/uitslag-triggers en actieve gesprekken (Haiku, alleen read-tools). Bij doorpraten zónder mention/"kees" beoordeelt hij zelf of het aan hem gericht is en zwijgt anders (`[stil]` → niets posten). Per-gesprek venster (`laatste_kees_reactie`), niet per gebruiker. Bij een mention een korte luister-pauze + context van de berichten eromheen. Mag ook over niet-voetbal kletsen; verzint geen feiten (checkt poule-data via tools).
  - **Chat-tools (read-only):** `get_schedule`, `get_standings`, `get_data` (volledige data.js), `get_voorspellingen` (overzicht voorspellingen per categorie: kampioen/verrassing/deceptie/topscorer/goals/kaarten/top2/best3), `get_live` (lopende wedstrijden via football API + per deelnemer toto_nu/exact_nu + **virtuele stand** met delta t.o.v. officieel), `fetch_url`. Kees kan álle data lezen/analyseren/samenvatten maar in de chat **nooit** wijzigen.
  - **Virtuele stand:** `get_live` overlayt live-scores op `UITSLAGEN.group` via env `STAND_OVERLAY` op `bereken_stand.js` (zelfde scoring-logica, normale berekening onveranderd zonder env).
- **Read-only commando's (deterministisch, geen LLM, schrijven niets):** `/stand`, `/virtuelestand`, `/totaalgoals` (`/doelpunten`), `/gelekaarten`, `/rodekaarten`, `/laatste` (`/recent`, punten per wedstrijd van vandaag/gisteren) en `/<naam>` per deelnemer (`/giezen`, `/smit`, `/kees` = AI Kees, …) → samenvatting met recente vorm + prematch-keuzes en status (kampioen nog in de race of uitgeschakeld). Speler-commando's worden bij opstart uit `DEELNEMERS` gegenereerd (`SPELER_MAP`). `/help` somt alles op; de kerncommando's staan in Telegram's `/`-menu via `set_my_commands` (`BOT_COMMAND_MENU`, gezet in de `_on_startup` post_init-hook samen met de versie-aankondiging).
- **KO-voorspellingen aanleveren via privé-DM (alleen Floris):** in een privégesprek stuurt Floris de KO-voorspellingen van deelnemers als **tekst** (bv. "Giezen:\nZuid-Afrika-Canada 2-1\n…"). Kees parseert (LLM, alleen extractie via Venice/Kimi), matcht teams **deterministisch** op de juiste bracket-slot (incl. home/away-oriëntatie), toont een samenvatting en wacht op bevestiging ("ja"). Bij een **voorspeld gelijkspel** vraagt Kees expliciet wie er doorgaat vóór hij opslaat (`_vraag_doorgaanders` / `_resolve_missing`, pending state met `missing`). Pas dan schrijven + pushen, in een idempotent beheerd blok `VOORSPELLINGEN["X"].ko = {…}` net vóór `const UITSLAGEN` (validatie + rollback; alleen scores/landnamen, niets uitvoerbaars). Handler `handle_floris_dm` (gate op `FLORIS_ID` + private chat); helpers `_verwerk_ko_invoer` / `_schrijf_ko_voorspellingen`. Pending state in-memory tot bevestiging. Bedoeld voor KO-rondes (R32 → finale); de Excel-route blijft voor de initiële voorspellingen.
- **Dagelijkse update:** zie component 3 (Sonnet, met write-tools)
- **Pre-match preview:** cron elke 5 min (`--pre-match`) post ~15 min vóór elke groepswedstrijd de voorspellingen
- **Versiebeheer:** `VERSIE`-constante; bij een versie-bump kondigt Kees bij opstart één keer een korte "KeesOS X.YZ"-changelog aan (`VERSIE_NOTITIES`, dedup via `versie`-key in `geposte_updates.json`). Markeert pas ná een geslaagde post.
- Karakter: master Finance, piratenmasker, contrair, droge humor + sass, finance-jargon spaarzaam. **Sinds v2.34** ook door en door corrupt (omkoopbaar in woord, nooit in daad — wijzigt/verzint nooit echt iets) en schaamteloos/tactloos, lapt fatsoensnormen aan zijn laars (gevatte pikzwarte vriendengroep-humor, geen echte haat/bedreigingen) — zie `AI_KEES_PROFIEL.md`

**Telegram-groep:** ✅ aangemaakt — chat ID `-5030253572`, bot `@ai_kees_bot` actief
**Configuratie:** `/home/floris/Tempetoto/.env` (niet in git)

---

## Openstaande acties voor Floris
- ✅ Alle 10 voorspellingen verwerkt (laatste: Daniel, 11 juni) en AI Kees' voorspellingen staan.
- WK loopt sinds 11 juni 2026: de bot draait de uitslagen/recap/stand-flow nu autonoom.
- Nieuwe formulieren verwerken kan altijd nog met `python3 verwerk_voorspelling.py <naam>.xlsx`.

---

## Git-werkwijze
- Commit format uitslagen: `Update uitslagen: [beschrijving]`
- Git config voor agent: `user.name "Tempetoto Agent"`, `user.email "agent@tempetoto.nl"`
- Push naar `main` triggert automatisch GitHub Pages deploy
