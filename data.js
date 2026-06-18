// ============================================================
//  TEMPETOTO 2026 — DATA
//  Pas dit bestand aan om voorspellingen en uitslagen bij te werken.
//  Banner aanpassen: vervang banner.png door een nieuwe afbeelding.
// ============================================================

//  TEMPETOTO 2026 — DATA
//  Alles wat ingevuld moet worden staat in dit bestand.
//  Lever nieuwe voorspellingen/uitslagen aan, dan werk ik dit bij.
// ============================================================

// ---- Groepen (definitief, WK 2026) ----
const GROUPS = {
  A: ["Mexico","Zuid-Afrika","Zuid-Korea","Tsjechië"],
  B: ["Canada","Zwitserland","Qatar","Bosnië-Herzegovina"],
  C: ["Brazilië","Marokko","Haïti","Schotland"],
  D: ["Verenigde Staten","Paraguay","Australië","Turkije"],
  E: ["Duitsland","Curaçao","Ivoorkust","Ecuador"],
  F: ["Nederland","Japan","Zweden","Tunesië"],
  G: ["België","Egypte","Iran","Nieuw-Zeeland"],
  H: ["Spanje","Kaapverdië","Saoedi-Arabië","Uruguay"],
  I: ["Frankrijk","Senegal","Noorwegen","Irak"],
  J: ["Argentinië","Algerije","Oostenrijk","Jordanië"],
  K: ["Portugal","DR Congo","Oezbekistan","Colombia"],
  L: ["Engeland","Kroatië","Ghana","Panama"],
};

const FLAGS = {
  "Mexico":"🇲🇽","Zuid-Afrika":"🇿🇦","Zuid-Korea":"🇰🇷","Tsjechië":"🇨🇿",
  "Canada":"🇨🇦","Zwitserland":"🇨🇭","Qatar":"🇶🇦","Bosnië-Herzegovina":"🇧🇦",
  "Brazilië":"🇧🇷","Marokko":"🇲🇦","Haïti":"🇭🇹","Schotland":"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  "Verenigde Staten":"🇺🇸","Paraguay":"🇵🇾","Australië":"🇦🇺","Turkije":"🇹🇷",
  "Duitsland":"🇩🇪","Curaçao":"🇨🇼","Ivoorkust":"🇨🇮","Ecuador":"🇪🇨",
  "Nederland":"🇳🇱","Japan":"🇯🇵","Zweden":"🇸🇪","Tunesië":"🇹🇳",
  "België":"🇧🇪","Egypte":"🇪🇬","Iran":"🇮🇷","Nieuw-Zeeland":"🇳🇿",
  "Spanje":"🇪🇸","Kaapverdië":"🇨🇻","Saoedi-Arabië":"🇸🇦","Uruguay":"🇺🇾",
  "Frankrijk":"🇫🇷","Senegal":"🇸🇳","Noorwegen":"🇳🇴","Irak":"🇮🇶",
  "Argentinië":"🇦🇷","Algerije":"🇩🇿","Oostenrijk":"🇦🇹","Jordanië":"🇯🇴",
  "Portugal":"🇵🇹","DR Congo":"🇨🇩","Oezbekistan":"🇺🇿","Colombia":"🇨🇴",
  "Engeland":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Kroatië":"🇭🇷","Ghana":"🇬🇭","Panama":"🇵🇦",
};

// Kleurblokje per land — nationale primaire kleur (shirt/vlag)
const TEAMCOLORS = {
  // Groep A
  "Mexico":"#006847","Zuid-Afrika":"#ffb612","Zuid-Korea":"#cd2e3a","Tsjechië":"#d7141a",
  // Groep B
  "Canada":"#ff0000","Zwitserland":"#d52b1e","Qatar":"#8a1538","Bosnië-Herzegovina":"#002395",
  // Groep C
  "Brazilië":"#fcd116","Marokko":"#c1272d","Haïti":"#00209f","Schotland":"#003da5",
  // Groep D
  "Verenigde Staten":"#002868","Paraguay":"#cf2229","Australië":"#ffcd00","Turkije":"#e30a17",
  // Groep E
  "Duitsland":"#000000","Curaçao":"#002b7f","Ivoorkust":"#f77f00","Ecuador":"#ffd700",
  // Groep F
  "Nederland":"#ff6a13","Japan":"#003399","Zweden":"#fecc02","Tunesië":"#e70013",
  // Groep G
  "België":"#e30613","Egypte":"#ce1126","Iran":"#239f40","Nieuw-Zeeland":"#00247d",
  // Groep H
  "Spanje":"#aa151b","Kaapverdië":"#003893","Saoedi-Arabië":"#006c35","Uruguay":"#5b92e5",
  // Groep I
  "Frankrijk":"#0055a4","Senegal":"#00853f","Noorwegen":"#ba0c2f","Irak":"#ce1126",
  // Groep J
  "Argentinië":"#74acdf","Algerije":"#006233","Oostenrijk":"#ed2939","Jordanië":"#1a1a1a",
  // Groep K
  "Portugal":"#cc0000","DR Congo":"#007fff","Oezbekistan":"#1eb53a","Colombia":"#fcd116",
  // Groep L
  "Engeland":"#001a57","Kroatië":"#c8102e","Ghana":"#ffd100","Panama":"#da121a",
};

