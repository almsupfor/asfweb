---
name: asf-data
description: Dataflöden och automatik för almtunasupporter.se: artiklar och poddavsnitt (I media), spelschema och resultat (Matcher), serietabeller, trupper och målvakter (Laget), GitHub Actions-schemat. Använd när du lägger till källor, uppdaterar schema/resultat, felsöker hämtningen eller ändrar vad som visas.
---

# Dataflöden för almtunasupporter.se

All hämtad data (artiklar, matcher, tabeller, trupper) ligger som **filer i git**. GitHub Actions kör skripten var tredje timme, sparar ändringar som en commit på `main` och bygger om och publicerar sajten. Sidorna är statiska HTML. Det enda som ligger i en databas är bortaresor och anmälningar (Supabase, se skillen `asf-web`).

**almtuna.com:s statistik-API.** Tabeller, trupper och målvakter läses från `https://www.almtuna.com/api/statistics-v2/...`, samma öppna JSON-API som klubbens egen statistiksida använder (ingen inloggning). Klubben har inte godkänt det och villkoren är inte kontrollerade; föreningen bör fråga klubben. Använd det lugnt: bara namn, tröjnummer, nationalitet och statistik sparas, anropen är få (ca 12 per hämtning, en hämtning per dygn) och skripten presenterar sig med en tydlig användaragent. Lägg inte till fler anrop utan att fråga användaren.

## I media (`src/data/media.json`)

- Skript: `scripts/fetch-media.mjs` (`npm run media`). Läser RSS-flöden i listan `FEEDS`, behåller bara poster som nämner ”Almtuna” (i rubrik, länk, beskrivning eller kategorier), slår ihop med befintlig historik via URL, sorterar på datum, högst `MAX_ITEMS` (300). Faller alla flöden bort lämnas filen orörd.
- Lagrar **bara** `title`, `source`, `date` (ÅÅÅÅ-MM-DD), `url`, `lag` och ev. `type: 'podd'`. Aldrig artikeltext.
- Källor idag: Upsala Nya Tidning, Hockeysverige, SVT Sport, Expressen, Aftonbladet, Sporten.com, HockeyNews (lagflöde `hockeynews.se/rss/lag/almtuna-is/feed.xml`), DN, SvD, TV4 och SVT Nyheter (riksflöden, filtreras på ”Almtuna”) och podden Inside Almtuna (`https://feed.pod.space/visynsilindbacken`, `all: true, type: 'podd'`, hittad via Apples poddkatalog `itunes.apple.com/search?term=inside+almtuna&entity=podcast`).
- Feedalternativ: `all: true` tar med allt (för flöden som bara handlar om Almtuna), `type: 'podd'` märker avsnitt. Parsern läser bara RSS (`<item>`), inte Atom (YouTube behöver tillägg).
- **Sidor utan RSS skrapas** (listorna `PAGES` och `TEASER_PAGES` i skriptet). `PAGES`: UNT:s taggsida `unt.se/tagg/story/almtuna-is-herr`, där artikellistan ligger som JSON i HTML-en (`puffHeadline`, `publishingDateStart`, `url`). `TEASER_PAGES`: ishockeysidorna hos motståndarnas lokaltidningar (NA, Dalademokraten, Länstidningen Södertälje, Östersunds-Posten; samma plattform, `teaser-j2-headline`). Teasers har inget datum, så publiceringsdatum (`datePublished`) hämtas från artikeln, och en teaser tas bara med om rubrik, etikett eller ingress nämner Almtuna. Sidorna visar bara ca 50 senaste, så historiken byggs upp över tid. Skrapan är skör: ändrar tidningen sin HTML hoppas sidan över med en varning.
- **Lag (`lag`: `a-lag` | `dam` | `j20` | `j18`):** sätts av skriptet när posten är ny. Rubriken räcker ofta inte, så artikelns meta-beskrivning och (UNT) de första 300 tecknen av brödtexten läses för att avgöra laget (artikeltexten sparas inte). Brödtexten räknas bara om en serie står där (”U20 Regional öst”), inte lösa omnämnanden. `lagFor()` i `media.ts` använder `lag` först och faller tillbaka på rubriken; `LAG_OVERRIDES` går före allt. Poster utan `lag` (kunde inte läsas) provas igen nästa körning.
- **Namn:** U20 och J20 är samma lag (U20 = laget/nu gällande namn, J20 = äldre namn på serien), likaså U18 och J18. Sajten visar **U20** och **U18**; internt heter nycklarna fortfarande `j20`/`j18`. Almtunas U20 spelar U20 Regional Öst, inte nationella J20. Mönstren matchar båda skrivsätten.
- **Fallgrop:** Skriv om regex med Write/Edit, inte shell-heredoc eller `node -e` (backslashar tappas, och heredoc med `python -` kan hänga i den här miljön).
- Visning: `/i-media` har en sektion per lag (Herrlaget först, övriga sorterade efter antal) plus **Podd**. Varje sektion visar de **5 senaste** direkt, resten bakom ”Äldre artiklar/avsnitt”. Tak per sektion: 60 för herrlaget, 20 för övriga. Startsidan visar 3 artiklar och 2 avsnitt. Gränserna sitter i `i-media.astro` och `index.astro`.
- Listan innehåller artiklar där Almtuna bara nämns (till exempel motståndarens förhandsartikel). Det finns ingen automatisk filtrering på om Almtuna är huvudämnet. VLT (Västerås) togs bort som källa eftersom bevakningen mest handlar om Västerås IK. Vill man ta bort enstaka artiklar får det göras med en exkluderingslista i skriptet.
- Manuella poster går att lägga direkt i `media.json`; de behålls.
- Prövade utan lyckat resultat: Hockeysveriges klubbflöde (404), SVT Uppsala, NT, Hockeynews globala, almtuna.com (ingen RSS/sitemap), insidealmtuna.se (ingen RSS; dess sitemap pekar fel). **Google Nyheters RSS får inte användas på publik sajt** (villkoren).

