// Hämtar artiklar som nämner Almtuna från mediernas egna RSS-flöden och
// sparar rubrik, källa, datum och länk i src/data/media.json.
// Körs av GitHub Actions på schema (se .github/workflows/deploy.yml) eller för hand: npm run media
// Ingen artikeltext kopieras. Gamla poster behålls, så historiken växer med tiden.
import { readFile, writeFile } from 'node:fs/promises';

const OUT = new URL('../src/data/media.json', import.meta.url);
const MATCH = /almtuna/i;
const MAX_ITEMS = 300;

// Lägg till fler flöden här. Bara flöden som mediet själv publicerar för spridning.
// all: true tar med alla poster (för flöden som bara handlar om Almtuna). type: 'podd' märker poster som poddavsnitt.
const FEEDS = [
  { source: 'Upsala Nya Tidning', url: 'https://www.unt.se/rss' },
  { source: 'Upsala Nya Tidning', url: 'https://www.unt.se/rss/sport' },
  { source: 'Hockeysverige', url: 'https://www.hockeysverige.se/feed/' },
  { source: 'SVT Sport', url: 'https://www.svt.se/sport/rss.xml' },
  { source: 'Expressen', url: 'https://www.expressen.se/rss/sport' },
  { source: 'Aftonbladet', url: 'https://www.aftonbladet.se/sportbladet/rss.xml' },
  { source: 'Omni', url: 'https://omni.se/rss.xml' },
  { source: 'Sporten.com', url: 'https://www.sporten.com/feed/' },
  { source: 'HockeyNews', url: 'https://hockeynews.se/rss/lag/almtuna-is/feed.xml' },
  { source: 'Inside Almtuna', url: 'https://feed.pod.space/visynsilindbacken', all: true, type: 'podd' },
];

const entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => entities[n.toLowerCase()] ?? m)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
const tag = (xml, name) => {
  const m = xml.match(new RegExp(String.raw`<${name}(?:\s[^>]*)?>([\s\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : '';
};

async function readFeed({ source, url, all = false, type = 'artikel' }) {
  const res = await fetch(url, { headers: { 'user-agent': 'almtunasupporter.se media-fetcher (+https://almtunasupporter.se)' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const xml = await res.text();
  const items = [];
  for (const block of xml.split(/<item[\s>]/i).slice(1)) {
    const title = tag(block, 'title');
    const link = tag(block, 'link') || tag(block, 'guid');
    const when = new Date(tag(block, 'pubDate') || tag(block, 'dc:date'));
    const categories = [...block.matchAll(/<category[^>]*>([\s\S]*?)<\/category>/gi)].map((m) => decode(m[1])).join(' ');
    const text = `${title} ${link} ${tag(block, 'description')} ${categories}`;
    if (!title || !/^https?:\/\//.test(link) || Number.isNaN(+when) || (!all && !MATCH.test(text))) continue;
    items.push({ title, source, date: when.toISOString().slice(0, 10), url: link, ...(type !== 'artikel' && { type }) });
  }
  return items;
}

let existing = { updated: null, items: [] };
try {
  existing = JSON.parse(await readFile(OUT, 'utf8'));
} catch {}

const byUrl = new Map(existing.items.map((i) => [i.url, i]));
let added = 0;
let failed = 0;
for (const feed of FEEDS) {
  try {
    for (const item of await readFeed(feed)) {
      if (!byUrl.has(item.url)) { byUrl.set(item.url, item); added++; }
    }
  } catch (err) {
    failed++;
    console.warn(`Hoppade över ${feed.source}: ${err.message}`);
  }
}

// Alla flöden föll bort: lämna filen orörd så att en driftstörning inte tömmer sidan.
if (failed === FEEDS.length) {
  console.error('Inga flöden gick att läsa. Behåller befintlig data.');
  process.exit(0);
}

const items = [...byUrl.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_ITEMS);
const changed = added > 0 || JSON.stringify(items) !== JSON.stringify(existing.items);
// Uppdatera tidsstämpeln bara när något ändrats, så att schemat inte skapar tomma commits.
const updated = changed ? new Date().toISOString() : existing.updated;
await writeFile(OUT, JSON.stringify({ updated, items }, null, 2) + '\n');
console.log(`${added} nya, ${items.length} totalt.`);
