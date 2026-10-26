// Bygger src/data/matches.json: spelschema och resultat.
//
// Schema:   Två nedladdade kopior, ingen synkas mot källan:
//           - src/data/schedule-official.txt: klubbens officiella spelschema (almtuna.com/game-schedule), inklistrad text.
//             Den har tider, hallar och färdiga resultat och vinner över ICS-filen.
//           - src/data/schedule.ics: en kalenderfil. Används för det som saknas i den officiella listan (träningsmatcher).
//           Ladda ner ICS på nytt med "npm run schedule" (scripts/download-schedule.mjs).
// Resultat: den officiella listan, plus TheSportsDB:s gratisnyckel "123", som bara ger senaste matchen.
//           Skriptet körs ofta, så varje nytt resultat fångas och sparas i historiken.
//
// Körs av GitHub Actions på schema (se .github/workflows/deploy.yml) eller för hand: npm run matches
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/matches.json', import.meta.url);
const ICS_COPY = new URL('../src/data/schedule.ics', import.meta.url);
const OFFICIAL = new URL('../src/data/schedule-official.txt', import.meta.url);
const SEASON_START_YEAR = 2026; // säsongen 2026/27
const TSDB = 'https://www.thesportsdb.com/api/v1/json/123';
const TEAM_ID = '144401'; // Almtuna IS i TheSportsDB
const TZ = 'Europe/Stockholm';
const UA = { 'user-agent': 'almtunasupporter.se match-fetcher' };