// Officiële FIFA-volgorde per groep (geverifieerd via Wikipedia, juni 2026)
const GROUP_PAIRS = {
  A: [[0,1],[2,3],[3,1],[0,2],[3,0],[1,2]],
  B: [[0,3],[2,1],[1,3],[0,2],[1,0],[3,2]],
  C: [[0,1],[2,3],[3,1],[0,2],[3,0],[1,2]],
  D: [[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
  E: [[0,1],[2,3],[0,2],[3,1],[1,2],[3,0]],
  F: [[0,1],[2,3],[0,2],[3,1],[1,2],[3,0]],
  G: [[0,1],[2,3],[0,2],[3,1],[1,2],[3,0]],
  H: [[0,1],[2,3],[0,2],[3,1],[1,2],[3,0]],
  I: [[0,1],[3,2],[0,3],[2,1],[2,0],[1,3]],
  J: [[0,1],[2,3],[0,2],[3,1],[1,2],[3,0]],
  K: [[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
  L: [[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]],
};
function buildGroupMatches(){
  const m=[];
  for(const g of Object.keys(GROUPS)){
    const t=GROUPS[g]; let n=1;
    for(const [a,b] of GROUP_PAIRS[g]){ m.push({id:`${g}${n}`,group:g,home:t[a],away:t[b]}); n++; }
  }
  return m;
}
const GROUP_MATCHES = buildGroupMatches();

// ---- Knock-out rondes (5) ----
const KO_ROUNDS = [
  {key:"R32",naam:"Ronde van 32",toto:5, exact:3},
  {key:"R16",naam:"Ronde van 16",toto:7, exact:4},
  {key:"KF", naam:"Kwartfinales", toto:9, exact:5},
  {key:"HF", naam:"Halve finales",toto:11,exact:6},
  {key:"F",  naam:"Finale",       toto:13,exact:7},
];

// FIFA-ranking posities (1 apr 2026). Top-20 exact; lager geschat. Italië speelt geen WK.
const RANKING = {
  "Frankrijk":1,"Spanje":2,"Argentinië":3,"Engeland":4,"Portugal":5,"Brazilië":6,
  "Nederland":7,"Marokko":8,"België":9,"Duitsland":10,"Kroatië":11,"Colombia":13,
  "Senegal":14,"Mexico":15,"Verenigde Staten":16,"Uruguay":17,"Japan":18,"Zwitserland":19,
  "Iran":21,"Oostenrijk":22,"Zuid-Korea":23,"Australië":24,"Ecuador":25,"Noorwegen":26,
  "Panama":30,"Egypte":32,"Algerije":36,"Paraguay":38,"Ivoorkust":40,"Tunesië":41,
  "Schotland":42,"Zweden":43,"Tsjechië":44,"Qatar":51,"Oezbekistan":54,"DR Congo":56,
  "Saoedi-Arabië":58,"Irak":59,"Zuid-Afrika":60,"Jordanië":64,"Kaapverdië":70,"Ghana":73,
  "Bosnië-Herzegovina":74,"Haïti":83,"Nieuw-Zeeland":86,"Curaçao":90,
};

// Puntentelling. Verrassing/deceptie schalen met de FIFA-ranking (onwaarschijnlijkheid).
const SCORING = {
  group:{toto:3,exact:2},
  advance:{perTeam:3},
  champion:{winner:40,finalist:16},
  // verrassing: basis per ronde x onwaarschijnlijkheidsfactor (zie surpriseFactor) — MEDIUM
  surprise:{base:{R16:7,KF:12,HF:18,F:25,winner:33}},
  // deceptie: basis per uitschakelronde x favoriet-factor (zie deceptionFactor) — MEDIUM
  deception:{base:{KF:6,R16:11,R32:16,groep:24}},
  topscorer:{p1:35,p2:18,p3:9,exactGoals:8},
  totalGoals:{exact:25,perDiff:1},
  cards:{exact:12,perDiff:1},
};

// Outsider-factor: hoger naarmate het land lager gerankt is (onwaarschijnlijker)
function surpriseFactor(land){
  const pos=RANKING[land]||50;
  return Math.pow(pos/13, 0.45);
}
// Favoriet-factor: hoger naarmate het land hóger gerankt is (grotere deceptie)
function deceptionFactor(land){
  const pos=RANKING[land]||13;
  return (13-pos+3)/12;
}

// Favorieten = top-12 van de FIFA-ranking (1 apr 2026) onder de WK-deelnemers.
// Italië staat 12e op de wereldranglijst maar speelt geen WK; Colombia schuift door.
const FAVORIETEN = ["Frankrijk","Spanje","Argentinië","Engeland","Portugal","Brazilië","Nederland","Marokko","België","Duitsland","Kroatië","Colombia"];
function isFavoriet(land){ return FAVORIETEN.includes(land); }
function alleOutsiders(){ return Object.values(GROUPS).flat().filter(l=>!isFavoriet(l)).sort((a,b)=>a.localeCompare(b,"nl")); }

const FAVORITES = ["Frankrijk","Spanje","Argentinië","Engeland","Portugal","Brazilië","Nederland","Marokko","België","Duitsland"];
const OUTSIDERS = ["Nieuw-Zeeland","Haïti","Curaçao","Ghana","Kaapverdië","Bosnië-Herzegovina","Jordanië","Oezbekistan","Irak","Zuid-Afrika","Panama"];

// ---- Spelregels (uit de originele Tempetoto, bijgewerkt naar WK 2026-format) ----
const SPELREGELS = [
  "De voorspellingen voor de groepswedstrijden geef je vóór aanvang van het WK door (lichtblauwe vakjes).",
  "Vooraf voorspel je per groep welke 2 landen doorgaan, én de 8 beste nummers 3 van het toernooi; dit moet overeenkomen met je wedstrijd-voorspellingen.",
  "Verder voorspel je vooraf de kampioen, de 'verrassing' en de 'deceptie' van het toernooi, de topscorer + gescoorde goals, en het totaal aantal goals en gele/rode kaarten.",
  "De voorspellingen voor de knock-outwedstrijden geef je steeds na de vorige ronde, maar vóór begin van de volgende ronde door.",
  "Wijzigen van voorspellingen kan niet meer tijdens de groepsfase.",
  "In principe worden de FIFA WK-regels aangehouden. Bij twijfel beslist de organisator.",
];

// ---- Puntentelling (label, uitleg) ----
const PUNTENTELLING = [
  ["Groepswedstrijden:","Een goede 'toto' (winst, gelijkspel of verlies) levert 3 punten op. Goede uitslag +2 pt."],
  ["Knock-outrondes:","Goede 'toto' [en goede uitslag]: R32 5 [+3], R16 7 [+4], KF 9 [+5], HF 11 [+6], F 13 [+7] pt. NB: voorspel de winnaar indien gelijk na 90 min. Uitslag na 90 min telt voor de puntentelling."],
  ["Doorgaan (top-2):","Per goed voorspeld land dat als 1e of 2e doorgaat: 3 punten."],
  ["Beste nummers 3:","Per goed voorspelde nummer 3 die doorgaat: 3 punten (8 plekken)."],
  ["Kampioen:","Voorspeld land verliezend finalist: 16 punten. Kampioen: 40 punten."],
  ["Topscorer:","Speler 3e plaats op de topscorerslijst: 9 pt; 2e plaats 18 pt; 1e plaats 35 pt. Correct aantal goals: +8 pt."],
  ["Totaal aantal goals:","Voorspeld aantal exact goed: 25 pt. Eén goal verschil: 24 pt, twee: 23, drie: 22, enz."],
  ["Verrassing:","Kies een land BUITEN de top-12. Punten naar hoe ver het komt (R16 → winnaar) én hoe onwaarschijnlijk het land is volgens de FIFA-ranking: hoe lager gerankt, hoe meer punten. Zie de verrassingstabel."],
  ["Deceptie:","Kies een land UIT de top-12 (de favorieten). Punten naar hoe vroeg het faalt (groepsfase eruit = meest) én hoe hoog het gerankt staat: hoe groter de favoriet, hoe meer punten. Zie de deceptietabel."],
  ["Gele/rode kaarten:","Voorspeld aantal exact goed: 12 pt. Eén kaart verschil: 11 pt, twee: 10, drie: 9, enz. (geel en rood apart)."],
];

// ============================================================
//  DEELNEMERS — voorspellingen
//  Per deelnemer:
//   prematch: kampioen, verrassing, deceptie, topscorer(+goals), totalGoals, geel, rood
//   group:    { "A1":"2-1", ... }  (matchId -> "thuis-uit", leeg "" = nog niet)
//   top2:     { A:["land","land"], ... }  voorspelde 1e+2e per groep
//   best3:    ["land", ...]  voorspelde 8 beste nummers 3
//   ko:       { R32:["2-1",...], R16:[...], ... } uitslag na 90'
// ============================================================
const DEELNEMERS = [
  "EJ","Floris","Daniel","Giezen","Huttenhuis","Mark","Pieter","Slotboom","Smit","AI Kees"
];

// leeg sjabloon per deelnemer (wordt gevuld zodra voorspellingen binnen zijn)
function leegVoorspelling(){
  return {
    prematch:{champion:"",finalist_predicted:"",surprise:"",deception:"",topscorer:"",topscorerGoals:"",totalGoals:"",yellow:"",red:""},
    group:{}, top2:{}, best3:[], ko:{R32:[],R16:[],KF:[],HF:[],F:[]},
  };
}

// VOORSPELLINGEN: hier komt per deelnemer de ingevulde data.
// Nu nog leeg — lever de voorspellingen aan en ik vul ze hier in.
const VOORSPELLINGEN = {};
DEELNEMERS.forEach(n=>{ VOORSPELLINGEN[n]=leegVoorspelling(); });

// >>> VOORSPELLING Daniel (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Daniel"], {
  "prematch": {
    "champion": "Brazilië",
    "finalist_predicted": "",
    "surprise": "Schotland",
    "deception": "Marokko",
    "topscorer": "Messi",
    "topscorerGoals": 8,
    "totalGoals": 134,
    "yellow": 126,
    "red": 14
  },
  "group": {
    "A1": "2-1",
    "B1": "2-0",
    "A2": "0-2",
    "B2": "1-3",
    "A3": "2-0",
    "B3": "2-0",
    "A4": "2-1",
    "B4": "2-1",
    "A5": "1-1",
    "B5": "1-0",
    "A6": "0-2",
    "B6": "1-0",
    "C1": "2-0",
    "D1": "1-2",
    "C2": "1-3",
    "D2": "1-1",
    "C3": "1-0",
    "D3": "1-2",
    "C4": "4-0",
    "D4": "1-1",
    "C5": "0-1",
    "D5": "1-0",
    "C6": "2-0",
    "D6": "2-1",
    "E1": "2-0",
    "F1": "1-0",
    "E2": "1-2",
    "F2": "2-1",
    "E3": "2-0",
    "F3": "1-1",
    "E4": "2-0",
    "F4": "1-2",
    "E5": "2-1",
    "F5": "1-2",
    "E6": "1-2",
    "F6": "3-0",
    "G1": "2-0",
    "H1": "3-0",
    "G2": "1-1",
    "H2": "1-2",
    "G3": "2-0",
    "H3": "2-0",
    "G4": "1-1",
    "H4": "2-0",
    "G5": "1-2",
    "H5": "0-1",
    "G6": "0-2",
    "H6": "1-2",
    "I1": "3-0",
    "J1": "2-1",
    "I2": "0-1",
    "J2": "2-0",
    "I3": "2-0",
    "J3": "2-1",
    "I4": "2-0",
    "J4": "1-2",
    "I5": "1-2",
    "J5": "1-2",
    "I6": "1-0",
    "J6": "0-2",
    "K1": "2-0",
    "L1": "1-2",
    "K2": "0-2",
    "L2": "2-1",
    "K3": "2-1",
    "L3": "1-2",
    "K4": "2-0",
    "L4": "1-2",
    "K5": "1-1",
    "L5": "1-2",
    "K6": "0-0",
    "L6": "1-1"
  },
  "top2": {
    "A": [
      "Tsjechië",
      "Mexico"
    ],
    "B": [
      "Zwitserland",
      "Canada"
    ],
    "C": [
      "Brazilië",
      "Schotland"
    ],
    "D": [
      "Paraguay",
      "Australië"
    ],
    "E": [
      "Duitsland",
      "Ecuador"
    ],
    "F": [
      "Nederland",
      "Zweden"
    ],
    "G": [
      "België",
      "Iran"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Colombia"
    ],
    "L": [
      "Kroatië",
      "Ghana"
    ]
  },
  "best3": [
    "Verenigde Staten",
    "Senegal",
    "Marokko",
    "Curaçao",
    "Engeland",
    "Zuid-Korea",
    "Oezbekistan",
    "Japan"
  ]
});
// <<< VOORSPELLING Daniel

// >>> VOORSPELLING Floris (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Floris"], {
  "prematch": {
    "champion": "Nederland",
    "finalist_predicted": "",
    "surprise": "Canada",
    "deception": "Frankrijk",
    "topscorer": "Koning Gakpo",
    "topscorerGoals": 6,
    "totalGoals": 281,
    "yellow": 333,
    "red": 13
  },
  "group": {
    "A1": "1-0",
    "B1": "2-0",
    "A2": "2-1",
    "B2": "0-1",
    "A3": "2-1",
    "B3": "1-0",
    "A4": "2-2",
    "B4": "3-0",
    "A5": "0-1",
    "B5": "1-1",
    "A6": "2-3",
    "B6": "2-1",
    "C1": "3-1",
    "D1": "2-1",
    "C2": "0-2",
    "D2": "1-1",
    "C3": "2-3",
    "D3": "2-0",
    "C4": "4-0",
    "D4": "1-0",
    "C5": "1-2",
    "D5": "1-2",
    "C6": "3-1",
    "D6": "0-1",
    "E1": "3-0",
    "F1": "2-1",
    "E2": "1-1",
    "F2": "3-0",
    "E3": "1-1",
    "F3": "1-0",
    "E4": "1-0",
    "F4": "0-2",
    "E5": "1-2",
    "F5": "1-0",
    "E6": "1-2",
    "F6": "0-3",
    "G1": "3-0",
    "H1": "5-0",
    "G2": "2-1",
    "H2": "0-3",
    "G3": "1-1",
    "H3": "2-1",
    "G4": "0-1",
    "H4": "2-1",
    "G5": "0-1",
    "H5": "1-0",
    "G6": "1-4",
    "H6": "2-2",
    "I1": "1-1",
    "J1": "2-0",
    "I2": "0-2",
    "J2": "3-0",
    "I3": "3-2",
    "J3": "1-1",
    "I4": "2-0",
    "J4": "1-2",
    "I5": "1-1",
    "J5": "1-2",
    "I6": "2-0",
    "J6": "0-0",
    "K1": "2-0",
    "L1": "2-2",
    "K2": "0-4",
    "L2": "2-1",
    "K3": "3-0",
    "L3": "1-0",
    "K4": "2-1",
    "L4": "1-2",
    "K5": "3-3",
    "L5": "0-4",
    "K6": "1-0",
    "L6": "2-1"
  },
  "top2": {
    "A": [
      "Mexico",
      "Zuid-Korea"
    ],
    "B": [
      "Canada",
      "Bosnië-Herzegovina"
    ],
    "C": [
      "Brazilië",
      "Marokko"
    ],
    "D": [
      "Verenigde Staten",
      "Turkije"
    ],
    "E": [
      "Duitsland",
      "Ivoorkust"
    ],
    "F": [
      "Nederland",
      "Japan"
    ],
    "G": [
      "België",
      "Iran"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Noorwegen",
      "Frankrijk"
    ],
    "J": [
      "Oostenrijk",
      "Argentinië"
    ],
    "K": [
      "Colombia",
      "Portugal"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Senegal",
    "Ecuador",
    "Australië",
    "Zweden",
    "Schotland",
    "Tsjechië",
    "Ghana",
    "Algerije"
  ]
});
// <<< VOORSPELLING Floris

// >>> VOORSPELLING EJ (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["EJ"], {
  "prematch": {
    "champion": "Spanje",
    "finalist_predicted": "",
    "surprise": "Noorwegen",
    "deception": "Argentinië",
    "topscorer": "YAMAL",
    "topscorerGoals": 8,
    "totalGoals": 280,
    "yellow": 360,
    "red": 16
  },
  "group": {
    "A1": "2-0",
    "B1": "1-0",
    "A2": "2-1",
    "B2": "0-3",
    "A3": "2-1",
    "B3": "2-1",
    "A4": "1-0",
    "B4": "3-1",
    "A5": "0-2",
    "B5": "2-1",
    "A6": "0-2",
    "B6": "2-0",
    "C1": "2-1",
    "D1": "2-1",
    "C2": "0-2",
    "D2": "1-3",
    "C3": "0-1",
    "D3": "2-0",
    "C4": "3-0",
    "D4": "2-1",
    "C5": "2-3",
    "D5": "1-1",
    "C6": "2-0",
    "D6": "2-1",
    "E1": "3-0",
    "F1": "1-0",
    "E2": "1-1",
    "F2": "2-1",
    "E3": "2-1",
    "F3": "2-1",
    "E4": "2-0",
    "F4": "0-2",
    "E5": "0-3",
    "F5": "1-0",
    "E6": "0-1",
    "F6": "0-2",
    "G1": "2-0",
    "H1": "4-0",
    "G2": "2-0",
    "H2": "0-2",
    "G3": "2-1",
    "H3": "3-0",
    "G4": "0-3",
    "H4": "2-0",
    "G5": "2-1",
    "H5": "0-1",
    "G6": "0-3",
    "H6": "1-2",
    "I1": "2-1",
    "J1": "2-0",
    "I2": "0-2",
    "J2": "2-0",
    "I3": "3-0",
    "J3": "2-1",
    "I4": "2-1",
    "J4": "0-1",
    "I5": "0-1",
    "J5": "0-1",
    "I6": "2-0",
    "J6": "0-3",
    "K1": "2-0",
    "L1": "2-1",
    "K2": "0-2",
    "L2": "2-1",
    "K3": "3-0",
    "L3": "2-0",
    "K4": "2-1",
    "L4": "0-1",
    "K5": "1-2",
    "L5": "0-2",
    "K6": "1-0",
    "L6": "2-1"
  },
  "top2": {
    "A": [
      "Mexico",
      "Zuid-Korea"
    ],
    "B": [
      "Zwitserland",
      "Canada"
    ],
    "C": [
      "Brazilië",
      "Marokko"
    ],
    "D": [
      "Turkije",
      "Verenigde Staten"
    ],
    "E": [
      "Duitsland",
      "Ivoorkust"
    ],
    "F": [
      "Nederland",
      "Japan"
    ],
    "G": [
      "België",
      "Egypte"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Colombia"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Tsjechië",
    "Bosnië-Herzegovina",
    "Schotland",
    "Paraguay",
    "Ecuador",
    "Zweden",
    "Senegal",
    "Ghana"
  ]
});
// <<< VOORSPELLING EJ

