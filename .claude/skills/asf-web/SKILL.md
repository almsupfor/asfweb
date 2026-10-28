---
name: asf-web
description: Projektkunskap för almtunasupporter.se (Almtuna Supporterförening). Använd när du ändrar sidor, meny, innehåll, layout/CSS, design, bortaresor/anmälan/admin (Supabase) eller publicering (GitHub Pages + Cloudflare) i detta repo, eller när du återupptar arbetet och behöver veta läget och vad som återstår.
---

# Almtuna Supporterförening – webbplats

Sida för supporterföreningen till ishockeylaget Almtuna IS (Uppsala), som spelar i HockeyAllsvenskan. Domän: **almtunasupporter.se** (ägs av föreningen, ligger bakom Cloudflare och är uppe sedan 2026-10-28). Föreningen är **fristående** från Almtuna IS och sidan ska inte se ut som klubbens officiella. Språk: svenska (`lang="sv"`).

Datapipelines (artiklar, schema, resultat, tabeller, trupper) beskrivs i skillen `asf-data`. Produkt och design finns i `PRODUCT.md` och `DESIGN.md` (läs dem först; `.impeccable/design.json` är sidecar till DESIGN.md och ligger efter, se *Läget*).

## Principer (bindande)

- **Sidan ska inte kräva manuellt underhåll.** Sånt som kan hållas aktuellt automatiskt ska göras så, så att folk har skäl att komma tillbaka.
- **Inget påhittat.** Saknade fakta lämnas öppna eller märks som obekräftade/preliminära. Hitta inte på avgifter, Swish-nummer, bilder, logotyp eller klubbemblem.
- **Bara länka, kopiera aldrig artikeltext.** Rubrik, källa, datum, länk.
- **Läs bara det som är öppet.** Använd öppna RSS/iCal, inklistrad text från användaren eller almtuna.com:s öppna statistik-API (se `asf-data`; klubben har inte godkänt det och villkoren är inte kontrollerade, så föreningen bör fråga klubben). Skrapa inga andra privata gränssnitt (till exempel hockeyallsvenskan.se) och lägg inte till fler anrop mot almtuna.com utan att fråga användaren.
- **Sajten säger Herrlaget, U20 och U18** (inte A-laget, J20 eller J18). Interna nycklar kan fortfarande heta `a-lag`, `j20`, `j18`.
- Svara användaren på svenska, kort och ärligt om vad som inte är verifierat (till exempel ”har inte sett sidan i webbläsare”).

## Teknik och beslut

