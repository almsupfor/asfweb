# Almtuna Supporterförening – almtunasupporter.se

Statisk webbplats byggd med [Astro](https://astro.build), hostad på GitHub Pages.

## Utveckling

```
npm install
npm run dev      # http://localhost:4321
npm run build    # bygger till dist/
```

## Lägga till innehåll

- **"I media" sköter sig själv:** `scripts/fetch-media.mjs` läser mediernas RSS-flöden efter artiklar som nämner Almtuna och sparar rubrik, källa, datum och länk i `src/data/media.json`. GitHub Actions kör det var tredje timme (se `.github/workflows/deploy.yml`), sparar nya artiklar i förrådet och bygger om sidan. Kör `npm run media` för att hämta för hand. Fler källor läggs till i listan `FEEDS` i skriptet.
- **Matcher:** Spelschema och resultat kommer främst från klubbens officiella lista, inklistrad som text i `src/data/schedule-official.txt` (kopiera sidan almtuna.com/game-schedule och klistra in). Den vinner över kalenderfilen `src/data/schedule.ics`, som fyller i det som saknas (träningsmatcher). Ingen av dem synkas mot källan: klistra in en ny version och kör `npm run matches`, eller hämta en ny ICS med `npm run schedule`. Resultat hämtas även från TheSportsDB (gratisnyckeln `123`) och sparas i historiken. Allt hamnar i `src/data/matches.json`, och resultat från TheSportsDB uppdateras i det schemalagda jobbet. Tid som saknas eller är 0:00 visas som "19:00 (preliminärt)" på vardagar (kvällsmatcher börjar nästan alltid då) och annars som "tid ej fastställd".
- **Bortaresa:** lägg till i listan `resor` i `src/pages/bortaresor.astro`.
- **Ny sida:** skapa en fil i `src/pages/` och lägg till den i `nav` i `src/data/site.ts`.

## Publicering (GitHub Pages + Cloudflare)

1. Pusha till `main`. Workflowen i `.github/workflows/deploy.yml` bygger och publicerar.
2. GitHub: *Settings → Pages → Source: GitHub Actions*. Custom domain: `almtunasupporter.se` (filen `public/CNAME` sätter den också).
3. Cloudflare DNS:
   - Fyra `A`-records för `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` för `www` → `<github-användarnamn>.github.io`
   - Låt dem vara *DNS only* tills GitHub utfärdat certifikat, aktivera därefter *Enforce HTTPS* i GitHub. Proxy går att slå på efteråt med SSL-läget *Full*.
