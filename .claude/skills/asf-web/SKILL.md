---
name: asf-web
description: Projektkunskap för almtunasupporter.se (Almtuna Supporterförening). Använd när du ändrar sidor, meny, innehåll, layout/CSS, design eller publicering (GitHub Pages + Cloudflare) i detta repo, eller när du återupptar arbetet och behöver veta läget och vad som återstår.
---

# Almtuna Supporterförening – webbplats

Sida för supporterföreningen till ishockeylaget Almtuna IS (Uppsala), som spelar i HockeyAllsvenskan. Domän: **almtunasupporter.se** (ägs av föreningen, ligger hos Loopia). Föreningen är **fristående** från Almtuna IS och sidan ska inte se ut som klubbens officiella. Språk: svenska (`lang="sv"`).

Datapipelines (artiklar, schema, resultat) beskrivs i skillen `asf-data`. Produkt och design finns i `PRODUCT.md` och `DESIGN.md` (läs dem först; `.impeccable/design.json` är sidecar till DESIGN.md).

## Principer (bindande)

- **Sidan ska inte kräva manuellt underhåll.** Sånt som kan hållas aktuellt automatiskt ska göras så, så att folk har skäl att komma tillbaka.
- **Inget påhittat.** Saknade fakta lämnas öppna eller märks som obekräftade/preliminära. Hitta inte på avgifter, Swish-nummer, bilder, logotyp eller klubbemblem.
- **Bara länka, kopiera aldrig artikeltext.** Rubrik, källa, datum, länk.
- **Läs inte privata gränssnitt.** Skrapa eller anropa inte interna API:er (till exempel almtuna.com:s eller hockeyallsvenskan.se:s). Använd öppna RSS/iCal eller klistra in text som användaren ger.
- Svara användaren på svenska, kort och ärligt om vad som inte är verifierat (till exempel ”har inte sett sidan i webbläsare”).

## Teknik och beslut