- **Astro 5, statisk sajt** utan UI-ramverk. Node 22. Det enda som körs i webbläsaren mot en databas är bortaresor, anmälan och admin (Supabase, se nedan).
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml` (push till `main` och cron var tredje timme), Cloudflare framför som DNS. `public/CNAME` = `almtunasupporter.se`.
- Förebild för funktioner (inte kopia): vastrasidan.se (Västra Sidan, IK Sirius).
- Medlemsregister och biljettstatistik är inte byggda. Medlemskap sker via e-post.

## Struktur

- `src/data/site.ts` – namn, `short` (”ASF”), tagline, `orgNr`, `email` (**temporärt `almtunasupporter@gmail.com`**, på sikt troligen `info@almtunasupporter.se`, byts på ett ställe), `facebookGroup` (adressen till föreningens grupp; tom = länken visas inte) och `nav`. Nuvarande meny: Matcher, Bortaresor, Laget, Sånger, I media, Historia, Om oss, Kontakt. ”Bli medlem” och temaknappen ligger i `Base.astro`.
- `src/data/lagen.ts` – de tre lagen (`herr`, `dam`, `j20`) med adresser och länkar till klubbens sidor. `visning.ts` – `DIREKT` (6) = antal rutor som visas före ”Visa fler”. `arenor.ts` – körtid från Gränby ishall till bortahallarna. `supabase.ts` – publik projekt-URL och publishable key.
- `src/layouts/Base.astro` – `<head>` (canonical, Open Graph, theme-color, `noindex` via prop), header, footer (org.nr), menyskript, skript som gör **externa länkar till länkar i ny flik** (även sådana som läggs till efter laddning, via `MutationObserver`), header-CSS (`<style is:global>`).
- `src/styles/global.css` – tokens och utilitiklasser: `.wrap`, `.page`, `.prose`, `.lead`, `.button`, `.tiles`, `.notice`, `.list`, `.meta`, `.section-gap`, formulärstilar (`.field`, `input`, `select`, `textarea`), m.fl.
- `src/components/` – `LagNav`, `Mail`, `MediaItem`, `PageHead`, `Tabell`, `ThemeToggle`, `Trupp`. `src/lib/` – `supabase.ts` (klient), `trips.ts` (typer, formatering, felmeddelanden, `externalLink`, `el`-hjälpare).
- `src/pages/` – `index`, `matcher/` (herrlaget på `/matcher`, dam och U20 via `[lag]`), `laget/` (`index` + `[lag]`: tabell, trupp, målvakter), `bortaresor` + `bortaresor/anmalan`, `admin`, `i-media`, `historia`, `sanger`, `om-oss`, `stadgar`, `bli-medlem`, `kontakt`, `integritet` (utkast), `404`. `/bortaguiden` skickas vidare till `/matcher` (redirect i `astro.config.mjs`).
- `src/data/*.ts|json|ics|txt`, `scripts/*.mjs` – se `asf-data`. `supabase/migrations/` – SQL som användaren kör (se nedan).
- Nyheter och Krönikor togs bort 2026-10-26 på användarens begäran. ”I media” ersätter dem.

Ny sida: skapa fil i `src/pages/` och lägg till i `nav`.

### Bortaresor, anmälan och admin (Supabase)

- **Projekt:** `almtunasupporter` (ref `wwzyddczkgucflhzmcga`, eu-west-1). Webbkoden har bara projekt-URL och publishable key. Aldrig service_role-nyckel, databaslösenord eller hemligheter i chatt eller förråd.
- **Databas:** `trips` (titel, datum, avgångstid/-plats, `price_member`/`price_other`, `capacity`, `is_open`, `published`, `info`, `external_url`), `bookings` (`paid`), `passengers` (platser räknas per passagerare), `admins`, funktionerna `book_trip()`, `trip_spots()` (avsiktligt öppna för anon) och `private.is_admin()`. RLS är på; anon läser bara publicerade resor. Admin får bara ändra `bookings.paid`, inte kontaktuppgifter eller pris.
- **Anmälan:** formulär med flera passagerare, medlem/övrig, summa, integritetskryss, honeypot och referens efter anmälan. Det är en **reservation** utan betalning på sajten. Bekräftelsen: ”Du betalar inget nu. Information om betalning kommer efter bekräftelsen.”
- **Extern länk:** en resa med `external_url` (bara `https://`) visar ”Anmäl dig via extern länk” i stället för formuläret. **Nuläge:** anmälan sker via ett Facebook-inlägg och betalning vid bussen. **Framtid:** anmälan på sajten och betalning online.
- **Admin (`/admin`):** inloggning med e-postlänk (`shouldCreateUser: false`, användaren måste finnas i Supabase Auth och i `admins`). Skapa/redigera/ta bort resor, se anmälda, kryssa ”Betald”, exportera CSV, ta bort anmälan. Resor väljs ur en lista med kommande bortamatcher ur schemat, som fyller titel, datum och en föreslagen avgångstid (`arenor.ts`: bilrestid från Gränby ishall × 1,15, rast från 3 h, på plats 30 min före nedsläpp; Visby saknas för färja). Avgångsplatsen är förifylld ”Gränby ishall”. Informationsmallen (`infoDraft`, `infoDraftExternal` överst i `admin.astro`) läggs in när man väljer match; en publicerad resa med `[hakparentes]` kvar i texten sparas inte.
- **Migrationer:** skriv SQL i `supabase/migrations/` och be **användaren köra den i Supabase SQL Editor**. Auto-läget nekar att jag kör `apply_migration` (”Production Deploy”) och att jag skriver mina egna behörighetsregler. Jag kan verifiera efteråt med `execute_sql` (läsfrågor; `project_id` krävs).
- Texten i en resas information visas som ren text (inga länkar), så att databastext aldrig kan släppa in HTML.

### Sånger (`src/pages/sanger.astro`)

- Sångerna ligger som listan `sanger` överst i filen: `title`, `text` (rader), valfria `melodi` och `lank`. Texterna kommer ursprungligen från redlions.se (via archive.org).
- **Inga ljudfiler lagras** (upphovsrätt). Har en sång `melodi` länkas en YouTube-sökning på den; sätts `lank` används den exakta länken i stället (”Lyssna”).
- Lägg till `melodi` när föreningen uppger en känd förlaga. Sånger utan känd melodi får ingen länk, om inte en egen inspelning länkas via `lank`.
- Radbrytningar bevaras via `white-space: pre-line`; texten ska inte ändras utan att föreningen sagt det.

### Header (har ändrats flera gånger)

- Från 48rem: två rader. Överst varumärke (vänster), temaknapp och ”Bli medlem”; under alla länkar på en rad som radbryts vid behov. Ingen hamburgare.
- Under 48rem: varumärke, temaknapp, ”Bli medlem” och menyknapp på en rad. Länkarna öppnas som en panel som läggs **över** innehållet (skjuter inte ned sidan). Under 30rem är menyknappen bara ikon; under 21rem kortas namnet till ”ASF”. ”Bli medlem” och menyknappen är lika höga (2,75rem).
- `js`-klassen sätts i `<head>`. Utan JavaScript ligger länkarna öppna. Esc stänger panelen och fokus flyttas.
- Hoppa-över-länk till `#innehall`, synligt fokus (3px röd kontur, vit på hero), `scroll-padding-top` för sticky header.

## Design (kort; se DESIGN.md)

- Creative North Star: ”Läktarbanderollen”. Platt, en accentfärg, systemtypsnitt, inga skuggor, inga webbfonter.
- **Två röda:** `--red` (text/länkar) och `--red-fill` (bakgrund under vit text), olika i mörkt läge. Aldrig `--red` som bakgrund under vit text. Röd är en **placeholder**; färgprofil/logotyp är inte beslutade.
- Typsteg: hero 800 `clamp(2.75rem, 11vw, 6rem)`, h2 1.75rem, h3 1.35rem, brödtext 1.0625rem, ingress 1.25rem. Detektorn flaggar värden utanför DESIGN.md.
- Hero-rubrik: ”Vi står upp för Almtuna.”, ingress ”Almtuna Supporterförening är fristående från Almtuna IS.” (inget om hur föreningen styrs: ej bekräftat).
- Bredd `--max: 80rem`, sidomarginal `clamp(1rem, 3vw, 2rem)`, brödtext `.prose` 42rem.
- Använd `padding-block` på `.page`/`.hero`, **inte** `padding: X 0` (skriver över `.wrap`-marginalen).
- Undvik tjock färgad sidokant på kort/notiser (hooken flaggar det); `.notice` har jämn tunn ram. Kort som länkar: text i bläck, bara rubriken röd.
- **Externa länkar öppnas i ny flik** med dold text ”(öppnas i ny flik)”; skriptet i `Base.astro` sköter det även för länkar som skapas i efterhand. Pilen efter länktexten sätts för hand i listorna på I media.

## Läget (2026-10-28)

- **Sajten är uppe på almtunasupporter.se** (Cloudflare framför GitHub Pages). Förrådet är `almsupfor/asfweb`, `main`. Kolla `git status` och `git log` innan du antar något.
- Sajten har setts i webbläsare, bland annat som emulerad telefon (375 px) via Chrome DevTools-protokollet: inga sidledsscrollar, tabellerna scrollar i `.table-scroll`. Inte sedd på en riktig telefon. Några länkar är under 24 px höjd (till exempel melodilänkarna på Sånger).
- `.impeccable/design.json` ligger efter DESIGN.md (spelartabell, rutor, sidmeny m.fl.): kör `/impeccable document`. Senaste kritiken (I media) var 27/36 och sidorna har ändrats mycket sedan dess.
- Bortaresor och anmälan: se avsnittet ovan. `/integritet` är ett utkast som styrelsen ska granska (lagringstid m.m.).

## Öppna punkter / idéer

- Bekräfta/ändra kontaktmejl, Swish-nummer, logotyp, färgprofil. Innehåll saknas: bortaguide per hall (hallnamnen finns i schemat), historia, exakta `lank`-videor till sångerna.
- Fråga klubben om det är okej att läsa almtuna.com:s statistik-API (tabeller, trupper, målvakter).
- Matchdata: schemat är en nedladdad kopia; ICS-filens ägare (en bekant, malmstrom.xyz) uppdaterar kanske inte mer i år. TheSportsDB:s villkor för publik användning är obekräftade.
- Inside Almtuna (insidealmtuna.se) har inget nyhetsflöde (utkast till förfrågan skrevs, ej skickat).
- Idéer: ”Lägg till i kalender” (bygg `.ics` från `matches.json`), matchdag-läge på startsidan, bortaguide per hall, varning om schemat är gammalt, `og:image`, sitemap/robots, markera i admins matchlista vilka matcher som redan har en resa, fler mediekällor/YouTube-kanal (`@almtuna_official`, kanal-ID `UCt2rm4AZ9HH0E7mz-EFiC8A`; kräver Atom-stöd i `fetch-media.mjs`).

## Kommandon

```
npm install
npm run dev        # http://localhost:4321
npm run build      # måste gå igenom före commit
npm run media      # hämta artiklar och poddavsnitt
npm run matches    # bygg om matches.json (schema + resultat)
npm run squads     # trupper och målvakter
npm run tables     # serietabeller
npm run schedule   # ladda ner ny ICS (för hand)
```

## Arbetssätt och fallgropar

- **Efter varje redigering av `Base.astro` eller andra stora filer: kontrollera den byggda HTML:en** (`dist/index.html`: header, footer, `<main>`). Ett fel byte raderade en gång hela sidhuvudet och sidfoten utan att bygget klagade.
- **Skriv filer med regex/backslash via Write/Edit, inte via shell-heredoc.** Heredocs har tappat backslashar (`\s`, `\n`, `\\`) och gett trasiga reguljära uttryck. Vid Python-ersättningar: använd långa, unika söksträngar och `assert` att de finns; `index()` på kort text träffar fel förekomst.
- **Stilar i sidors egna `<style>`-block (scoped) tappas i `npm run dev`.** Lägg stilar i `src/styles/global.css`.
- **Skärmdumpar och mobiltest:** Chrome headless (`--headless=new --screenshot=...`) går inte under ca 500 px. För telefonbredd, starta Chrome med `--remote-debugging-port` och använd `Emulation.setDeviceMetricsOverride` via DevTools-protokollet (Node 22 har inbyggd `WebSocket`). Servera den byggda sajten (`dist`) med `python3 -m http.server`.
- Python på Windows saknar tidszoner (`zoneinfo` kräver `tzdata`); räkna tid i Node (`Intl`).
- Konsolen visar svenska tecken som `�`; datafilerna är giltig UTF-8.
- Kör `~/.claude/skills/impeccable/scripts/impeccable detect --json src` efter UI-ändringar (ska ge `[]`). `/impeccable critique|audit|polish` är bra avstämningar; kritik lagras i `.impeccable/critique/`.
- **Commit-meddelanden och kodkommentarer på engelska**, med attributionsraderna. Sajtens texter och svar till användaren på svenska. Pusha bara när användaren ber om det.