## Matcher (`src/data/matches.json`)

- Skript: `scripts/fetch-matches.mjs` (`npm run matches`). Bygger `schedule` och `results`.
- **Källor, i prioritetsordning:**
  1. `src/data/schedule-official.txt` – klubbens officiella lista (almtuna.com/game-schedule), **inklistrad text**, hämtad 2026-10-27. Innehåller tider, hallar och färdiga resultat (inkl. förlängning/straffar `OT`/`SO`). Vinner över ICS. Sidan går inte att skrapa (ritas i webbläsaren): användaren kopierar texten.
  2. `src/data/schedule.ics` – nedladdad kopia av en egengjord kalenderfil (`https://malmstrom.xyz/almtuna.ics`, sköts av en bekant). Fyller i det som saknas, främst träningsmatcher. Stämde med klubbens lista på 51 av 52 serie­matcher. Ladda ner ny med `npm run schedule` (valfri annan adress som argument).
  3. TheSportsDB (`/api/v1/json/123/eventslast.php?id=144401`, team-id Almtuna IS = 144401, liga HockeyAllsvenskan = 5162). `123` är deras dokumenterade gratisnyckel. Gratisnivån ger bara senaste matchen (därför byggs resultathistoriken upp över tid), 30 anrop/min, ingen tabell. Fullt schema/tabell kräver betalnivån. Villkoren för publik användning är obekräftade (sidan svarade 502).
- **Ingen synk mot källorna:** schemat uppdateras bara när någon klistrar in ny text/hämtar ny ICS och kör `npm run matches`. Resultaten från TheSportsDB uppdateras av det schemalagda jobbet.
- **Tidsregler:** ICS-tider utan tidszon tolkas som svensk lokal tid (sommar/vintertid hanteras). **0:00 betyder ”starttid ej satt”** (gäller även klubbens egen lista) och visas på vardagar som ”19:00 (preliminärt)”, annars ”tid ej fastställd”. Kvällsmatcher på vardagar börjar nästan alltid 19:00 (onsdag/fredag). Kvarvarande 0:00: 29 jan (BIK Karlskoga borta) och 26 feb (Vimmerby borta).
- Lagnamn följer klubbens lista (”Vimmerby Hockey”, ”Västerås IK”). TheSportsDB använder andra (”Vimmerby”, ”VIK Västerås HK”); resultat joinas på **datum**.
- Visning: `src/data/matches.ts` har `upcoming()`, `nextMatch()`, `lastResult()`, `fmtDay/fmtTime/fmtScore`. Startsidans kort ”Nästa match”/”Senaste resultat”, `/matcher` (kommande + resultat för herrlaget; dam och U20 har egna sidor via `matcher/[lag].astro` men visar bara en notis och länk till klubbens schema, ingen matchdata), `/bortaresor` (listan ”Kommande bortamatcher” fylls automatiskt; ”Föreningens resor” hämtas från Supabase i webbläsaren).
- Admins lista över kommande bortamatcher (`admin.astro`) och förslaget på avgångstid (`src/data/arenor.ts`) bygger på `upcoming()` och hallnamnen i schemat. Körtiderna i `arenor.ts` är bilrestid från Gränby ishall (OpenStreetMap/OSRM, uträknad 2026-10-28); nya hallar nästa säsong behöver läggas till där, annars föreslås ingen avgångstid.
- En kommande match döljs automatiskt när den startat (jämförs vid bygget).

