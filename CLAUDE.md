# Tempetoto 2026 — Claude context

WK 2026 voetbalpoule website voor een vriendengroep. Statische HTML/JS site op GitHub Pages.

## Repository
- GitHub: `Tempetoto69/Tempetoto69`
- Lokaal: `/home/floris/Tempetoto`
- Live: GitHub Pages (automatisch deploy bij push naar main)

## Bestanden
- `index.html` — volledige app (Excel-look UI + render logica)
- `data.js` — alle data: groepen, voorspellingen, uitslagen, scoring
- `AGENT_INSTRUCTIONS.md` — instructies voor automatisch uitslagen bijwerken
- `banner.png` — header afbeelding

## Deelnemers
EJ, Floris, Gautier, Giezen, Huttenhuis, Mark, Pieter, Slotboom, Smit, AI Kees

## Data structuur (data.js)
- `VOORSPELLINGEN[naam]` — per deelnemer: prematch, groepswedstrijden, top2, best3, KO
- `UITSLAGEN` — officiele resultaten: group (matchId→score), advancers, ko brackets/results, facts
- `SCORING` — puntensysteem (zie ook PUNTENTELLING array voor uitleg)
- `GROUP_MATCHES` — gegenereerd uit GROUPS + RR_PAIRS, matchId's lopen A1-L6

## Wat er al gedaan is
- Mobile-vriendelijke CSS toegevoegd (kleinere titelbalk, iOS dvh-fix, smooth scroll, grotere tabs)

## Wat nog moet gebeuren
- Voorspellingen invullen per deelnemer in `VOORSPELLINGEN`
- Uitslagen bijwerken in `UITSLAGEN.group` naarmate wedstrijden gespeeld worden
- KO brackets updaten met echte landnamen zodra die bekend zijn

## Werkwijze uitslagen bijwerken
Zie `AGENT_INSTRUCTIONS.md` voor volledige instructies. Kort:
1. Haal uitslagen op van FIFA + verificeer bij BBC/NOS
2. Pas alleen `data.js` aan
3. Commit met message: `Update uitslagen: [beschrijving]`
4. Git config: `user.name "Tempetoto Agent"`, `user.email "agent@tempetoto.nl"`
