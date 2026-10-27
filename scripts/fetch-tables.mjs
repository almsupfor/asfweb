// Hämtar serietabellerna för Herr (Hockeyallsvenskan), Dam och J20 från almtuna.com:s öppna JSON-API
// och sparar dem i src/data/tables.json. Klubbens egen sida använder samma API.
// Körs av GitHub Actions (se .github/workflows/deploy.yml) eller för hand: npm run tables
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/tables.json', import.meta.url);
const API = 'https://www.almtuna.com/api';
const SERIES = { herr: 'qQ9-594cW8OWD', dam: 'qYE-42dTycW3f', j20: 'qV0-8wgHrHJmG' };
const OUR_TEAM = '181c-181cv0b9i'; // Almtuna IS: samma klubb i alla serier, markeras i tabellen
// Sajten skriver U20 och U18, medan API:et ibland fortfarande säger J20 och J18.
const visningsnamn = (namn) => namn.replace(/\bJ(20|18)\b/g, 'U$1');
const headers = { 'user-agent': 'almtunasupporter.se table-fetcher (+https://almtunasupporter.se)' };

const get = async (path) => {
  const res = await fetch(`${API}/${path}`, { headers, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};

let existing = { updated: null, tables: {} };
try {
  existing = JSON.parse(await readFile(OUT, 'utf8'));
} catch {}

const tables = { ...existing.tables };
let failed = 0;
for (const [key, series] of Object.entries(SERIES)) {
  try {
    const ssgt = await get(`sports-v2/latest-ssgt/${series}`);
    const name = ssgt.names?.find((n) => n.language === 'sv')?.translation ?? ssgt.names?.[0]?.translation ?? '';
    const standings = await get(`statistics-v2/league-standings?ssgtUuid=${ssgt.uuid}`);
    if (!Array.isArray(standings.leagueStandings)) throw new Error('oväntat svar');
    tables[key] = {
      name,
      rows: standings.leagueStandings.map((r) => ({
        rank: r.Rank,
        team: visningsnamn(r.info?.teamInfo?.siteTeamDisplayName ?? r.info?.code ?? ''),
        // Damlaget och U20 har egna lag-id i API:et, så klubben känns också igen på namnet.
        ours: r.info?.teamInfo?.teamUuid === OUR_TEAM || /^Almtuna IS\b/.test(r.info?.teamInfo?.siteTeamDisplayName ?? ''),
        gp: r.GP, w: r.W, otw: r.OTW, otl: r.OTL, l: r.L, diff: r.Diff, pts: r.Points,
      })),
    };
  } catch (err) {
    failed++;
    console.warn(`Hoppade över ${key}: ${err.message}`);
  }
}

if (failed === Object.keys(SERIES).length) {
  console.error('Inga tabeller gick att läsa. Behåller befintlig data.');
  process.exit(0);
}

const changed = JSON.stringify(tables) !== JSON.stringify(existing.tables);
// Uppdatera tidsstämpeln bara när något ändrats, så att schemat inte skapar tomma commits.
const updated = changed ? new Date().toISOString() : existing.updated;
await writeFile(OUT, JSON.stringify({ updated, tables }, null, 2) + '\n');
console.log(Object.entries(tables).map(([k, t]) => `${k}: ${t.rows.length} lag`).join(', '));