// >>> VOORSPELLING Slotboom (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Slotboom"], {
  "prematch": {
    "champion": "Engeland",
    "finalist_predicted": "",
    "surprise": "Verenigde Staten",
    "deception": "Marokko",
    "topscorer": "Kane",
    "topscorerGoals": 8,
    "totalGoals": 276,
    "yellow": 362,
    "red": 11
  },
  "group": {
    "A1": "2-0",
    "B1": "1-0",
    "A2": "1-1",
    "B2": "0-3",
    "A3": "1-0",
    "B3": "2-0",
    "A4": "1-0",
    "B4": "2-0",
    "A5": "0-1",
    "B5": "0-1",
    "A6": "0-1",
    "B6": "2-0",
    "C1": "2-1",
    "D1": "1-0",
    "C2": "0-2",
    "D2": "0-1",
    "C3": "0-1",
    "D3": "2-0",
    "C4": "4-0",
    "D4": "1-0",
    "C5": "0-2",
    "D5": "1-2",
    "C6": "2-0",
    "D6": "1-0",
    "E1": "4-0",
    "F1": "2-1",
    "E2": "1-1",
    "F2": "1-0",
    "E3": "2-0",
    "F3": "2-0",
    "E4": "2-0",
    "F4": "0-1",
    "E5": "0-2",
    "F5": "1-0",
    "E6": "0-1",
    "F6": "0-2",
    "G1": "2-1",
    "H1": "4-0",
    "G2": "1-0",
    "H2": "0-2",
    "G3": "2-0",
    "H3": "3-0",
    "G4": "0-1",
    "H4": "2-0",
    "G5": "1-0",
    "H5": "1-1",
    "G6": "0-2",
    "H6": "0-1",
    "I1": "1-0",
    "J1": "2-0",
    "I2": "0-3",
    "J2": "2-0",
    "I3": "3-0",
    "J3": "2-0",
    "I4": "1-0",
    "J4": "0-2",
    "I5": "0-1",
    "J5": "0-1",
    "I6": "2-0",
    "J6": "0-3",
    "K1": "2-0",
    "L1": "1-0",
    "K2": "0-2",
    "L2": "1-0",
    "K3": "2-0",
    "L3": "2-0",
    "K4": "2-0",
    "L4": "0-2",
    "K5": "0-1",
    "L5": "0-2",
    "K6": "1-0",
    "L6": "1-0"
  },
  "top2": {
    "A": [
      "Mexico",
      "Tsjechië"
    ],
    "B": [
      "Canada",
      "Zwitserland"
    ],
    "C": [
      "Brazilië",
      "Marokko"
    ],
    "D": [
      "Verenigde Staten",
      "Turkije"
    ],
    "E": [
      "Duitsland",
      "Ecuador"
    ],
    "F": [
      "Nederland",
      "Japan"
    ],
    "G": [
      "België",
      "Egypte"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Colombia"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Zweden",
    "Zuid-Korea",
    "Paraguay",
    "Ivoorkust",
    "Bosnië-Herzegovina",
    "Schotland",
    "Senegal",
    "Algerije"
  ]
});
// <<< VOORSPELLING Slotboom