## Tabeller (`src/data/tables.json`)

- Skript: `scripts/fetch-tables.mjs` (`npm run tables`). För herr (HockeyAllsvenskan), dam och U20: hämtar `sports-v2/latest-ssgt/<serie>` och `statistics-v2/league-standings?ssgtUuid=…` och sparar rang, lag, spelade, vinster (`w`, `otw`), förluster (`l`, `otl`), målskillnad och poäng. Serie-id:n står överst i skriptet. Almtuna markeras (`ours`) via lag-id eller namn, eftersom dam och U20 har egna lag-id.
- API:et skriver ibland J20/J18; skriptet visar U20/U18. Faller allt bort behålls filen. Tidsstämpeln ändras bara när något ändrats.
- Visning: `src/data/tables.ts` (`table(lag)`), komponenten `Tabell.astro` på `/laget` och lagsidorna.

## Trupper och målvakter (`src/data/squads.json`)

- Skript: `scripts/fetch-squads.mjs` (`npm run squads`). Per lag (`herr`, `dam`, `j20`, lag-id i `TEAMS`): utespelare från `statistics-v2/stats-info/players_summary?teamUuid=…&module=players_summary&count=50` och målvakter från `goalkeepers_summary?teamUuid=…&module=goalkeepers_summary&count=25`.
- Spelare sparas som `teams[lag]`: namn, tröjnummer, nationalitet, matcher, mål, assist, poäng, plus/minus, utvisningsminuter och snittid (`toi`; `0:00` för den som inte spelat som utespelare). Målvakter sparas som `keepers[lag]`: namn, matcher (`GPI`, matcher målvakten själv spelat; `GP` är lagets), räddningar, insläppta, räddningsprocent, snitt insläppta, nollor, speltid. Målvakter utan spelade matcher utelämnas. Sparar aldrig födelsedatum eller bilder.
- Visning: `src/data/squads.ts` (`squad()`, `goalkeepers()`, `hasPlayed()`), komponenten `Trupp.astro` (tabell för utespelare, tabell för målvakter, notis om spelare utan speltid).

## Schemat (GitHub Actions)

`.github/workflows/deploy.yml`: triggas av push till `main`, cron `17 */3 * * *` och manuellt. Steg: `npm ci` → `npm run media` → `npm run matches` → `npm run squads` → `npm run tables` (de två sista bara på dygnsschemat `23 4 * * *`, alltså ca 05–06 svensk tid, och vid manuell körning, **inte vid push** och inte var tredje timme, för att belasta klubbens API så lite som möjligt) → (om inte push) commit av `src/data/media.json`, `matches.json`, `squads.json` och `tables.json` till `main` (meddelande ”Uppdatera artiklar och matcher”) → `npm run build` → deploy till Pages. Kräver `permissions: contents: write`. Schemalagda jobb körs bara på standardgrenen och kan pausas i inaktiva förråd (oklart om botens egna commits räknas som aktivitet). Misslyckas steget om grenen har skyddsregler.

## Ändra eller felsöka

- Lägg till en mediekälla: en rad i `FEEDS`. Testa med `node scripts/fetch-media.mjs` och titta i `media.json`. Kontrollera att flödet verkligen ger träffar (breda flöden har få poster).
- Uppdatera schema: klistra in ny text i `schedule-official.txt` (format: datumrad ”fredag 28 augusti”, ”Hemma – Borta”, hemmalag, resultat eller ”Starttid:” + tid, bortalag, hall) och kör `npm run matches`. Skriptet skriver en rad med antal matcher och hur många kommande som saknar tid.
- Visa resultat som inte kommer med: kolla att datumet finns i listan eller att TheSportsDB hunnit publicera.
- Efter ändringar i skripten: kör dem, titta på JSON-filerna, kör `npm run build` och kontrollera `dist/matcher/index.html`, `dist/i-media/index.html` och `dist/laget/index.html`.
- Saknas en spelare eller målvakt: kontrollera först att API:et svarar för laget (anropet ovan med `curl`). Målvakter med 0 spelade matcher visas inte med flit.
- Skriv skriptfiler med Write/Edit (inte shell-heredoc): reguljära uttryck tappar backslashar annars.
