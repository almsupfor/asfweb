---
name: asf-web
description: Projektkunskap för almtunasupporter.se (Almtuna Supporterförening). Använd när du ändrar sidor, meny, innehåll, layout/CSS eller publicering (GitHub Pages + Cloudflare) i detta repo.
---

# Almtuna Supporterförening – webbplats

Sida för supporterföreningen till ishockeylaget Almtuna IS (Uppsala). Domän: **almtunasupporter.se** (ägs av föreningen). Föreningen är fristående från Almtuna IS. Språk på sidan: svenska (`lang="sv"`).

## Teknik och beslut

- **Astro 5, helt statisk** (inget backend, inga ramverk för UI). Valt framför ren HTML så att header/footer finns på ett ställe och nyheter/krönikor kan vara markdown.
- **Hosting:** GitHub Pages via `.github/workflows/deploy.yml` (push till `main`). Cloudflare ligger framför som DNS (och senare ev. proxy/CDN). `public/CNAME` innehåller domänen.
- **Fas 1 (nu):** bara statiskt. Medlemskap och bortaresor-anmälan sker via e-post/Swish tills vidare.
- **Fas 2 (senare, ej påbörjad):** dynamiska funktioner (medlemsregister, anmälan till bortaresor med platsräknare, biljettstatistik) via Supabase som backend med sidan som statisk frontend. Bygg så att det kan läggas till utan omskrivning.
- Förebild: vastrasidan.se (Västra Sidan, IK Sirius). Deras sidor/funktioner är inspiration, inte kopia.

## Struktur

- `src/data/site.ts` – sajtnamn, tagline, e-post (`info@almtunasupporter.se` är **en gissning**, bekräfta) och `nav`-listan. Menyn byggs från `nav`; "Bli medlem"-knappen ligger hårdkodad i `src/layouts/Base.astro`.
- `src/layouts/Base.astro` – header, footer, `<head>`, header-CSS (global style-block).
- `src/styles/global.css` – design tokens (`--red`, `--max` osv.), utility-klasser: `.wrap`, `.page`, `.prose`, `.lead`, `.button`, `.cards`, `.card`, `.notice`, `.list`, `.meta`, `.hero`.
- `src/content/nyheter/` och `src/content/kronikor/` – markdown, schema i `src/content.config.ts` (`title`, `date`, `summary`, valfri `author`). Routes: `pages/nyheter/[...slug].astro`, `pages/kronikor/[...slug].astro`.
- `src/pages/` – start, nyheter, bortaresor (lista `resor` överst i filen), bortaguiden, kronikor, historia, sanger, om-oss, bli-medlem, kontakt, 404.

Ny sida: skapa fil i `src/pages/` + lägg till i `nav`.

## Designlärdomar (gjorda misstag)

- Använd `padding-block` på `.page`/`.hero`, **inte** `padding: X 0` – det skriver över sidomarginalen från `.wrap` (som kombineras på samma element) och ger vänsterkantad mobilvy.
- Bredd: `--max: 80rem`, sidomarginal `clamp(1rem, 3vw, 2rem)`. Brödtext begränsas med `.prose` (42rem) – avsiktligt.
- Header: hamburgarmeny under 64rem (annars bryts menyn till två rader och knappen kolliderar med kantlinjen). Desktop: logga + länkar vänster, "Bli medlem" högerjusterad (`margin-left: auto`).
- Undvik tjock färgad sidokant på kort/notiser (impeccable-hook flaggar det). `.notice` använder jämn tunn ram.
- Färger: rött (`#c8102e`) som placeholder, mörkt läge följer systemet. Riktig logotyp/klubbfärger saknas.

## Öppna punkter

- Bekräfta kontaktmejl; Swish-nummer och medlemsavgift för `bli-medlem`.
- Logotyp och slutgiltig färgprofil.
- Innehåll återstår: bortaguide per hall, historia, sångtexter, styrelse/stadgar.
- Inget är committat än; kontrollera `git status` innan du antar något.

## Kommandon

```
npm install
npm run dev      # http://localhost:4321
npm run build    # måste gå igenom utan fel före commit
```

Publicering/DNS-steg (GitHub Pages + Cloudflare A-records och CNAME för www) står i `README.md`.