// >>> VOORSPELLING Huttenhuis (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Huttenhuis"], {
  "prematch": {
    "champion": "Spanje",
    "finalist_predicted": "",
    "surprise": "Noorwegen",
    "deception": "Kroatië",
    "topscorer": "Mbappe",
    "topscorerGoals": 9,
    "totalGoals": 282,
    "yellow": 395,
    "red": 11
  },
  "group": {
    "A1": "2-0",
    "B1": "2-0",
    "A2": "1-0",
    "B2": "0-2",
    "A3": "1-0",
    "B3": "2-0",
    "A4": "1-0",
    "B4": "2-0",
    "A5": "0-1",
    "B5": "2-1",
    "A6": "0-1",
    "B6": "2-0",
    "C1": "1-0",
    "D1": "2-1",
    "C2": "0-1",
    "D2": "0-1",
    "C3": "0-1",
    "D3": "2-0",
    "C4": "3-0",
    "D4": "2-0",
    "C5": "0-2",
    "D5": "1-2",
    "C6": "2-0",
    "D6": "1-0",
    "E1": "3-0",
    "F1": "2-1",
    "E2": "0-1",
    "F2": "1-0",
    "E3": "2-0",
    "F3": "1-0",
    "E4": "2-0",
    "F4": "0-1",
    "E5": "0-2",
    "F5": "1-1",
    "E6": "0-1",
    "F6": "0-2",
    "G1": "1-0",
    "H1": "3-0",
    "G2": "1-0",
    "H2": "0-2",
    "G3": "2-0",
    "H3": "2-0",
    "G4": "0-1",
    "H4": "2-0",
    "G5": "1-0",
    "H5": "1-1",
    "G6": "0-2",
    "H6": "1-2",
    "I1": "2-1",
    "J1": "2-0",
    "I2": "0-2",
    "J2": "2-0",
    "I3": "3-0",
    "J3": "2-0",
    "I4": "2-1",
    "J4": "0-1",
    "I5": "0-1",
    "J5": "0-1",
    "I6": "2-0",
    "J6": "0-2",
    "K1": "2-0",
    "L1": "1-0",
    "K2": "0-2",
    "L2": "1-0",
    "K3": "2-0",
    "L3": "2-0",
    "K4": "1-0",
    "L4": "0-1",
    "K5": "1-1",
    "L5": "0-2",
    "K6": "1-1",
    "L6": "1-0"
  },
  "top2": {
    "A": [
      "Mexico",
      "Zuid-Korea"
    ],
    "B": [
      "Zwitserland",
      "Canada"
    ],
    "C": [
      "Brazilië",
      "Marokko"
    ],
    "D": [
      "Verenigde Staten",
      "Turkije"
    ],
    "E": [
      "Duitsland",
      "Ecuador"
    ],
    "F": [
      "Nederland",
      "Japan"
    ],
    "G": [
      "België",
      "Egypte"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Colombia"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Ivoorkust",
    "Zweden",
    "Senegal",
    "Ghana",
    "Schotland",
    "Iran",
    "Algerije"
  ]
});
// <<< VOORSPELLING Huttenhuis

