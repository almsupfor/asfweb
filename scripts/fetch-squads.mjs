// Hämtar spelarlistorna från almtuna.com:s öppna JSON-API (samma anrop som statistiksidan använder)
// och sparar dem i src/data/squads.json. Bara namn, tröjnummer och nationalitet sparas.
// Anropet ger de spelare som finns i lagets statistik. Position saknas för de flesta, så listan delas inte upp på position.
// Körs av GitHub Actions (se .github/workflows/deploy.yml) eller för hand: npm run squads
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/squads.json', import.meta.url);
const API = 'https://www.almtuna.com/api/statistics-v2/stats-info/players_summary';
const KEEPER_API = 'https://www.almtuna.com/api/statistics-v2/stats-info/goalkeepers_summary';
const TEAMS = { herr: '181c-181cv0b9i', dam: '181c-ebbfvOfZG', j20: '181c-97a6brSab' };

let existing = { updated: null, teams: {} };
try {
  existing = JSON.parse(await readFile(OUT, 'utf8'));
} catch {}

const teams = { ...existing.teams };
const keepers = { ...existing.keepers };
const headers = { 'user-agent': 'almtunasupporter.se squad-fetcher (+https://almtunasupporter.se)' };
let failed = 0;
for (const [key, uuid] of Object.entries(TEAMS)) {
  try {
    const res = await fetch(`${API}?teamUuid=${uuid}&module=players_summary&count=50`, { headers, signal: AbortSignal.timeout(20000) });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    const body = await res.json();
    const data = Array.isArray(body) ? body[0] : body;
    if (!Array.isArray(data?.stats)) throw new Error('oväntat svar');
    // Tröjnummer finns ibland bara i listan "players", som har samma spelare nycklade på id.
    const extra = new Map(Object.values(data.players ?? {}).map((p) => [p.uuid, p]));
    const players = data.stats
      .filter((r) => r.info?.fullName && (!r.info.team?.uuid || r.info.team.uuid === uuid))
      .map(({ info: i, ...r }) => ({
        name: String(i.fullName),
        lastName: String(i.lastName ?? i.fullName),
        number: i.number ?? extra.get(i.uuid)?.jerseyNumber ?? null,
        nationality: i.nationality && i.nationality !== 'N/A' ? i.nationality : null,
        gp: r.GP ?? 0,
        g: r.G ?? 0,
        a: r.A ?? 0,
        tp: r.TP ?? 0,
        pm: r.PlusMinus ?? 0,
        pim: r.PIM ?? 0,
        toi: r.TOI_GP ?? null, // snittid per match, "0:00" för den som inte spelat som utespelare
      }))
      // Flest poäng först, sedan flest mål, sedan efternamn.
      .sort((a, b) => b.tp - a.tp || b.g - a.g || a.lastName.localeCompare(b.lastName, 'sv'))
      .map(({ lastName, ...p }) => p);
    teams[key] = players;
    // Målvakter har en egen modul. Saknas den behålls förra omgångens lista.
    try {
      const kres = await fetch(`${KEEPER_API}?teamUuid=${uuid}&module=goalkeepers_summary&count=25`, { headers, signal: AbortSignal.timeout(20000) });
      if (!kres.ok) throw new Error(`${kres.status} ${kres.statusText}`);
      const kbody = await kres.json();
      const kdata = Array.isArray(kbody) ? kbody[0] : kbody;
      if (!Array.isArray(kdata?.stats)) throw new Error('oväntat svar');
      keepers[key] = kdata.stats
        .filter((r) => r.info?.fullName && (!r.info.team?.uuid || r.info.team.uuid === uuid))
        .map(({ info: i, ...r }) => ({
          name: String(i.fullName),
          gp: Number(r.GPI) || 0, // GP är lagets matcher, GPI matcher målvakten spelat
          svs: r.SVS ?? 0,
          ga: r.GA ?? 0,
          svsPerc: r.SVSPerc != null && r.SVSPerc !== '' ? String(r.SVSPerc) : null,
          gaa: r.GAA != null && r.GAA !== '' ? String(r.GAA) : null,
          so: r.SO ?? 0,
          mip: r.MIP || null,
        }))
        .filter((k) => k.gp > 0)
        .sort((a, b) => b.gp - a.gp || a.name.localeCompare(b.name, 'sv'));
    } catch (err) {
      console.warn(`Hoppade över målvakter för ${key}: ${err.message}`);
    }
  } catch (err) {
    failed++;
    console.warn(`Hoppade över ${key}: ${err.message}`);
  }
}

if (failed === Object.keys(TEAMS).length) {
  console.error('Inga trupper gick att läsa. Behåller befintlig data.');
  process.exit(0);
}

const changed = JSON.stringify({ teams, keepers }) !== JSON.stringify({ teams: existing.teams, keepers: existing.keepers });
// Uppdatera tidsstämpeln bara när något ändrats, så att schemat inte skapar tomma commits.
const updated = changed ? new Date().toISOString() : existing.updated;
await writeFile(OUT, JSON.stringify({ updated, teams, keepers }, null, 2) + '\n');
const count = (k) => (teams[k] ?? []).length;
console.log(`Herr ${count('herr')}, dam ${count('dam')}, U20 ${count('j20')} spelare.`);
