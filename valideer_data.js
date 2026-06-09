#!/usr/bin/env node
/**
 * Valideert data.js vóór een git push.
 * Exit 0 = alles ok. Exit 1 = fout gevonden.
 *
 * Laag 1: data-integriteit (laadbaar, formaten, SCORING ongewijzigd)
 * Laag 2: scoreberekening (synthetische testcases tegen bekende uitkomsten)
 */

let fouten = 0;

function ok(label)  { console.log(`  ✓ ${label}`); }
function fout(label, detail) {
    console.error(`  ✗ ${label}${detail ? ': ' + detail : ''}`);
    fouten++;
}

// ── Laag 1a: data.js inlaadbaar ───────────────────────────────────────────────
console.log('\n[1] Data-integriteit');
let data;
try {
    data = require('./data.js');
    ok('data.js laadt zonder errors');
} catch (e) {
    fout('data.js kan niet worden ingeladen', e.message);
    process.exit(1); // verdere checks zinloos
}

const { SCORING, DEELNEMERS, UITSLAGEN, GROUP_MATCHES } = data;

// ── Laag 1b: SCORING constanten ongewijzigd ───────────────────────────────────
const VERWACHT = {
    'group.toto':           3,
    'group.exact':          2,
    'advance.perTeam':      3,
    'champion.winner':      40,
    'champion.finalist':    16,
    'topscorer.p1':         35,
    'topscorer.p2':         18,
    'topscorer.p3':         9,
    'topscorer.exactGoals': 8,
    'totalGoals.exact':     25,
    'totalGoals.perDiff':   1,
    'cards.exact':          12,
    'cards.perDiff':        1,
    'surprise.base.R16':    7,
    'surprise.base.KF':     12,
    'surprise.base.HF':     18,
    'surprise.base.F':      25,
    'surprise.base.winner': 33,
    'deception.base.KF':    6,
    'deception.base.R16':   11,
    'deception.base.R32':   16,
    'deception.base.groep': 24,
};

function getPath(obj, path) {
    return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

let scoringOk = true;
for (const [pad, verwacht] of Object.entries(VERWACHT)) {
    const actueel = getPath(SCORING, pad);
    if (actueel !== verwacht) {
        fout(`SCORING.${pad}`, `verwacht ${verwacht}, gevonden ${actueel}`);
        scoringOk = false;
    }
}
if (scoringOk) ok('SCORING constanten ongewijzigd');

// ── Laag 1c: deelnemers aanwezig ──────────────────────────────────────────────
const VERWACHT_DEELNEMERS = ['EJ','Floris','Daniel','Giezen','Huttenhuis','Mark','Pieter','Slotboom','Smit','AI Kees'];
const missingD = VERWACHT_DEELNEMERS.filter(n => !DEELNEMERS.includes(n));
if (missingD.length) fout('Deelnemers ontbreken', missingD.join(', '));
else ok('Alle deelnemers aanwezig');

// ── Laag 1d: uitslagen in geldig formaat ─────────────────────────────────────
const RE_SCORE = /^\d+-\d+$/;
let formatFouten = 0;
for (const [matchId, uitslag] of Object.entries(UITSLAGEN.group || {})) {
    if (!RE_SCORE.test(uitslag)) {
        fout(`UITSLAGEN.group.${matchId}`, `ongeldig formaat "${uitslag}"`);
        formatFouten++;
    }
}
if (formatFouten === 0) ok(`Uitslagenformaten correct (${Object.keys(UITSLAGEN.group || {}).length} ingevoerd)`);

// ── Laag 1e: GROUP_MATCHES aanwezig ───────────────────────────────────────────
if (!Array.isArray(GROUP_MATCHES) || GROUP_MATCHES.length < 72) {
    fout('GROUP_MATCHES', `verwacht ≥72 wedstrijden, gevonden ${GROUP_MATCHES?.length}`);
} else {
    ok(`GROUP_MATCHES aanwezig (${GROUP_MATCHES.length} groepswedstrijden)`);
}

// ── Laag 2: scoreberekening ───────────────────────────────────────────────────
console.log('\n[2] Scoreberekening (synthetische testcases)');

// Scorefuncties — los van data.js zodat de validatielogica onafhankelijk is
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
    let pts = SCORING.group.toto;  // gebruik de actuele SCORING (test dat ook)
    if (toto(p[0], p[1]) !== toto(r[0], r[1])) pts = 0;
    else if (p[0] === r[0] && p[1] === r[1]) pts += SCORING.group.exact;
    return pts;
}