// >>> VOORSPELLING Mark (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Mark"], {
  "prematch": {
    "champion": "Spanje",
    "finalist_predicted": "",
    "surprise": "Noorwegen",
    "deception": "Kroatië",
    "topscorer": "Kylian Mbappe",
    "topscorerGoals": 4,
    "totalGoals": 288,
    "yellow": 388,
    "red": 16
  },
  "group": {
    "A1": "2-0",
    "B1": "1-0",
    "A2": "1-1",
    "B2": "0-3",
    "A3": "2-1",
    "B3": "1-0",
    "A4": "2-0",
    "B4": "2-0",
    "A5": "0-1",
    "B5": "1-0",
    "A6": "0-1",
    "B6": "1-0",
    "C1": "1-0",
    "D1": "1-0",
    "C2": "0-2",
    "D2": "0-1",
    "C3": "1-2",
    "D3": "1-0",
    "C4": "3-0",
    "D4": "1-0",
    "C5": "0-1",
    "D5": "1-1",
    "C6": "2-0",
    "D6": "1-0",
    "E1": "4-0",
    "F1": "2-1",
    "E2": "0-0",
    "F2": "1-0",
    "E3": "2-0",
    "F3": "2-0",
    "E4": "2-0",
    "F4": "0-1",
    "E5": "0-2",
    "F5": "1-0",
    "E6": "0-1",
    "F6": "0-2",
    "G1": "1-0",
    "H1": "3-0",
    "G2": "1-0",
    "H2": "0-2",
    "G3": "1-0",
    "H3": "3-0",
    "G4": "0-1",
    "H4": "1-0",
    "G5": "1-0",
    "H5": "1-1",
    "G6": "0-2",
    "H6": "0-1",
    "I1": "2-0",
    "J1": "2-0",
    "I2": "0-3",
    "J2": "2-0",
    "I3": "3-0",
    "J3": "2-1",
    "I4": "2-1",
    "J4": "0-1",
    "I5": "0-1",
    "J5": "1-2",
    "I6": "2-0",
    "J6": "0-3",
    "K1": "2-0",
    "L1": "1-0",
    "K2": "0-1",
    "L2": "2-1",
    "K3": "2-0",
    "L3": "2-0",
    "K4": "1-0",
    "L4": "0-1",
    "K5": "0-1",
    "L5": "0-2",
    "K6": "1-1",
    "L6": "1-0"
  },
  "top2": {
    "A": [
      "Mexico",
      "Zuid-Korea"
    ],
    "B": [
      "Zwitserland",
      "Canada"
    ],
    "C": [
      "Brazilië",
      "Marokko"
    ],
    "D": [
      "Verenigde Staten",
      "Turkije"
    ],
    "E": [
      "Duitsland",
      "Ecuador"
    ],
    "F": [
      "Nederland",
      "Japan"
    ],
    "G": [
      "België",
      "Egypte"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Colombia"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Tsjechië",
    "Ivoorkust",
    "Senegal",
    "Paraguay",
    "Bosnië-Herzegovina",
    "Schotland",
    "Zweden",
    "Algerije"
  ]
});
// <<< VOORSPELLING Mark

