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

// Kleurblokje per land — gekozen zodat de 4 teams binnen elke groep goed van elkaar verschillen.
// (vlaggen hebben meerdere kleuren; per groep is een onderscheidende tint gekozen)
const TEAMCOLORS = {
  // Groep A
  "Mexico":"#006847","Zuid-Afrika":"#ffb612","Zuid-Korea":"#cd2e3a","Tsjechië":"#11457e",
  // Groep B
  "Canada":"#ff0000","Zwitserland":"#000000","Qatar":"#8a1538","Bosnië-Herzegovina":"#002395",
  // Groep C
  "Brazilië":"#009c3b","Marokko":"#c1272d","Haïti":"#00209f","Schotland":"#5fb0e5",
  // Groep D
  "Verenigde Staten":"#3c3b6e","Paraguay":"#d52b1e","Australië":"#ffcd00","Turkije":"#111111",
  // Groep E
  "Duitsland":"#000000","Curaçao":"#002b7f","Ivoorkust":"#f77f00","Ecuador":"#ed1c24",
  // Groep F
  "Nederland":"#ff6a13","Japan":"#bc002d","Zweden":"#006aa7","Tunesië":"#111111",
  // Groep G
  "België":"#fdda24","Egypte":"#ce1126","Iran":"#239f40","Nieuw-Zeeland":"#00247d",
  // Groep H
  "Spanje":"#aa151b","Kaapverdië":"#003893","Saoedi-Arabië":"#006c35","Uruguay":"#5b92e5",
  // Groep I
  "Frankrijk":"#0055a4","Senegal":"#00853f","Noorwegen":"#ba0c2f","Irak":"#111111",
  // Groep J
  "Argentinië":"#74acdf","Algerije":"#006233","Oostenrijk":"#ed2939","Jordanië":"#000000",
  // Groep K
  "Portugal":"#006600","DR Congo":"#00aaff","Oezbekistan":"#1eb53a","Colombia":"#fcd116",
  // Groep L
  "Engeland":"#ce1124","Kroatië":"#1742a0","Ghana":"#ffd100","Panama":"#111111",
};

// Round-robin volgorde per groep (4 teams): bepaalt de 6 wedstrijden
const RR_PAIRS = [[0,1],[2,3],[0,2],[3,1],[3,0],[1,2]];
function buildGroupMatches(){
  const m=[];
  for(const g of Object.keys(GROUPS)){
    const t=GROUPS[g]; let n=1;
    for(const [a,b] of RR_PAIRS){ m.push({id:`${g}${n}`,group:g,home:t[a],away:t[b]}); n++; }
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
  "EJ","Floris","Gautier","Giezen","Huttenhuis","Mark","Pieter","Slotboom","Smit","AI Kees"
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

// ============================================================
//  UITSLAGEN (door organisator / later de agent)
// ============================================================
const UITSLAGEN = {
  group:{},                       // matchId -> "thuis-uit"
  advancers:{ top2:{}, best3:[] },// werkelijk doorgegane landen
  ko:{
    brackets:{
      R32:[
        {home:"1A", away:"3e (C/E/F/H/I)"},
        {home:"1B", away:"3e (E/F/G/I/J)"},
        {home:"1C", away:"2F"},
        {home:"1D", away:"3e (B/E/F/I/J)"},
        {home:"1E", away:"3e (A/B/C/D/F)"},
        {home:"1F", away:"2C"},
        {home:"1G", away:"3e (A/E/H/I/J)"},
        {home:"1H", away:"2J"},
        {home:"1I", away:"3e (C/D/F/G/H)"},
        {home:"1J", away:"2H"},
        {home:"1K", away:"3e (D/E/I/J/L)"},
        {home:"1L", away:"3e (E/H/I/J/K)"},
        {home:"2A", away:"2B"},
        {home:"2D", away:"2G"},
        {home:"2E", away:"2I"},
        {home:"2K", away:"2L"},
      ],
      R16:[],KF:[],HF:[],F:[]
    },
    results:{R32:[],R16:[],KF:[],HF:[],F:[]}
  },
  facts:{ champion:"", finalist:"", topscorers:["","",""], topscorerGoals:null, totalGoals:null, yellow:null, red:null },
};

if(typeof module!=="undefined"){
  module.exports={GROUPS,GROUP_MATCHES,KO_ROUNDS,SCORING,FAVORITES,OUTSIDERS,DEELNEMERS,VOORSPELLINGEN,UITSLAGEN};
}