- **Astro 5, helt statisk**, inget UI-ramverk, inget backend. Node 22.
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml`. Cloudflare ska ligga framför som DNS (steg i *Läget* nedan). `public/CNAME` = `almtunasupporter.se`.
- **Fas 1 (nu):** statiskt. Medlemskap och bortaresor-anmälan sker via e-post/Swish tills vidare.
- **Fas 2 (ej påbörjad):** medlemsregister, anmälan till bortaresor med platsräknare, biljettstatistik via Supabase med sidan som statisk frontend. Artiklar och matcher kan fortsätta vara filer; bara det besökare själva ändrar kräver databas.
- Förebild för funktioner (inte kopia): vastrasidan.se (Västra Sidan, IK Sirius).

## Struktur

- `src/data/site.ts` – namn, `short` (”ASF”), tagline, e-post (**temporärt `almtunasupporter@gmail.com`**, på sikt troligen `info@almtunasupporter.se`, byts på ett ställe) och `nav`. Nuvarande meny: Matcher, Bortaresor, Bortaguiden, Historia, Sånger, I media, Om oss, Kontakt. ”Bli medlem” ligger hårdkodad i `Base.astro`.
- `src/layouts/Base.astro` – `<head>` (canonical, Open Graph, theme-color, `noindex` via prop för 404), header, footer, menyskript, header-CSS (`<style is:global>`).
- `src/styles/global.css` – tokens och utilitiklasser: `.wrap`, `.page`, `.prose`, `.lead`, `.button`, `.cards`, `.card`, `.notice`, `.list`, `.meta`, `.match`, `.section-gap`, `.hero`, `.hero-actions`, `.hero-link`.
- `src/pages/` – `index` (hero, Matcher, Senast i media, Podd, Utforska), `matcher`, `bortaresor`, `i-media`, `bortaguiden`, `historia`, `sanger`, `om-oss`, `bli-medlem`, `kontakt`, `404`.
- `src/data/*.ts|json|ics|txt`, `scripts/*.mjs` – se `asf-data`.
- Nyheter och Krönikor togs bort 2026-10-26 på användarens begäran (sidor, `src/content/`, `content.config.ts`). ”I media” ersätter dem.

Ny sida: skapa fil i `src/pages/` och lägg till i `nav`.

### Sånger (`src/pages/sanger.astro`)

- Sångerna ligger som listan `sanger` överst i filen: `title`, `text` (rader), valfria `melodi` och `lank`. Texterna kommer ursprungligen från redlions.se (via archive.org).
- **Inga ljudfiler lagras** (upphovsrätt). Har en sång `melodi` länkas en YouTube-sökning på den; sätts `lank` används den exakta länken i stället (”Lyssna”).
- Lägg till `melodi` när föreningen uppger en känd förlaga. Sånger utan känd melodi får ingen länk, om inte en egen inspelning länkas via `lank`.
- Radbrytningar bevaras via `white-space: pre-line`; texten ska inte ändras utan att föreningen sagt det.

### Header (har ändrats flera gånger)

- Från 48rem: två rader. Överst varumärke (vänster) och ”Bli medlem”; under alla länkar på en rad som radbryts vid behov. Ingen hamburgare.
- Under 48rem: varumärke, ”Bli medlem” och menyknapp på en rad. Länkarna öppnas som en panel som läggs **över** innehållet (skjuter inte ned sidan). Under 30rem är menyknappen bara ikon; under 21rem kortas namnet till ”ASF”. ”Bli medlem” och menyknappen är lika höga (2,75rem).
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

## Läget (2026-10-27)

- Allt är committat och pushat (`almsupfor/asfweb`, `main`, första commit `9f2c316`). Kolla `git status` innan du antar något (denna skill och `asf-data` lades till efteråt).
- **GitHub Pages är inte påslaget** och förrådet är **privat**: på gratisplanen kräver Pages ett publikt förråd. Workflowen (inkl. schemat var tredje timme) körs men deploy misslyckas tills Pages är på med **Settings → Pages → Source: GitHub Actions**.
- **Domän/Cloudflare, ej gjort:** Namnservrarna är hos Loopia (`ns1/ns2.loopia.se`), A-posterna pekar på Loopia (194.9.94.85/86), ingen `www`, ingen MX. Plan: lägg domänen i Cloudflare, ta bort Loopia-A-posterna, lägg A `@` → 185.199.108.153/.109.153/.110.153/.111.153 och CNAME `www` → `almsupfor.github.io`, **DNS only (grått moln)** tills GitHub utfärdat HTTPS; byt namnservrar hos Loopia; ange `almtunasupporter.se` som Custom domain i Pages och kryssa Enforce HTTPS; sedan valfritt orange moln med SSL ”Full (strict)”. Kontrollera IP-adresserna mot GitHubs dokumentation. Idé: Cloudflare Email Routing för `info@almtunasupporter.se` → Gmail.
- På `github.io/asfweb/` blir sajten trasig (byggd för domänrot, ingen `base`). Väntat tills domänen är kopplad.
- **Sajten har aldrig setts i en webbläsare.** Allt är verifierat via build, HTML-utdata och detektor. Första uppgift när dev/Pages körs: titta på 360, 600, 1000, 1300 px i ljust och mörkt läge (särskilt headern och hero-rubrikens radbrytning).
- Kvalitetsstatus: kritik 18/28 (före ändringar), audit 20/20 (kodnivå, ej renderad).

## Öppna punkter / idéer

- Bekräfta/ändra kontaktmejl, Swish-nummer, medlemsavgift, logotyp, färgprofil, styrelse/stadgar. Innehåll saknas: bortaguide per hall (hallnamnen finns i schemat), historia, exakta `lank`-videor till sångerna.
- Matchdata: schemat är en nedladdad kopia; ICS-filens ägare (en bekant, malmstrom.xyz) uppdaterar kanske inte mer i år. TheSportsDB:s villkor för publik användning är obekräftade. Tabell och full resultatdata kräver deras betalnivå ($9/mån enligt deras prissida) eller annan källa.
- Inside Almtuna (insidealmtuna.se) har inget nyhetsflöde (utkast till förfrågan skrevs, ej skickat). Klubben kan tillfrågas om kalender/flöde.
- Idéer: ”Lägg till i kalender” (bygg `.ics` från `matches.json`), matchdag-läge på startsidan, bortaguide per hall, varning om schemat är gammalt, `og:image`, sitemap/robots, fler mediekällor/YouTube-kanal (`@almtuna_official`, kanal-ID `UCt2rm4AZ9HH0E7mz-EFiC8A`; kräver Atom-stöd i `fetch-media.mjs`, flödet gav 404/500 vid test).

## Kommandon

```
npm install
npm run dev        # http://localhost:4321
npm run build      # måste gå igenom före commit
npm run media      # hämta artiklar och poddavsnitt
npm run matches    # bygg om matches.json (schema + resultat)
npm run schedule   # ladda ner ny ICS (för hand)
```

## Arbetssätt och fallgropar

- **Efter varje redigering av `Base.astro` eller andra stora filer: kontrollera den byggda HTML:en** (`dist/index.html`: header, footer, `<main>`). Ett fel byte raderade en gång hela sidhuvudet och sidfoten utan att bygget klagade.
- **Skriv filer med regex/backslash via Write/Edit, inte via shell-heredoc.** Heredocs har tappat backslashar (`\s`, `\n`, `\\`) och gett trasiga reguljära uttryck. Vid Python-ersättningar: använd långa, unika söksträngar och `assert` att de finns; `index()` på kort text träffar fel förekomst.
- Python på Windows saknar tidszoner (`zoneinfo` kräver `tzdata`); räkna tid i Node (`Intl`).
- Konsolen visar svenska tecken som `�`; datafilerna är giltig UTF-8.
- Kör `~/.claude/skills/impeccable/scripts/impeccable detect --json src` efter UI-ändringar (ska ge `[]`). `/impeccable critique|audit|polish` är bra avstämningar; kritik lagras i `.impeccable/critique/`.
- Pusha bara när användaren ber om det. Commit-meddelanden på svenska med attributionsraderna.