// >>> VOORSPELLING Giezen (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Giezen"], {
  "prematch": {
    "champion": "Nederland",
    "finalist_predicted": "",
    "surprise": "Japan",
    "deception": "België",
    "topscorer": "Mbappé",
    "topscorerGoals": 7,
    "totalGoals": 307,
    "yellow": 398,
    "red": 17
  },
  "group": {
    "A1": "3-0",
    "B1": "2-0",
    "A2": "1-1",
    "B2": "0-3",
    "A3": "3-0",
    "B3": "2-0",
    "A4": "2-0",
    "B4": "3-0",
    "A5": "2-1",
    "B5": "2-2",
    "A6": "1-1",
    "B6": "3-1",
    "C1": "3-2",
    "D1": "1-2",
    "C2": "0-3",
    "D2": "1-3",
    "C3": "1-2",
    "D3": "2-3",
    "C4": "6-0",
    "D4": "2-0",
    "C5": "0-2",
    "D5": "3-1",
    "C6": "3-0",
    "D6": "1-2",
    "E1": "3-1",
    "F1": "3-0",
    "E2": "1-2",
    "F2": "1-0",
    "E3": "1-0",
    "F3": "2-0",
    "E4": "2-0",
    "F4": "1-3",
    "E5": "2-1",
    "F5": "1-3",
    "E6": "1-2",
    "F6": "0-3",
    "G1": "3-0",
    "H1": "5-0",
    "G2": "0-2",
    "H2": "1-3",
    "G3": "3-0",
    "H3": "2-0",
    "G4": "1-1",
    "H4": "3-0",
    "G5": "2-1",
    "H5": "1-3",
    "G6": "1-2",
    "H6": "2-2",
    "I1": "3-0",
    "J1": "3-0",
    "I2": "1-3",
    "J2": "2-0",
    "I3": "4-0",
    "J3": "3-2",
    "I4": "2-2",
    "J4": "2-0",
    "I5": "1-2",
    "J5": "0-2",
    "I6": "3-0",
    "J6": "1-3",
    "K1": "2-0",
    "L1": "2-2",
    "K2": "1-2",
    "L2": "2-0",
    "K3": "3-0",
    "L3": "3-1",
    "K4": "2-0",
    "L4": "1-2",
    "K5": "1-2",
    "L5": "0-2",
    "K6": "1-3",
    "L6": "1-0"
  },
  "top2": {
    "A": [
      "Zuid-Afrika",
      "Mexico"
    ],
    "B": [
      "Zwitserland",
      "Canada"
    ],
    "C": [
      "Brazilië",
      "Schotland"
    ],
    "D": [
      "Turkije",
      "Verenigde Staten"
    ],
    "E": [
      "Duitsland",
      "Ecuador"
    ],
    "F": [
      "Nederland",
      "Zweden"
    ],
    "G": [
      "België",
      "Egypte"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Oezbekistan"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Marokko",
    "Paraguay",
    "Australië",
    "Zuid-Korea",
    "Bosnië-Herzegovina",
    "Egypte"
  ]
});
// <<< VOORSPELLING Giezen

// >>> VOORSPELLING Pieter (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Pieter"], {
  "prematch": {
    "champion": "Frankrijk",
    "finalist_predicted": "",
    "surprise": "Noorwegen",
    "deception": "Argentinië",
    "topscorer": "Mbappé",
    "topscorerGoals": 8,
    "totalGoals": 270,
    "yellow": 345,
    "red": 8
  },
  "group": {
    "A1": "1-0",
    "B1": "1-0",
    "A2": "1-0",
    "B2": "0-2",
    "A3": "1-0",
    "B3": "2-0",
    "A4": "1-0",
    "B4": "2-0",
    "A5": "0-1",
    "B5": "1-1",
    "A6": "0-1",
    "B6": "2-0",
    "C1": "1-0",
    "D1": "1-0",
    "C2": "0-1",
    "D2": "0-1",
    "C3": "0-1",
    "D3": "1-0",
    "C4": "3-0",
    "D4": "1-0",
    "C5": "0-2",
    "D5": "1-1",
    "C6": "2-0",
    "D6": "1-1",
    "E1": "3-0",
    "F1": "1-0",
    "E2": "0-1",
    "F2": "1-0",
    "E3": "2-0",
    "F3": "1-0",
    "E4": "3-0",
    "F4": "0-1",
    "E5": "0-2",
    "F5": "1-0",
    "E6": "0-2",
    "F6": "0-1",
    "G1": "1-0",
    "H1": "3-0",
    "G2": "1-0",
    "H2": "0-1",
    "G3": "2-0",
    "H3": "3-0",
    "G4": "0-1",
    "H4": "2-0",
    "G5": "1-0",
    "H5": "1-1",
    "G6": "0-2",
    "H6": "0-2",
    "I1": "1-0",
    "J1": "1-0",
    "I2": "0-2",
    "J2": "2-0",
    "I3": "3-0",
    "J3": "1-0",
    "I4": "1-0",
    "J4": "0-1",
    "I5": "0-1",
    "J5": "1-1",
    "I6": "2-0",
    "J6": "0-2",
    "K1": "2-0",
    "L1": "1-0",
    "K2": "0-1",
    "L2": "1-0",
    "K3": "2-0",
    "L3": "2-0",
    "K4": "1-0",
    "L4": "0-1",
    "K5": "0-1",
    "L5": "0-2",
    "K6": "1-0",
    "L6": "1-0"
  },
  "top2": {
    "A": [
      "Mexico",
      "Zuid-Korea"
    ],
    "B": [
      "Canada",
      "Zwitserland"
    ],
    "C": [
      "Brazilië",
      "Marokko"
    ],
    "D": [
      "Turkije",
      "Verenigde Staten"
    ],
    "E": [
      "Duitsland",
      "Ecuador"
    ],
    "F": [
      "Nederland",
      "Japan"
    ],
    "G": [
      "België",
      "Iran"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Colombia"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Algerije",
    "Senegal",
    "Bosnië-Herzegovina",
    "Ivoorkust",
    "Tsjechië",
    "Zweden",
    "Schotland",
    "Iran"
  ]
});
// <<< VOORSPELLING Pieter

