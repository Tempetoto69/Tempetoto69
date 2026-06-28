#!/usr/bin/env node
// Berekent de huidige Tempetoto-stand en print JSON naar stdout.
// Gebruikt exact dezelfde logica als index.html.
// Gebruik: node bereken_stand.js

const {
  GROUPS, GROUP_MATCHES, KO_ROUNDS, SCORING,
  DEELNEMERS, VOORSPELLINGEN, UITSLAGEN,
  surpriseFactor, deceptionFactor,
} = require('./data.js');

// Optionele overlay met (live/voorlopige) groepsuitslagen via env STAND_OVERLAY
// (JSON {matchId:"thuis-uit"}). Voor de virtuele stand: reken alsof die wedstrijden
// nu zo eindigen. Zonder env verandert er niets aan de normale berekening.
if (process.env.STAND_OVERLAY) {
  try {
    Object.assign(UITSLAGEN.group, JSON.parse(process.env.STAND_OVERLAY));
  } catch (e) { /* kapotte overlay negeren */ }
}

// Idem voor KO-wedstrijden via env STAND_OVERLAY_KO (JSON {ronde:{index:"thuis-uit"}}).
// De index is de bracket-slot binnen die ronde. Zo telt een lopende KO-wedstrijd mee
// in de virtuele stand, net als groepswedstrijden.
if (process.env.STAND_OVERLAY_KO) {
  try {
    const ko = JSON.parse(process.env.STAND_OVERLAY_KO);
    for (const [ronde, perIndex] of Object.entries(ko)) {
      if (!Array.isArray(UITSLAGEN.ko.results[ronde])) UITSLAGEN.ko.results[ronde] = [];
      for (const [i, score] of Object.entries(perIndex)) {
        UITSLAGEN.ko.results[ronde][Number(i)] = score;
      }
    }
  } catch (e) { /* kapotte overlay negeren */ }
}

function parseScore(s) {
  if (!s || typeof s !== 'string' || !s.includes('-')) return null;
  const [h, a] = s.split('-').map(x => parseInt(x, 10));
  if (isNaN(h) || isNaN(a)) return null;
  return [h, a];
}

function toto(h, a) { return h > a ? 1 : h < a ? -1 : 0; }

function scoreGroup(pred, res) {
  const p = parseScore(pred), r = parseScore(res);
  if (!p || !r) return 0;
  let pts = 0;
  if (toto(p[0], p[1]) === toto(r[0], r[1])) pts += SCORING.group.toto;
  if (p[0] === r[0] && p[1] === r[1]) pts += SCORING.group.exact;
  return pts;
}

// KO-toto telt op de 90-minutenstand. Bij een voorspeld gelijkspel dat ook echt
// gelijk eindigde, beslist de gekozen doorgaander (predDoor) t.o.v. wie er echt
// doorging (realDoor, na verlenging/penalty's) of de toto goed is.
function scoreKo(pred, res, round, predDoor, realDoor) {
  const p = parseScore(pred), r = parseScore(res);
  if (!p || !r) return 0;
  const dp = toto(p[0], p[1]), dr = toto(r[0], r[1]);
  let totoGoed;
  if (dp !== dr) totoGoed = false;                                   // andere 90-min uitkomst
  else if (dp === 0) totoGoed = !!predDoor && predDoor === realDoor; // gelijkspel: doorgaander beslist
  else totoGoed = true;                                              // zelfde winnaar-richting
  let pts = 0;
  if (totoGoed) pts += round.toto;
  if (p[0] === r[0] && p[1] === r[1]) pts += round.exact;
  return pts;
}

function teamReached(land) {
  let reached = null;
  for (const r of KO_ROUNDS) {
    const br = UITSLAGEN.ko.brackets[r.key] || [];
    if (br.some(d => d.home === land || d.away === land)) reached = r.key;
  }
  if (UITSLAGEN.facts.champion === land) reached = 'WIN';
  return reached;
}

function surprisePts(land) {
  const r = teamReached(land);
  if (r == null) return 0;
  const key = r === 'WIN' ? 'winner' : r;
  const b = SCORING.surprise.base[key];
  return b != null ? Math.round(b * surpriseFactor(land)) : 0;
}

// Een ronde is pas "bekend" als alle bracket-slots echte landen bevatten —
// tot die tijd is een uitschakeling niet definitief en telt deceptie niet.
const ALLE_LANDEN = Object.values(GROUPS).flat();
function rondeGevuld(key) {
  const br = UITSLAGEN.ko.brackets[key] || [];
  return br.length > 0 && br.every(d => ALLE_LANDEN.includes(d.home) && ALLE_LANDEN.includes(d.away));
}

function deceptionExit(land) {
  const r = teamReached(land);
  if (r == null) return rondeGevuld('R32') ? 'groep' : null;
  const volgende = { R32: 'R16', R16: 'KF', KF: 'HF' }[r];
  if (!volgende || !rondeGevuld(volgende)) return null; // HF of verder, of ronde nog bezig
  return r;
}

function deceptionPts(land) {
  const ex = deceptionExit(land);
  if (!ex) return 0;
  const b = SCORING.deception.base[ex];
  return b != null ? Math.round(b * deceptionFactor(land)) : 0;
}

// ── Maximaal haalbare eindscore ───────────────────────────────────────────────
// "Alles wat nog open staat valt goed." Voor KO-rondes zonder uitslag telt de
// volle buit, ook zonder voorspelling — die wordt pas vóór elke ronde ingevuld.
function stillAlive(land) {
  if (UITSLAGEN.facts.champion) return UITSLAGEN.facts.champion === land;
  const r = teamReached(land);
  const volgende = r == null ? 'R32' : { R32: 'R16', R16: 'KF', KF: 'HF', HF: 'F' }[r];
  if (!volgende) return true; // staat in de finale
  return !rondeGevuld(volgende);
}

