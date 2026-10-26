---
name: Almtuna Supporterförening
description: Supportrarnas egen webbplats för Almtuna IS fans: rak, högljudd och handgjord, inte klubbens officiella sida.
colors:
  lakt-red: "#c8102e"
  lakt-red-deep: "#9a0c23"
  lakt-red-night: "#f05068"
  lakt-red-fill-night: "#b80f29"
  lakt-red-fill-night-deep: "#8c0b20"
  ink: "#16161a"
  ink-night: "#f2f1ee"
  muted: "#5d5d66"
  muted-night: "#a9a9b2"
  paper: "#ffffff"
  paper-night: "#121214"
  paper-soft: "#f5f4f2"
  paper-soft-night: "#1b1b1f"
  line: "#e4e2de"
  line-night: "#2c2c32"
  hero-tint: "#ffe3e8"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  hero:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.75rem, 11vw, 6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  section:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.35rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  sm: "0.4rem"
  md: "0.6rem"
spacing:
  xs: "0.25rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.25rem"
  xl: "2.5rem"
  section: "4rem"
components:
  button-primary:
    backgroundColor: "{colors.lakt-red}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 1.2rem"
  button-primary-hover:
    backgroundColor: "{colors.lakt-red-deep}"
  button-on-hero:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.lakt-red}"
    rounded: "{rounded.sm}"
    padding: "0.65rem 1.2rem"
  card:
    backgroundColor: "{colors.paper-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "1.25rem"
  notice:
    backgroundColor: "{colors.paper-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.75rem 1rem"
---

# Design System: Almtuna Supporterförening

## Overview

**Creative North Star: "Läktarbanderollen"**

Webbplatsen ska kännas som en banderoll som hängts upp av supportrarna själva: stor röd yta, tydliga rubriker, inget som liknar klubbens officiella sida. Systemet är enkelt och robust. Det går att läsa en krönika, hitta en bortaresa eller bli medlem utan att leta.

Densiteten är luftig och läsbar. Ytorna är solida och platta. All känsla kommer från den röda färgen, fet typografi och tydliga kort, inte från effekter. Systemet använder systemtypsnitt och har ljust och mörkt läge (`color-scheme: light dark`).

Den röda färgen och hela färgprofilen är **inte beslutade** (se PRODUCT.md). Allt här beskriver koden som den är idag, och röd/vit ska behandlas som en platshållare tills föreningen bestämt sig.

**Key Characteristics:**
- Solid röd hero-yta som sidans enda stora gest.
- Platta ytor med tunna linjer, inga skuggor.
- Systemtypsnitt, fet rubrik, generös radhöjd.
- Mörkt läge följer användarens inställning.
- Kort och knappar är robusta och tydliga, inte raffinerade.

## Colors

Rött och vitt mot varma off-white ytor och nästan svart text. Ett enda accentfärg, ingen sekundär palett.