// >>> VOORSPELLING Smit (gegenereerd door verwerk_voorspelling.py)
Object.assign(VOORSPELLINGEN["Smit"], {
  "prematch": {
    "champion": "Spanje",
    "finalist_predicted": "",
    "surprise": "Canada",
    "deception": "Marokko",
    "topscorer": "Mbappé",
    "topscorerGoals": 6,
    "totalGoals": 288,
    "yellow": 368,
    "red": 8
  },
  "group": {
    "A1": "2-0",
    "B1": "1-1",
    "A2": "1-1",
    "B2": "0-2",
    "A3": "2-1",
    "B3": "1-0",
    "A4": "2-1",
    "B4": "2-0",
    "A6": "0-2",
    "B5": "1-1",
    "A5": "0-2",
    "B6": "2-0",
    "C1": "2-1",
    "D1": "1-1",
    "C2": "0-1",
    "D2": "1-2",
    "C3": "0-2",
    "D3": "2-0",
    "C4": "4-0",
    "D4": "1-1",
    "C5": "0-2",
    "D5": "1-2",
    "C6": "3-0",
    "D6": "1-0",
    "E1": "4-0",
    "F1": "1-1",
    "E2": "1-1",
    "F2": "2-0",
    "E3": "2-1",
    "F3": "2-1",
    "E4": "3-0",
    "F4": "0-2",
    "E5": "0-2",
    "F6": "0-2",
    "E6": "1-2",
    "F5": "1-1",
    "G1": "2-1",
    "H1": "3-0",
    "G2": "1-0",
    "H2": "1-2",
    "G3": "2-0",
    "H3": "3-0",
    "G4": "0-2",
    "H4": "2-0",
    "G6": "0-2",
    "H5": "1-1",
    "G5": "1-1",
    "H6": "1-1",
    "I1": "2-1",
    "J1": "2-0",
    "I2": "0-3",
    "J2": "2-0",
    "I3": "3-0",
    "J3": "2-1",
    "I4": "1-1",
    "J4": "0-2",
    "I6": "2-0",
    "J5": "1-1",
    "I5": "1-2",
    "J6": "0-3",
    "K1": "3-0",
    "L1": "2-1",
    "K2": "0-2",
    "L2": "1-0",
    "K3": "2-0",
    "L3": "1-0",
    "K4": "2-0",
    "L4": "0-2",
    "K5": "1-1",
    "L5": "0-2",
    "K6": "1-1",
    "L6": "2-1"
  },
  "top2": {
    "A": [
      "Mexico",
      "Zuid-Korea"
    ],
    "B": [
      "Zwitserland",
      "Canada"
    ],
    "C": [
      "Brazilië",
      "Marokko"
    ],
    "D": [
      "Verenigde Staten",
      "Paraguay"
    ],
    "E": [
      "Duitsland",
      "Ecuador"
    ],
    "F": [
      "Nederland",
      "Japan"
    ],
    "G": [
      "België",
      "Egypte"
    ],
    "H": [
      "Spanje",
      "Uruguay"
    ],
    "I": [
      "Frankrijk",
      "Noorwegen"
    ],
    "J": [
      "Argentinië",
      "Oostenrijk"
    ],
    "K": [
      "Portugal",
      "Colombia"
    ],
    "L": [
      "Engeland",
      "Kroatië"
    ]
  },
  "best3": [
    "Senegal",
    "Ivoorkust",
    "Zweden",
    "Bosnië-Herzegovina",
    "Turkije",
    "Algerije",
    "Tsjechië",
    "Iran"
  ]
});
// <<< VOORSPELLING Smit

// Handmatige toelichtingen uit de formulieren (na de gegenereerde blokken
// zodat ze een nieuwe run van verwerk_voorspelling.py overleven)
VOORSPELLINGEN["Giezen"].prematch.championNote =
  "(absoluut nul kan, maar ik kan niet anders - ben geen verrader)";

// Giezens best3 gecorrigeerd met zijn akkoord (10 juni 2026): 'Nigerië' en
// 'Polen' doen niet mee, Paraguay/Australië was dubbel (groep D), Egypte was
// al zijn runner-up G. Aangevuld met de sterkste nummers 3 volgens zijn eigen
// voorspelde scores.
VOORSPELLINGEN["Giezen"].best3 = ["Marokko", "Australië", "Zuid-Korea",
  "Bosnië-Herzegovina", "Colombia", "Nieuw-Zeeland", "Senegal", "Ghana"];

// Huttenhuis best3 #8: formulier bevatte verhaspeling 'Bosnië-Herzegovinaosnie'
// (Excel-autocomplete) — bedoeld land is eenduidig Bosnië-Herzegovina.
VOORSPELLINGEN["Huttenhuis"].best3.push("Bosnië-Herzegovina");

// Topscorer genormaliseerd: 'Kylian Mbappe' (Mark) en 'Mbappe' (Huttenhuis)
// zijn dezelfde speler als 'Mbappé' — scoring en stats vergelijken exact.
VOORSPELLINGEN["Mark"].prematch.topscorer = "Mbappé";
VOORSPELLINGEN["Huttenhuis"].prematch.topscorer = "Mbappé";

// Mark wijzigde vóór de aftrap (11 juni 2026) zijn topscorer-goals van 4 naar 5.
VOORSPELLINGEN["Mark"].prematch.topscorerGoals = "5";

// EJ vulde 'YAMAL' in kapitalen in — scoring en stats vergelijken exact.
VOORSPELLINGEN["EJ"].prematch.topscorer = "Yamal";

// Floris vulde 'Koning Gakpo' in — genormaliseerd zodat de scoring matcht.
VOORSPELLINGEN["Floris"].prematch.topscorer = "Gakpo";

// ============================================================
//  UITSLAGEN (door organisator / later de agent)
// ============================================================
const UITSLAGEN = {
  group:{"A1":"2-0","A2":"2-1","A3":"1-1","B1":"1-1","B2":"1-1","B3":"4-1","C1":"1-1","C2":"0-1","D1":"4-1","D2":"2-0","E1":"7-1","E2":"1-0","F1":"2-2","F2":"5-1","G1":"1-1","G2":"2-2","H1":"0-0","H2":"1-1","I1":"3-1","I2":"1-4","J1":"3-0","J2":"3-1","K1":"1-1","K2":"1-3","L1":"4-2","L2":"1-0"},                       // matchId -> "thuis-uit"
  advancers:{ top2:{}, best3:[] },// werkelijk doorgegane landen
  ko:{
    brackets:{
      R32:[
        // Volgorde = FIFA wedstrijdnummers 73-88
        {home:"2A",  away:"2B"},               // M73
        {home:"1E",  away:"3e (A/B/C/D/F)"},   // M74
        {home:"1F",  away:"2C"},               // M75
        {home:"1C",  away:"2F"},               // M76
        {home:"1I",  away:"3e (C/D/F/G/H)"},   // M77
        {home:"2E",  away:"2I"},               // M78
        {home:"1A",  away:"3e (C/E/F/H/I)"},   // M79
        {home:"1L",  away:"3e (E/H/I/J/K)"},   // M80
        {home:"1D",  away:"3e (B/E/F/I/J)"},   // M81
        {home:"1G",  away:"3e (A/E/H/I/J)"},   // M82
        {home:"2K",  away:"2L"},               // M83
        {home:"1H",  away:"2J"},               // M84
        {home:"1B",  away:"3e (E/F/G/I/J)"},   // M85
        {home:"1J",  away:"2H"},               // M86
        {home:"1K",  away:"3e (D/E/I/J/L)"},   // M87
        {home:"2D",  away:"2G"},               // M88
      ],
      R16:[
        // M89-96 — W = Winnaar R32 match N
        {home:"W R32-2",  away:"W R32-5"},     // M89
        {home:"W R32-1",  away:"W R32-3"},     // M90
        {home:"W R32-4",  away:"W R32-6"},     // M91
        {home:"W R32-7",  away:"W R32-8"},     // M92
        {home:"W R32-11", away:"W R32-12"},    // M93
        {home:"W R32-9",  away:"W R32-10"},    // M94
        {home:"W R32-14", away:"W R32-16"},    // M95
        {home:"W R32-13", away:"W R32-15"},    // M96
      ],
      KF:[
        {home:"W R16-1", away:"W R16-2"},      // M97
        {home:"W R16-5", away:"W R16-6"},      // M98
        {home:"W R16-3", away:"W R16-4"},      // M99
        {home:"W R16-7", away:"W R16-8"},      // M100
      ],
      HF:[
        {home:"W KF-1", away:"W KF-2"},        // M101
        {home:"W KF-3", away:"W KF-4"},        // M102
      ],
      F:[
        {home:"W HF-1", away:"W HF-2"},        // M104
      ],
    },
    results:{R32:[],R16:[],KF:[],HF:[],F:[]}
  },
  facts:{ compleet:false, champion:"", finalist:"", topscorers:["Messi","F. Balogun","E. Haaland"], topscorerGoals:3, totalGoals:82, yellow:56, red:4},
};