// ---- tid -------------------------------------------------------------------------------------
const stockholmParts = (ms) => {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
  const p = Object.fromEntries(f.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { y: +p.year, mo: +p.month, d: +p.day, h: +p.hour, mi: +p.minute };
};
// Svensk lokal tid -> UTC (hanterar sommar- och vintertid).
const localToUtcMs = (y, mo, d, h, mi) => {
  let guess = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 3; i++) {
    const p = stockholmParts(guess);
    const shown = Date.UTC(p.y, p.mo - 1, p.d, p.h, p.mi);
    guess -= shown - Date.UTC(y, mo - 1, d, h, mi);
  }
  return guess;
};
const dayOf = (ms) => {
  const p = stockholmParts(ms);
  return `${p.y}-${String(p.mo).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
};

// ---- iCal ------------------------------------------------------------------------------------
const unescapeIcs = (s) => s.replace(/\\n/gi, ' ').replace(/\\([,;\\])/g, '$1').trim();

function parseIcs(text) {
  const lines = text.replace(/\r\n|\r/g, '\n').replace(/\n[ \t]/g, '').split('\n');
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') cur = {};
    else if (line === 'END:VEVENT') { if (cur) events.push(cur); cur = null; }
    else if (cur) {
      const i = line.indexOf(':');
      if (i < 0) continue;
      const [name, ...params] = line.slice(0, i).split(';');
      cur[name.toUpperCase()] = { value: line.slice(i + 1), params: params.join(';') };
    }
  }
  return events;
}

// Returnerar { date, start, timeKnown }. Midnatt (00:00) och heldagshändelser räknas som okänd tid,
// eftersom en match inte börjar mitt i natten: tiden är då troligen inte fastställd i källan.
function parseStart({ value }) {
  const m = value.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h, mi, , z] = m;
  if (h === undefined) return { date: `${y}-${mo}-${d}`, start: null, timeKnown: false };
  const ms = z ? Date.UTC(+y, +mo - 1, +d, +h, +mi) : localToUtcMs(+y, +mo, +d, +h, +mi);
  const date = dayOf(ms);
  const localTime = stockholmParts(ms);
  if (localTime.h === 0 && localTime.mi === 0) return { date, start: null, timeKnown: false };
  return { date, start: new Date(ms).toISOString(), timeKnown: true };
}

function toMatch(ev) {
  const when = ev.DTSTART && parseStart(ev.DTSTART);
  const summary = ev.SUMMARY && unescapeIcs(ev.SUMMARY.value);
  if (!when || !summary) return null;
  const training = /^tr[äa]ningsmatch/i.test(summary);
  const teams = summary.replace(/^[^:]*:\s*/, '').split(/\s[–—-]\s/);
  if (teams.length !== 2) return null;
  const [home, away] = teams.map((t) => t.trim());
  return {
    ...when,
    home,
    away,
    isHome: /almtuna/i.test(home),
    venue: ev.LOCATION ? unescapeIcs(ev.LOCATION.value) : null,
    kind: training ? 'training' : 'league',
  };
}

async function loadIcs() {
  let text;
  try {
    text = await readFile(ICS_COPY, 'utf8');
  } catch {
    console.warn('Hittar inte src/data/schedule.ics. Kör "npm run schedule" för att ladda ner schemat.');
    return [];
  }
  return parseIcs(text).map(toMatch).filter(Boolean);
}

// ---- klubbens officiella lista (inklistrad text) ---------------------------------------------
const MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december'];
const DATE_LINE = /^(?:m[åa]ndag|tisdag|onsdag|torsdag|fredag|l[öo]rdag|s[öo]ndag)\s+(\d{1,2})\s+([a-zåäö]+)$/i;

// Varje match är: datumrad, "Hemma – Borta", hemmalag, (resultat [SO/OT] | "Starttid:" + tid), bortalag, hall.
function parseOfficial(text) {
  const lines = text.replace(/\r/g, '').split('\n').map((l) => l.trim()).filter(Boolean);
  const blocks = [];
  for (const line of lines) {
    const d = line.match(DATE_LINE);
    if (d) blocks.push({ day: +d[1], month: MONTHS.indexOf(d[2].toLowerCase()), body: [] });
    else if (blocks.length) blocks.at(-1).body.push(line);
  }
  const games = [];
  for (const b of blocks) {
    if (b.month < 0) continue;
    const year = b.month >= 6 ? SEASON_START_YEAR : SEASON_START_YEAR + 1;
    const date = `${year}-${String(b.month + 1).padStart(2, '0')}-${String(b.day).padStart(2, '0')}`;
    const [, home, ...rest] = b.body;
    let i = 0;
    let score = null;
    let ext = null;
    let time = null;
    if (/^\d+-\d+$/.test(rest[i] ?? '')) {
      const [h, a] = rest[i++].split('-').map(Number);
      score = { home: h, away: a };
      if (/^(SO|OT)$/i.test(rest[i] ?? '')) ext = rest[i++].toUpperCase();
    } else if (/^starttid/i.test(rest[i] ?? '')) {
      i++;
      time = rest[i++] ?? null;
    }
    const away = rest[i++];
    const venue = rest[i++] ?? null;
    if (!home || !away) continue;
    games.push({ date, home, away, venue, score, ext, time });
  }
  return games;
}

async function loadOfficial() {
  try {
    return parseOfficial(await readFile(OFFICIAL, 'utf8'));
  } catch {
    return [];
  }
}

function fromOfficial(g, ics) {
  const [h, mi] = (g.time ?? '').split(':').map(Number);
  // 0:00 betyder "starttid ej satt" även hos klubben.
  const timeKnown = g.time != null && !Number.isNaN(h) && !(h === 0 && mi === 0);
  const [y, mo, d] = g.date.split('-').map(Number);
  // Spelade matcher har ingen starttid i listan: behåll ICS-tiden om det finns en.
  const keepIcs = !timeKnown && ics?.timeKnown;
  return {
    date: g.date,
    start: timeKnown ? new Date(localToUtcMs(y, mo, d, h, mi)).toISOString() : keepIcs ? ics.start : null,
    timeKnown: timeKnown || Boolean(keepIcs),
    home: g.home,
    away: g.away,
    isHome: /almtuna/i.test(g.home),
    venue: g.venue ?? ics?.venue ?? null,
    kind: ics?.kind ?? 'league',
  };
}

// Lägg den officiella listan över ICS-schemat: officiella uppgifter vinner, och matcher som bara finns där läggs till.
function mergeSchedules(ics, official) {
  const byDate = new Map(official.map((g) => [g.date, g]));
  const out = [];
  for (const m of ics) {
    const g = byDate.get(m.date);
    if (!g) { out.push(m); continue; }
    byDate.delete(m.date);
    out.push(fromOfficial(g, m));
  }
  for (const g of byDate.values()) out.push(fromOfficial(g, null));
  return out.sort((a, b) => a.date.localeCompare(b.date) || (a.start ?? '').localeCompare(b.start ?? ''));
}

// Färdiga resultat ur den officiella listan.
const officialResults = (official) =>
  official
    .filter((g) => g.score)
    .map((g) => ({
      id: `official-${g.date}`,
      date: g.date,
      home: g.home,
      away: g.away,
      homeScore: g.score.home,
      awayScore: g.score.away,
      ...(g.ext && { ext: g.ext }),
    }));

// ---- TheSportsDB: senaste resultat -----------------------------------------------------------
async function loadLastResult() {
  const res = await fetch(`${TSDB}/eventslast.php?id=${TEAM_ID}`, { headers: UA, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const e = (await res.json()).results?.[0];
  if (!e || !e.strTimestamp || e.intHomeScore == null || e.intAwayScore == null) return null;
  return {
    id: e.idEvent,
    date: dayOf(Date.parse(`${e.strTimestamp}Z`)),
    home: e.strHomeTeam,
    away: e.strAwayTeam,
    homeScore: Number(e.intHomeScore),
    awayScore: Number(e.intAwayScore),
  };
}

// ---- spara -----------------------------------------------------------------------------------
let existing = { updated: null, schedule: [], results: [] };
try { existing = { ...existing, ...JSON.parse(await readFile(OUT, 'utf8')) }; } catch {}

const official = await loadOfficial();
const ics = await loadIcs();
const schedule = ics.length || official.length
  ? mergeSchedules(ics, official).sort((a, b) => a.date.localeCompare(b.date) || (a.start ?? '').localeCompare(b.start ?? ''))
  : existing.schedule;

// Resultat: officiella först, sedan sådana som bara finns i historiken för andra datum.
const fromList = officialResults(official);
const officialDates = new Set(fromList.map((r) => r.date));
const results = [...fromList, ...existing.results.filter((r) => !officialDates.has(r.date))];
try {
  const last = await loadLastResult();
  if (last && !results.some((r) => r.date === last.date)) results.push(last);
} catch (err) {
  console.warn(`Resultat: ${err.message}`);
}
results.sort((a, b) => b.date.localeCompare(a.date));

const next = { schedule, results: results.slice(0, 120) };
const changed = JSON.stringify(next) !== JSON.stringify({ schedule: existing.schedule, results: existing.results });
const updated = changed ? new Date().toISOString() : existing.updated;
await writeFile(OUT, JSON.stringify({ updated, ...next }, null, 2) + '\n');
const unknown = schedule.filter((m) => !m.timeKnown && m.date >= dayOf(Date.now())).length;
console.log(`${schedule.length} matcher i schemat (${unknown} kommande utan fastställd tid), ${next.results.length} resultat, ${official.length} i den officiella listan. ${changed ? 'Uppdaterad.' : 'Ingen ändring.'}`);