### Primary
- **Läktarröd** (#c8102e): Länkar, varumärkesnamnet, primärknappen, aktiv menypost och hero-ytan. I mörkt läge ersätts den som textfärg av **Nattröd** (#f05068), som ger 4,95:1 mot mjukt papper.
- **Djuprött** (#9a0c23): Endast hover på primärknappen.
- **Nattfyllning** (#b80f29): Bakgrund för primärknapp och hero i mörkt läge, så att vit text når 6,7:1. Hover: #8c0b20.

### Neutral
- **Bläck** (#16161a): Brödtext och rubriker. Nattläge: #f2f1ee.
- **Dämpad grå** (#5d5d66): Metadata, ingresser. Nattläge: #a9a9b2.
- **Papper** (#ffffff): Sidans bakgrund. Nattläge: #121214.
- **Mjukt papper** (#f5f4f2): Kort, notiser och sidfot. Nattläge: #1b1b1f.
- **Linje** (#e4e2de): Alla kantlinjer och avskiljare. Nattläge: #2c2c32.
- **Rosa dis** (#ffe3e8): Ingresstext på röd hero-yta.

### Named Rules
**The Placeholder Red Rule.** Färgprofilen är obestämd. Föreslå inte nya röda nyanser, nya accentfärger eller klubbfärger som beslutade. Använd befintliga tokens.

**The Two Reds Rule.** Röd som text (`--red`) och röd som fyllning under vit text (`--red-fill`) är olika tokens. I mörkt läge är textröd ljusare och fyllningsröd mörkare. Använd aldrig `--red` som bakgrund under vit text.

**The One Voice Rule.** Röd är den enda accentfärgen. Ingen sekundär accent läggs till utan att föreningen beslutat färgprofil.

## Typography

**Display Font:** Systemtypsnitt (system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Samma
**Label/Mono Font:** Ingen

**Character:** Ett enda systemtypsnitt i flera vikter. Det ger snabb laddning och en rak, oputsad ton. Personligheten kommer från fet vikt och tät radhöjd på rubriker.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3rem), 1.15): Sidrubrik (h1) och hero.
- **Hero** (800, clamp(2.75rem, 11vw, 6rem), 1.02, -0.03em): Enbart hero-rubriken på startsidan, max 14 tecken bred.
- **Headline** (700, 1.35rem, 1.15): Rubriker i listor ("I media").
- **Section** (700, 1.75rem, 1.15): Sektionsrubriker (h2).
- **Title** (700, 1.35rem, 1.15): Kortrubriker (h3).
- **Body** (400, 1.0625rem, 1.65): Löptext. Textspalten `.prose` är högst 42rem (cirka 65–75 tecken).
- **Lead** (400, 1.25rem, dämpad grå): Ingress under sidrubrik.
- **Label** (400, 0.9rem, dämpad grå): Datum och metadata. Varumärkesnamnet i menyn är 800 och 1.15rem.

### Named Rules
**The No Webfont Rule.** Inga webbtypsnitt laddas. Byt inte utan ett medvetet beslut om varumärket.

## Layout

Innehållet ligger i en centrerad behållare med max 80rem och sidmarginal clamp(1rem, 3vw, 2rem). Sidor har 2.5rem toppmarginal och 4rem botten. Löptext begränsas till 42rem. Kort ligger i ett auto-fit-rutnät med minst 16rem per kolumn och 1rem mellanrum, så de staplas av sig själva på mobil.

Sidhuvudet är sticky. Under 75rem döljs menyn bakom en menyknapp (`aria-expanded`, Esc stänger). Utan JavaScript är menyn öppen. Vertikal rytm: 1rem mellan kort, 2.5rem mellan sektioner, 4rem inuti hero.

## Elevation & Depth

Platt. Systemet har inga skuggor. Djup uttrycks med tonlager: mjukt papper på papper, avgränsat av en 1px linje. Sticky sidhuvud skiljs från innehållet av en nedre linje.

### Named Rules
**The Flat-By-Default Rule.** Lägg inte till skuggor eller blur. Skilj ytor åt med ton och linje.

## Shapes

Måttligt rundade hörn: 0.4rem på knappar och notiser, 0.6rem på kort. Allt har 1px linje i färgen Linje. Inga cirklar, piller eller klippta former.

## Components

### Buttons
- **Shape:** Måttligt rundad (0.4rem), padding 0.65rem 1.2rem, fet text (600), ingen understrykning.
- **Primary:** `--red-fill` som bakgrund, vit text.
- **Hover:** Bakgrunden går över till `--red-fill-hover`. Ingen annan rörelse.
- **På hero:** Vit bakgrund med röd text.
- **Fokus:** 3px röd kontur (vit på hero), 2px förskjutning.
- **Hero-länk:** Textlänk bredvid hero-knappen, minst 2,75rem hög.

### Cards / Containers
- **Corner Style:** 0.6rem
- **Background:** Mjukt papper
- **Shadow Strategy:** Ingen (se Elevation & Depth)
- **Border:** 1px Linje
- **Internal Padding:** 1.25rem

### Notice
Mjukt papper, 1px linje, 0.4rem hörn, padding 0.75rem 1rem. Används för obekräftade uppgifter och information.

### Navigation
Sidhuvudet har två rader från 48rem: varumärket till vänster och "Bli medlem" till höger överst, och alla länkar på en rad under (Bläck, vikt 500, utan understrykning, hover i Läktarröd, aktiv sida i Läktarröd med `aria-current`). Raden radbryts om den inte ryms.

Under 48rem ligger varumärket, "Bli medlem" och menyknappen (samma höjd, 2,75rem) på en rad, och länkarna öppnas som en panel över innehållet under sidhuvudet (1px linje nedtill, ingen skugga). Under 30rem visar menyknappen bara ikonen, och under 21rem kortas namnet till ASF. "Bli medlem" är alltid synlig. Utan JavaScript ligger länkarna öppna under raden.

### Lists
Listor ("I media") är raka rader skilda av en linje, utan kort. Rubriken är en länk utan understrykning som understryks vid hover.

### Match-kort
Samma kort som övriga, men utan länk. Matchraden är fet och 1.25rem (`.match`), datum och hemma/borta i dämpad grå. Källan anges under korten.

### Hero
Heltäckande Läktarröd yta med vit rubrik, ingress i Rosa dis och en vit knapp. 4rem vertikal padding. Används på startsidan.

## Do's and Don'ts

### Do:
- **Do** använd CSS-variablerna (`--red`, `--ink`, `--bg-soft`, `--line` m.fl.) så att mörkt läge fungerar av sig självt.
- **Do** skilj ytor åt med tonlager och 1px linje.
- **Do** märk obekräftade uppgifter (mejl, Swish, avgift) med en notis, i linje med PRODUCT.md.
- **Do** håll löptext under 42rem.

### Don't:
- **Don't** lägg till skuggor, gradienter eller blur.
- **Don't** införa en andra accentfärg eller presentera färgprofilen som beslutad.
- **Don't** få sidan att likna Almtuna IS officiella sida.
- **Don't** hitta på logotyp, bilder eller klubbemblem.
- **Don't** lägg röd text mot mörk bakgrund utan Nattröd, eller vit text på `--red` i stället för `--red-fill`.
