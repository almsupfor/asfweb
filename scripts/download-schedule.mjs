// Laddar ner spelschemat (iCal) till src/data/schedule.ics. Körs för hand, inte av schemat:
//   npm run schedule                 (standardadress)
//   npm run schedule -- <adress>     (annan adress)
// Kör sedan "npm run matches" för att bygga om src/data/matches.json.
import { writeFile } from 'node:fs/promises';

const URL_DEFAULT = 'https://malmstrom.xyz/almtuna.ics';
const url = process.argv[2] || URL_DEFAULT;

const res = await fetch(url, { headers: { 'user-agent': 'almtunasupporter.se schedule-download' }, signal: AbortSignal.timeout(20000) });
if (!res.ok) {
  console.error(`Kunde inte ladda ner ${url}: ${res.status} ${res.statusText}`);
  process.exit(1);
}
const text = await res.text();
if (!text.includes('BEGIN:VCALENDAR')) {
  console.error(`${url} är ingen iCal-fil. Inget sparades.`);
  process.exit(1);
}
await writeFile(new URL('../src/data/schedule.ics', import.meta.url), text);
console.log(`Sparade ${(text.match(/BEGIN:VEVENT/g) || []).length} matcher från ${url} i src/data/schedule.ics.`);
