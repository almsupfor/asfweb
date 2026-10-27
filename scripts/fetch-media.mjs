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
  { source: 'Dagens Nyheter', url: 'https://www.dn.se/rss/' },
  { source: 'Svenska Dagbladet', url: 'https://www.svd.se/feed/articles.rss' },
  { source: 'TV4', url: 'https://www.tv4.se/rss' },
  { source: 'SVT Nyheter', url: 'https://www.svt.se/rss.xml' },
  { source: 'Omni', url: 'https://omni.se/rss.xml' },
  { source: 'Sporten.com', url: 'https://www.sporten.com/feed/' },
  { source: 'HockeyNews', url: 'https://hockeynews.se/rss/lag/almtuna-is/feed.xml' },
  { source: 'Inside Almtuna', url: 'https://feed.pod.space/visynsilindbacken', all: true, type: 'podd' },
];

// Sidor utan RSS (taggsidor) där artikellistan ligger som JSON i HTML-en.
const PAGES = [
  { source: 'Upsala Nya Tidning', url: 'https://www.unt.se/tagg/story/almtuna-is-herr', base: 'https://www.unt.se' },
];

// Lokaltidningarnas ishockeysidor (motståndarlagens hemorter). Sidorna har inga datum och inget flöde med
// historik, så vi tar bara teasers som nämner Almtuna och hämtar publiceringsdatum från artikeln.
const TEASER_PAGES = [
  { source: 'Vestmanlands Läns Tidning', url: 'https://www.vlt.se/ishockey', base: 'https://www.vlt.se' },
  { source: 'Nerikes Allehanda', url: 'https://www.na.se/ishockey', base: 'https://www.na.se' },
  { source: 'Dalademokraten', url: 'https://www.dalademokraten.se/ishockey', base: 'https://www.dalademokraten.se' },
  { source: 'Länstidningen Södertälje', url: 'https://www.lt.se/ishockey', base: 'https://www.lt.se' },
  { source: 'Östersunds-Posten', url: 'https://www.op.se/ishockey', base: 'https://www.op.se' },
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

async function readPage({ source, url, base }) {
  const res = await fetch(url, { headers: { 'user-agent': 'almtunasupporter.se media-fetcher (+https://almtunasupporter.se)' }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const html = await res.text();
  const items = [];
  for (const block of html.split('"publishingDateStart":"').slice(1)) {
    const date = block.slice(0, 10);
    const title = block.match(/"puffHeadline":"((?:[^"\\]|\\.)*)"/)?.[1];
    const path = block.match(/"url":"(\/[^"]*\/artikel\/[^"]+)"/)?.[1];
    if (!title || !path || !/^\d{4}-\d\d-\d\d$/.test(date)) continue;
    items.push({ title: decode(JSON.parse(`"${title}"`)), source, date, url: base + path });
  }
  return items;
}

const UA = { 'user-agent': 'almtunasupporter.se media-fetcher (+https://almtunasupporter.se)' };

async function readTeasers({ source, url, base }, known) {
  const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const html = await res.text();
  const items = [];
  const seen = new Set();
  for (const m of html.matchAll(/teaser-j2-headline[^>]*><a href="([^"]+)">([\s\S]*?)<\/a>/g)) {
    const [, path, rawTitle] = m;
    const kicker = html.slice(Math.max(0, m.index - 500), m.index).match(/teaser-j2-kicker"><span>([^<]*)/g)?.pop() ?? '';
    const title = decode(rawTitle);
    const link = base + path;
    if (seen.has(link) || known.has(link) || !MATCH.test(`${title} ${kicker} ${html.slice(m.index, m.index + 700).match(/teaser-j2-text__text">([^<]*)/)?.[1] ?? ""}`)) continue;
    seen.add(link);
    const art = await fetch(link, { headers: UA, signal: AbortSignal.timeout(20000) });
    const when = art.ok ? (await art.text()).match(/"datePublished":"(\d{4}-\d\d-\d\d)/)?.[1] : null;
    if (when) items.push({ title, source, date: when, url: link });
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

for (const page of PAGES) {
  try {
    for (const item of await readPage(page)) {
      if (!byUrl.has(item.url)) { byUrl.set(item.url, item); added++; }
    }
  } catch (err) {
    failed++;
    console.warn(`Hoppade över ${page.source}: ${err.message}`);
  }
}

for (const page of TEASER_PAGES) {
  try {
    for (const item of await readTeasers(page, byUrl)) {
      byUrl.set(item.url, item);
      added++;
    }
  } catch (err) {
    failed++;
    console.warn(`Hoppade över ${page.source}: ${err.message}`);
  }
}

// Alla flöden föll bort: lämna filen orörd så att en driftstörning inte tömmer sidan.
if (failed === FEEDS.length + PAGES.length + TEASER_PAGES.length) {
  console.error('Inga flöden gick att läsa. Behåller befintlig data.');
  process.exit(0);
}

// Vilket lag en artikel gäller syns oftast bara i ingressen (meta-beskrivningen), inte i rubriken.
// Artikeln läses bara för att avgöra laget och inget av texten sparas. Poster som inte gick att läsa provas igen nästa körning.
const J20 = /(?<![\p{L}\p{N}])(?:[ju]20|juniorlag|juniorer)/iu;
const J18 = /(?<![\p{L}\p{N}])[ju]18/iu;
const DAM = /(?<![\p{L}\p{N}])dam(?:(?:lag|special|er|serien|allsvenskan|hockey)\p{L}*|(?![\p{L}\p{N}]))/iu;
const HERR = /(?<![\p{L}\p{N}])herr/iu;
// I brödtexten räknas bara en serie ('U20 Regional öst'), inte lösa omnämnanden som 'dubblar med J20'.
const SERIE = /(?<![\p{L}\p{N}])[ju](?:20|18)\s+(?:regional|allsvenskan|elit|nationell|div)/iu;
const classify = (text, lead = '') => {
  const t = `${text} ${SERIE.test(lead) ? lead : ''}`;
  if (J18.test(t)) return 'j18';
  if (J20.test(t)) return 'j20';
  return DAM.test(text) && !HERR.test(text) ? 'dam' : 'a-lag';
};
for (const item of byUrl.values()) {
  if (item.lag || item.type === 'podd') continue;
  try {
    const res = await fetch(item.url, { headers: UA, signal: AbortSignal.timeout(20000) });
    if (!res.ok) continue;
    const html = await res.text();
    const desc = html.match(/<meta[^>]+(?:property="og:description"|name="description")[^>]+content="([^"]*)"/i)?.[1] ?? '';
    // UNT skriver ofta serien först i brödtexten ("U20 Regional öst herr"), så med dess inledning också.
    const lead = decode(html.split('class="body"')[1]?.slice(0, 1500) ?? '').slice(0, 300);
    item.lag = classify(`${item.title} ${decode(desc)}`, lead);
  } catch {}
}

const items = [...byUrl.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, MAX_ITEMS);
const changed = added > 0 || JSON.stringify(items) !== JSON.stringify(existing.items);
// Uppdatera tidsstämpeln bara när något ändrats, så att schemat inte skapar tomma commits.
const updated = changed ? new Date().toISOString() : existing.updated;
await writeFile(OUT, JSON.stringify({ updated, items }, null, 2) + '\n');
console.log(`${added} nya, ${items.length} totalt.`);