const GROEP_CASES = [
    { pred: '2-1', res: '2-1', verwacht: 5,  label: 'exact goed (2-1 vs 2-1)' },
    { pred: '3-0', res: '2-1', verwacht: 3,  label: 'toto goed, niet exact (3-0 vs 2-1)' },
    { pred: '1-2', res: '2-1', verwacht: 0,  label: 'verkeerde uitslag (1-2 vs 2-1)' },
    { pred: '1-1', res: '2-1', verwacht: 0,  label: 'gelijkspel vs thuiswinst (1-1 vs 2-1)' },
    { pred: '0-0', res: '1-1', verwacht: 3,  label: 'beide gelijkspel (0-0 vs 1-1)' },
    { pred: '0-0', res: '0-0', verwacht: 5,  label: 'exact gelijkspel (0-0 vs 0-0)' },
    { pred: null,  res: '2-1', verwacht: 0,  label: 'geen voorspelling → 0' },
    { pred: '2-1', res: null,  verwacht: 0,  label: 'geen uitslag → 0' },
    { pred: '2:1', res: '2-1', verwacht: 0,  label: 'verkeerd formaat (2:1) → 0' },
];

let groepOk = true;
for (const tc of GROEP_CASES) {
    const score = scoreGroup(tc.pred, tc.res);
    if (score !== tc.verwacht) {
        fout(`scoreGroup: ${tc.label}`, `verwacht ${tc.verwacht}, kreeg ${score}`);
        groepOk = false;
    }
}
if (groepOk) ok(`scoreGroup: alle ${GROEP_CASES.length} testcases correct`);

// KO scoretest
function scoreKo(pred, res, totoP, exactP) {
    const p = parseScore(pred), r = parseScore(res);
    if (!p || !r) return 0;
    if (toto(p[0], p[1]) !== toto(r[0], r[1])) return 0;
    let pts = totoP;
    if (p[0] === r[0] && p[1] === r[1]) pts += exactP;
    return pts;
}

const R32 = { toto: 5, exact: 3 };
const KO_CASES = [
    { pred: '2-1', res: '2-1', verwacht: 8, label: 'R32 exact (2-1 vs 2-1)' },
    { pred: '3-0', res: '2-1', verwacht: 5, label: 'R32 toto (3-0 vs 2-1)' },
    { pred: '0-2', res: '2-1', verwacht: 0, label: 'R32 fout (0-2 vs 2-1)' },
];

let koOk = true;
for (const tc of KO_CASES) {
    const score = scoreKo(tc.pred, tc.res, R32.toto, R32.exact);
    if (score !== tc.verwacht) {
        fout(`scoreKo: ${tc.label}`, `verwacht ${tc.verwacht}, kreeg ${score}`);
        koOk = false;
    }
}
if (koOk) ok(`scoreKo: alle ${KO_CASES.length} testcases correct`);

// Sanity check: bereken_stand.js draait zonder errors
const { execSync } = require('child_process');
try {
    const out = execSync('node bereken_stand.js', { cwd: __dirname }).toString();
    const stand = JSON.parse(out);
    if (!Array.isArray(stand) || stand.length !== DEELNEMERS.length) {
        fout('bereken_stand.js output', `verwacht array van ${DEELNEMERS.length}, kreeg ${stand?.length}`);
    } else if (stand.some(s => s.totaal < 0)) {
        fout('bereken_stand.js output', 'negatieve totaalscore gevonden');
    } else {
        ok(`bereken_stand.js geeft geldige stand (${stand.length} deelnemers)`);
    }
} catch (e) {
    fout('bereken_stand.js draait niet', e.message.split('\n')[0]);
}

// ── Eindoordeel ───────────────────────────────────────────────────────────────
console.log('');
if (fouten === 0) {
    console.log('✅ Validatie geslaagd — veilig om te pushen.\n');
    process.exit(0);
} else {
    console.error(`❌ Validatie mislukt — ${fouten} fout(en) gevonden. Niet gepusht.\n`);
    process.exit(1);
}
