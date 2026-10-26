# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Befintliga medlemmar och nya fans av ishockeylaget Almtuna IS (Uppsala), lika viktiga. Medlemmar vill läsa vad som skrivs om laget, hitta bortaresor och bortaguider och få sångtexter. Nya fans och nyfikna vill förstå vad föreningen är, och bli medlemmar. Språk: svenska.

## Product Purpose

Webbplats för Almtuna Supporterförening (almtunasupporter.se). Den samlar länkar till artiklar om Almtuna från andra medier, bortaresor, bortaguide, historia, sånger, information om föreningen, medlemskap och kontakt. Framgång: fler medlemmar, fler som följer med på bortaresor och en plats som supportrarna själva vill återvända till.

## Positioning

Fristående fansröst. Föreningen är oberoende från Almtuna IS och sidan är supportrarnas egen, inte klubbens officiella.

## Operating Context

Medlemskap och anmälan till bortaresor sker i dag via e-post/Swish. Förebild för funktioner (inte kopia): vastrasidan.se (Västra Sidan, IK Sirius).

## Capabilities and Constraints

- Astro 5, helt statisk, inget backend. Hosting: GitHub Pages, Cloudflare för DNS.
- Fas 2 (ej påbörjad): medlemsregister, anmälan till bortaresor med platsräknare och biljettstatistik via Supabase. Sidan ska kunna få detta utan omskrivning.
- Egna nyheter och krönikor är borttagna ur sajten (beslut 2026-10-26). "I media" listar länkar till artiklar från andra medier och läses från `src/data/media.ts`. Listan fylls automatiskt av `scripts/fetch-media.mjs` (GitHub Actions var tredje timme) från mediernas egna RSS-flöden. Den länkar bara med rubrik, källa och datum och kopierar aldrig artikeltext.
- Spelschema och resultat: klubbens officiella lista (inklistrad text i `src/data/schedule-official.txt`, hämtad 2026-10-27) är huvudkälla. En egengjord iCal-fil på malmstrom.xyz (`src/data/schedule.ics`) fyller i träningsmatcher och stämde med klubbens lista på 51 av 52 serie­matcher. Inget synkas mot källan; nya versioner hämtas för hand. Klubbens egen lista har tiden 0:00 för två matcher (29 jan, 26 feb), som visas som "19:00 (preliminärt)" eftersom de är fredagar. Tabell och automatiska bortaresor (anmälan) är inte byggda. TheSportsDB:s villkor för publik användning är inte bekräftade.
- Principen: sidan ska inte kräva manuellt underhåll. Innehåll som kan hållas aktuellt automatiskt ska göras så, så att besökare har en anledning att komma tillbaka.
- Kontaktmejl: just nu den temporära adressen `almtunasupporter@gmail.com`. På sikt troligen `info@almtunasupporter.se`, men det är obekräftat. Byts på ett ställe i `src/data/site.ts`.
- Obekräftat: Swish-nummer, medlemsavgift.

## Brand Commitments

- Logotyp och färgprofil för föreningen är inte bestämda. Troligen rött och vitt, eftersom det är Almtuna IS färger, men inget är beslutat. Nuvarande röd är en platshållare.
- Sidan får inte se ut som klubbens officiella sida.

## Evidence on Hand

Ingen riktig logotyp, inga bilder, inga medlemsuppgifter. Innehåll återstår: bortaguide per hall, historia, sångtexter, styrelse/stadgar. Inga uppgifter får hittas på, och obekräftat ska märkas som obekräftat.

## Product Principles

- Supportrarnas egen röst, inte klubbens.
- Inget påhittat: saknade fakta lämnas öppna eller märks tydligt.
- Byggd för att växa: statisk idag, redo för dynamiska funktioner i fas 2.
- Fungerar för både veteraner och nya fans.
