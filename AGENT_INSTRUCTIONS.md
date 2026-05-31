# Tempetoto 2026 — Agent Instructies

Dit bestand wordt gelezen door de geautomatiseerde update-agent.
Voeg hier nieuwe richtlijnen toe; de agent volgt altijd de meest recente versie.

---

## Taak

Je werkt aan de **Tempetoto 2026** — een WK-voetbalpoule van een vriendengroep.
Je past het bestand `data.js` bij op basis van de meest recente WK-uitslagen,
en pusht de wijzigingen naar de GitHub-repository zodat de GitHub Pages site automatisch bijwerkt.

Repository: `https://github.com/Tempetoto69/Tempetoto69`

---

## Werkwijze

1. **Lees altijd eerst dit bestand** volledig voordat je iets doet.
2. **Zoek de meest recente WK 2026-uitslagen** op via het web (betrouwbare bronnen: FIFA.com, BBC Sport, ESPN, NOS Sport).
3. **Vergelijk** de gevonden uitslagen met wat al in `data.js` staat.
4. **Pas alleen aan wat nieuw is** — verander nooit bestaande uitslagen tenzij je een duidelijke fout ziet.
5. **Valideer** de data vóór je commit: controleer of scores het formaat `"thuis-uit"` hebben (bijv. `"2-1"`).
6. **Commit en push** met een duidelijke commit message die vermeldt welke wedstrijden zijn bijgewerkt.
7. **Doe niets** als er geen nieuwe uitslagen zijn — maak geen lege commits.

---

## Data structuur in data.js

### Groepswedstrijden
```javascript
UITSLAGEN.group["A1"] = "2-1"  // matchId -> "thuis-uit"
```
Match-IDs lopen van A1 t/m L6 (6 wedstrijden per groep, 12 groepen).

### Doorgegane landen
```javascript
UITSLAGEN.advancers.top2["A"] = ["Mexico", "Zuid-Korea"]  // winnaar eerst
UITSLAGEN.advancers.best3 = ["Marokko", "Japan", ...]     // 8 landen
```
Vul pas in als de groepsfase van die groep volledig klaar is.

### KO-uitslagen
```javascript
UITSLAGEN.ko.results.R32[0] = "1-0"   // index = positie in brackets array
UITSLAGEN.ko.brackets.R16[0] = {home: "Nederland", away: "Duitsland"}
```
Update `brackets` met de echte landnamen zodra die bekend zijn (na R32).
Update `results` met de uitslag na 90 minuten.

### Toernooi-feiten
```javascript
UITSLAGEN.facts.champion = "Argentinië"
UITSLAGEN.facts.finalist = "Frankrijk"
UITSLAGEN.facts.topscorers = ["Mbappé", "Messi", "Ronaldo"]  // 1e, 2e, 3e
UITSLAGEN.facts.topscorerGoals = 8
UITSLAGEN.facts.totalGoals = 163
UITSLAGEN.facts.yellow = 220
UITSLAGEN.facts.red = 8
```
Vul `facts` pas in als het toernooi voorbij is (of topscorer aan het einde van elke ronde).

---

## Landnamen

Gebruik **exact** de volgende spellingen (zoals in de GROUPS definitie in data.js):

Mexico, Zuid-Afrika, Zuid-Korea, Tsjechië, Canada, Zwitserland, Qatar, Bosnië-Herzegovina,
Brazilië, Marokko, Haïti, Schotland, Verenigde Staten, Paraguay, Australië, Turkije,
Duitsland, Curaçao, Ivoorkust, Ecuador, Nederland, Japan, Zweden, Tunesië,
België, Egypte, Iran, Nieuw-Zeeland, Spanje, Kaapverdië, Saoedi-Arabië, Uruguay,
Frankrijk, Senegal, Noorwegen, Irak, Argentinië, Algerije, Oostenrijk, Jordanië,
Portugal, DR Congo, Oezbekistan, Colombia, Engeland, Kroatië, Ghana, Panama

---

## Richtlijnen

- **Wees conservatief**: bij twijfel over een uitslag, voeg die niet toe en noteer het in de commit message.
- **Groepsfase**: vul `advancers.top2` en `advancers.best3` pas in als alle wedstrijden van een groep gespeeld zijn.
- **KO-bracket**: update `brackets` (met echte landen) zodra de tegenstanders bekend zijn — dus direct na de vorige ronde.
- **Spelersnamen topscorer**: gebruik de meest gangbare Nederlandse schrijfwijze of de officiële FIFA-naam.
- **Geen voorspellingen aanpassen**: pas nooit de `VOORSPELLINGEN` van deelnemers aan.
- **Authenticatie**: gebruik `git config user.name "Tempetoto Agent"` en `git config user.email "agent@tempetoto.nl"` voor commits.

---

## Commit message format

```
Update uitslagen: [beschrijving van wat er bijgewerkt is]

Bijv: "Update uitslagen: Groep A-D volledig, R32 wedstrijden 1-4"
```

---

## Wijzigingslog (door Floris)

*(Voeg hier nieuwe instructies of aanpassingen toe)*