// ============================================================
//  ALL TIME RANKING — historische editie-scores
//  deelnemer2026: koppeling naar DEELNEMERS-naam voor de 2026-score
// ============================================================
const ALLTIME_DATA = {
  jaren: [2006, 2008, 2010, 2012, 2014, 2016],
  deelnemers: [
    { naam:"EJ",         scores:{2006:173,2008:111,2010:244,2012:114,2014:231,2016:175}, deelnemer2026:"EJ" },
    { naam:"Huttenhuis", scores:{2006:158,2008:109,2010:235,2012:125,2014:231,2016:190}, deelnemer2026:"Huttenhuis" },
    { naam:"Mark",       scores:{2006:141,2008:90, 2010:248,2012:132,2014:222,2016:197}, deelnemer2026:"Mark" },
    { naam:"Slotboom",   scores:{2006:162,2008:100,2010:223,2012:105,2014:215,2016:146}, deelnemer2026:"Slotboom" },
    { naam:"Smit",       scores:{2006:141,2008:90, 2010:195,2012:70, 2014:249,2016:175}, deelnemer2026:"Smit" },
    { naam:"AI Kees",    scores:{2006:132,2008:96, 2010:253,2012:0,  2014:197,2016:206}, deelnemer2026:"AI Kees" },
    { naam:"Pieter",     scores:{2006:128,2008:76, 2010:212,2012:75, 2014:214,2016:126}, deelnemer2026:"Pieter" },
    { naam:"Daniel",     scores:{2006:125,2008:76, 2010:171,2012:52, 2014:208,2016:154}, deelnemer2026:"Daniel" },
    { naam:"Floris",     scores:{2006:132,2008:56, 2010:228,2012:59, 2014:174,2016:128}, deelnemer2026:"Floris" },
    { naam:"Giezen",     scores:{2006:112,2008:111,2010:234,2012:0,  2014:208,2016:0  }, deelnemer2026:"Giezen" },
    { naam:"Hugo",       scores:{2006:125,2008:48, 2010:191,2012:0,  2014:0,  2016:0  }, deelnemer2026:null },
    { naam:"Buisman",    scores:{2006:127,2008:38, 2010:0,  2012:0,  2014:0,  2016:0  }, deelnemer2026:null },
  ],
};

// AI Kees voorspellingen — gegenereerd door maak_kees_voorspellingen.py
// Motivatie: kampioen=Frankrijk is geen contraire pick maar de diepte van de selectie is mispriced als 'gewoon favoriet' — dit is de minste risico-adjusted bet in het veld., verrassing=Zwitserland is een lowvol value-aandeel: defensief solide, B-groep met Qatar en Bosnië is een gespreid tafeltje, en ik woon hier dus ik weet wat ik koop.,
//            deceptie=Duitsland is de klassieke overgekochte naam — sentiment hoog, fundamentals wankel, en groep E met Ecuador als short tegen de hype., topscorer=Mbappé is de obvious trade, maar bij Frankrijk die ver komt is volume gegarandeerd; ik betaal liever voor zekerheid dan voor een longshot-spits.
VOORSPELLINGEN["AI Kees"] = {
  prematch: {
    champion: "Frankrijk",
    finalist_predicted: "Argentini\u00eb",
    surprise: "Zwitserland",
    deception: "Duitsland",
    topscorer: "Mbapp\u00e9",
    topscorerGoals: "7",
    totalGoals: "165",
    yellow: "230",
    red: "10",
  },
  group: {
    "A1": "2-0",
    "A2": "1-1",
    "A3": "1-1",
    "A4": "1-1",
    "A5": "0-2",
    "A6": "1-1",
    "B1": "1-1",
    "B2": "0-2",
    "B3": "2-0",
    "B4": "1-1",
    "B5": "2-1",
    "B6": "1-1",
    "C1": "1-1",
    "C2": "0-2",
    "C3": "1-2",
    "C4": "3-0",
    "C5": "0-2",
    "C6": "2-0",
    "D1": "2-1",
    "D2": "1-1",
    "D3": "1-1",
    "D4": "1-1",
    "D5": "1-1",
    "D6": "1-2",
    "E1": "3-0",
    "E2": "1-1",
    "E3": "2-0",
    "E4": "2-0",
    "E5": "0-2",
    "E6": "1-1",
    "F1": "2-1",
    "F2": "1-1",
    "F3": "2-0",
    "F4": "0-1",
    "F5": "1-1",
    "F6": "1-2",
    "G1": "2-0",
    "G2": "2-0",
    "G3": "2-1",
    "G4": "1-1",
    "G5": "1-1",
    "G6": "0-2",
    "H1": "3-0",
    "H2": "0-2",
    "H3": "3-0",
    "H4": "2-0",
    "H5": "1-1",
    "H6": "1-2",
    "I1": "2-1",
    "I2": "1-2",
    "I3": "3-0",
    "I4": "1-1",
    "I5": "0-2",
    "I6": "2-0",
    "J1": "3-0",
    "J2": "2-0",
    "J3": "2-0",
    "J4": "1-1",
    "J5": "1-2",
    "J6": "0-3",
    "K1": "3-0",
    "K2": "1-2",
    "K3": "2-0",
    "K4": "2-0",
    "K5": "1-2",
    "K6": "1-1",
    "L1": "1-1",
    "L2": "0-1",
    "L3": "3-0",
    "L4": "1-2",
    "L5": "0-2",
    "L6": "2-0"
  },
  top2: {"A": ["Mexico", "Zuid-Korea"], "B": ["Zwitserland", "Canada"], "C": ["Brazilië", "Marokko"], "D": ["Verenigde Staten", "Australië"], "E": ["Duitsland", "Ecuador"], "F": ["Nederland", "Japan"], "G": ["België", "Iran"], "H": ["Spanje", "Uruguay"], "I": ["Frankrijk", "Senegal"], "J": ["Argentinië", "Oostenrijk"], "K": ["Portugal", "Colombia"], "L": ["Engeland", "Kroatië"]},
  best3: ["Ivoorkust", "Noorwegen", "Turkije", "Schotland", "Panama", "Egypte", "Zweden", "Tsjechië"],
  ko: {R32:[],R16:[],KF:[],HF:[],F:[]},
};

// Alleen voor Node (bereken_stand.js, valideer_data.js, bot) — browsers slaan dit over.
if(typeof module!=="undefined"){
module.exports={GROUPS,GROUP_MATCHES,KO_ROUNDS,SCORING,FAVORITES,OUTSIDERS,DEELNEMERS,VOORSPELLINGEN,UITSLAGEN,ALLTIME_DATA,RANKING,surpriseFactor,deceptionFactor};
}