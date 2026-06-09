const {GROUP_MATCHES, VOORSPELLINGEN, DEELNEMERS} = require('./data.js');

const matchId = process.argv[2];
if (!matchId) {
    console.log(JSON.stringify({error: 'Geen matchId opgegeven'}));
    process.exit(1);
}

const match = GROUP_MATCHES.find(m => m.id === matchId);
if (!match) {
    console.log(JSON.stringify({error: `Match ${matchId} niet gevonden`}));
    process.exit(0);
}

const result = {
    matchId,
    thuis: match.home,
    uit: match.away,
    voorspellingen: {},
};

for (const naam of DEELNEMERS) {
    const score = VOORSPELLINGEN[naam]?.group?.[matchId];
    result.voorspellingen[naam] = score || null;
}

console.log(JSON.stringify(result, null, 2));
