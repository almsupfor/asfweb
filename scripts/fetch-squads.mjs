// Hämtar trupperna från almtuna.com:s öppna JSON-API och sparar dem i src/data/squads.json.
// Klubbens egen sida använder samma API. Bara namn, tröjnummer, position och nationalitet sparas.
// Körs av GitHub Actions (se .github/workflows/deploy.yml) eller för hand: npm run squads
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/squads.json', import.meta.url);
const API = 'https://www.almtuna.com/api/sports-v2/athletes/by-team-uuid';
const TEAMS = { herr: '181c-181cv0b9i', dam: '181c-ebbfvOfZG', j20: '181c-97a6brSab' };

let existing = { updated: null, teams: {} };
try {
  existing = JSON.parse(await readFile(OUT, 'utf8'));
} catch {}

const teams = { ...existing.teams };
let failed = 0;
for (const [key, uuid] of Object.entries(TEAMS)) {
  try {
    const res = await fetch(`${API}/${uuid}`, { headers: { 'user-agent': 'almtunasupporter.se squad-fetcher (+https://almtunasupporter.se)' }, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const groups = await res.json();
    if (!Array.isArray(groups)) throw new Error('oväntat svar');
    teams[key] = groups.map((g) => ({
      position: String(g.position),
      players: (g.players ?? [])
        .map((p) => ({ name: String(p.fullName ?? ''), number: p.jerseyNumber ?? null, nationality: p.nationality ?? null }))
        .filter((p) => p.name)
        .sort((a, b) => (a.number ?? 999) - (b.number ?? 999)),
    })).filter((g) => g.players.length > 0);
  } catch (err) {
    failed++;
    console.warn(`Hoppade över ${key}: ${err.message}`);
  }
}

if (failed === Object.keys(TEAMS).length) {
  console.error('Inga trupper gick att läsa. Behåller befintlig data.');
  process.exit(0);
}

const changed = JSON.stringify(teams) !== JSON.stringify(existing.teams);
// Uppdatera tidsstämpeln bara när något ändrats, så att schemat inte skapar tomma commits.
const updated = changed ? new Date().toISOString() : existing.updated;
await writeFile(OUT, JSON.stringify({ updated, teams }, null, 2) + '\n');
const count = (k) => (teams[k] ?? []).reduce((n, g) => n + g.players.length, 0);
console.log(`Herr ${count('herr')}, dam ${count('dam')}, J20 ${count('j20')} spelare.`);
