#!/usr/bin/env node
// Berekent de huidige Tempetoto-stand en print JSON naar stdout.
// Gebruikt exact dezelfde logica als index.html.
// Gebruik: node bereken_stand.js

const {
  GROUPS, GROUP_MATCHES, KO_ROUNDS, SCORING,
  DEELNEMERS, VOORSPELLINGEN, UITSLAGEN,
  surpriseFactor, deceptionFactor,
} = require('./data.js');

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

function scoreKo(pred, res, round) {
  const p = parseScore(pred), r = parseScore(res);
  if (!p || !r) return 0;
  let pts = 0;
  if (toto(p[0], p[1]) === toto(r[0], r[1])) pts += round.toto;
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

function deceptionExit(land) {
  const r = teamReached(land);
  if (r == null) return 'groep';
  if (r === 'R32' || r === 'R16' || r === 'KF') return r;
  return null;
}

function deceptionPts(land) {
  const ex = deceptionExit(land);
  if (!ex) return 0;
  const b = SCORING.deception.base[ex];
  return b != null ? Math.round(b * deceptionFactor(land)) : 0;
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
    reals.forEach((res, i) => { if (preds[i] != null) ko += scoreKo(preds[i], res, r); });
  }

  const p = v.prematch, f = u.facts;
  if (p.champion && f.champion) {
    if (p.champion === f.champion) prematch += SCORING.champion.winner;
    else if (p.champion === f.finalist) prematch += SCORING.champion.finalist;
  }
  if (p.surprise) prematch += surprisePts(p.surprise);
  if (p.deception) prematch += deceptionPts(p.deception);
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

  return { naam, group, advance, ko, prematch, totaal: group + advance + ko + prematch };
}

const scores = DEELNEMERS
  .map(computeScore)
  .sort((a, b) => b.totaal - a.totaal)
  .map((s, i) => ({ ...s, rank: i + 1 }));

process.stdout.write(JSON.stringify(scores, null, 2) + '\n');