function maxScore(naam, cur) {
  if (UITSLAGEN.facts.champion) return cur.totaal; // toernooi klaar
  const v = VOORSPELLINGEN[naam], u = UITSLAGEN, p = v.prematch;
  let max = cur.group + cur.advance + cur.ko;

  for (const m of GROUP_MATCHES)
    if (!parseScore(u.group[m.id]) && parseScore(v.group[m.id]))
      max += SCORING.group.toto + SCORING.group.exact;

  for (const g of Object.keys(GROUPS))
    if (!(u.advancers.top2[g] || []).length)
      max += (v.top2[g] || []).filter(Boolean).length * SCORING.advance.perTeam;
  if (!(u.advancers.best3 || []).length)
    max += (v.best3 || []).filter(Boolean).length * SCORING.advance.perTeam;

  for (const r of KO_ROUNDS)
    (u.ko.brackets[r.key] || []).forEach((_, i) => {
      if (!parseScore((u.ko.results[r.key] || [])[i])) max += r.toto + r.exact;
    });

  if (p.champion && stillAlive(p.champion)) max += SCORING.champion.winner;
  if (p.surprise) max += stillAlive(p.surprise)
    ? Math.round(SCORING.surprise.base.winner * surpriseFactor(p.surprise))
    : surprisePts(p.surprise);
  if (p.deception) {
    const r = teamReached(p.deception);
    const best = deceptionExit(p.deception) ||
      (r == null ? (rondeGevuld('R32') ? null : 'groep')
                 : { R32: 'R32', R16: 'R16', KF: 'KF' }[r] || null);
    if (best) max += Math.round((SCORING.deception.base[best] || 0) * deceptionFactor(p.deception));
  }
  if (p.topscorer)            max += SCORING.topscorer.p1;
  if (p.topscorerGoals !== '') max += SCORING.topscorer.exactGoals;
  if (p.totalGoals !== '')     max += SCORING.totalGoals.exact;
  if (p.yellow !== '')         max += SCORING.cards.exact;
  if (p.red !== '')            max += SCORING.cards.exact;
  return max;
}

function computeScore(naam) {
  const v = VOORSPELLINGEN[naam], u = UITSLAGEN;
  let group = 0, advance = 0, ko = 0, prematch = 0;

  for (const m of GROUP_MATCHES) group += scoreGroup(v.group[m.id], u.group[m.id]);

  for (const g of Object.keys(GROUPS)) {
    const pred = (v.top2[g] || []).filter(Boolean), real = (u.advancers.top2[g] || []);
    for (const land of pred) if (real.includes(land)) advance += SCORING.advance.perTeam;
  }
  for (const land of (v.best3 || []).filter(Boolean))
    if ((u.advancers.best3 || []).includes(land)) advance += SCORING.advance.perTeam;

  for (const r of KO_ROUNDS) {
    const preds = v.ko[r.key] || [], reals = u.ko.results[r.key] || [];
    const pdoor = (v.ko_door || {})[r.key] || [], rdoor = (u.ko.door || {})[r.key] || [];
    reals.forEach((res, i) => { if (preds[i] != null) ko += scoreKo(preds[i], res, r, pdoor[i], rdoor[i]); });
  }

  const p = v.prematch, f = u.facts;
  if (p.champion && f.champion) {
    if (p.champion === f.champion) prematch += SCORING.champion.winner;
    else if (p.champion === f.finalist) prematch += SCORING.champion.finalist;
  }
  if (p.surprise) prematch += surprisePts(p.surprise);
  if (p.deception) prematch += deceptionPts(p.deception);
  // Seizoensgokken (topscorer/goals/kaarten) tellen pas mee als de eindtotalen
  // vaststaan (f.compleet). Tot die tijd reflecteert de stand alleen wedstrijdpunten.
  if (f.compleet) {
    if (p.topscorer) {
      const rk = f.topscorers.indexOf(p.topscorer);
      if (rk === 0) prematch += SCORING.topscorer.p1;
      else if (rk === 1) prematch += SCORING.topscorer.p2;
      else if (rk === 2) prematch += SCORING.topscorer.p3;
    }
    if (p.topscorerGoals !== '' && f.topscorerGoals != null && Number(p.topscorerGoals) === Number(f.topscorerGoals))
      prematch += SCORING.topscorer.exactGoals;
    if (p.totalGoals !== '' && f.totalGoals != null) {
      const d = Math.abs(Number(p.totalGoals) - Number(f.totalGoals));
      const x = SCORING.totalGoals.exact - d; if (x > 0) prematch += x;
    }
    for (const k of ['yellow', 'red']) {
      if (p[k] !== '' && f[k] != null) {
        const d = Math.abs(Number(p[k]) - Number(f[k]));
        const x = SCORING.cards.exact - d; if (x > 0) prematch += x;
      }
    }
  }

  return { naam, group, advance, ko, prematch, totaal: group + advance + ko + prematch };
}

const scores = DEELNEMERS
  .map(n => { const s = computeScore(n); return { ...s, max: maxScore(n, s) }; })
  .sort((a, b) => b.totaal - a.totaal)
  .map((s, i) => ({ ...s, rank: i + 1 }));

process.stdout.write(JSON.stringify(scores, null, 2) + '\n');
