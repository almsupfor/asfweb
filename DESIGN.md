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
  lakt-red-dim: "#ff7488"
  muted-dim: "#b9b9c2"
  paper-dim: "#2b2b31"
  paper-soft-dim: "#35353c"
  line-dim: "#4a4a53"
typography:
  display:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  hero:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "clamp(2.25rem, 7vw, 4rem)"
    fontWeight: 800
    lineHeight: 1.05
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
  list-title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
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
- Platta ytor med tunna linjer, inga skuggor. Struktur kommer av band och paneler i Mjukt papper, inte av kort runt varje rad.
- Systemtypsnitt, fet rubrik, generös radhöjd.
- Mörkt läge följer användarens inställning, och färglägesknappen i sidhuvudet låter besökaren välja ljust, halvmörkt eller mörkt.
- Kort och knappar är robusta och tydliga, inte raffinerade.

## Colors

Rött och vitt mot varma off-white ytor och nästan svart text. Ett enda accentfärg, ingen sekundär palett.

### Primary
- **Läktarröd** (#c8102e): Länkar, varumärkesnamnet, primärknappen, aktiv menypost och hero-ytan. I mörkt läge ersätts den som textfärg av **Nattröd** (#f05068), som ger 4,95:1 mot mjukt papper.
- **Djuprött** (#9a0c23): Endast hover på primärknappen.
- **Nattfyllning** (#b80f29): Bakgrund för primärknapp och hero i mörkt och halvmörkt läge, så att vit text når 6,7:1. Hover: #8c0b20.
- **Skymningsröd** (#ff7488): Textröd i halvmörkt läge. De ljusare ytorna där kräver en ljusare röd än Nattröd för att nå 4,7:1 mot mjukt papper.

### Neutral
- **Bläck** (#16161a): Brödtext och rubriker. Nattläge: #f2f1ee.
- **Dämpad grå** (#5d5d66): Metadata, ingresser. Nattläge: #a9a9b2.
- **Papper** (#ffffff): Sidans bakgrund. Nattläge: #121214.
- **Mjukt papper** (#f5f4f2): Kort, notiser och sidfot. Nattläge: #1b1b1f.
- **Linje** (#e4e2de): Alla kantlinjer och avskiljare. Nattläge: #2c2c32.
- **Rosa dis** (#ffe3e8): Ingresstext på röd hero-yta.

### Halvmörkt läge
Mellanläge mellan ljust och mörkt, valbart med färglägesknappen. Papper #2b2b31, Mjukt papper #35353c, Linje #4a4a53, Bläck #f2f1ee, Dämpad grå #b9b9c2 och textrött Skymningsröd (#ff7488). Kontrast: Bläck mot papper 12,5:1, Dämpad grå mot mjukt papper 6,3:1, Skymningsröd mot papper 5,4:1 och mot mjukt papper 4,7:1. Det följer inte webbläsarens inställning. Det väljs bara med knappen.

### Named Rules
**The Placeholder Red Rule.** Färgprofilen är obestämd. Föreslå inte nya röda nyanser, nya accentfärger eller klubbfärger som beslutade. Använd befintliga tokens.

**The Two Reds Rule.** Röd som text (`--red`) och röd som fyllning under vit text (`--red-fill`) är olika tokens. I mörkt och halvmörkt läge är textröd ljusare och fyllningsröd mörkare. Använd aldrig `--red` som bakgrund under vit text.

**The One Voice Rule.** Röd är den enda accentfärgen. Ingen sekundär accent läggs till utan att föreningen beslutat färgprofil.

## Typography

**Display Font:** Systemtypsnitt (system-ui, -apple-system, Segoe UI, Roboto, sans-serif)
**Body Font:** Samma
**Label/Mono Font:** Ingen

**Character:** Ett enda systemtypsnitt i flera vikter. Det ger snabb laddning och en rak, oputsad ton. Personligheten kommer från fet vikt och tät radhöjd på rubriker.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 3rem), 1.15): Sidrubrik (h1) och hero.
- **Hero** (800, clamp(2.25rem, 7vw, 4rem), 1.05, -0.03em): Enbart hero-rubriken på startsidan, max 24 tecken bred så att den ryms på en rad på bred skärm.
- **Headline** (700, 1.35rem, 1.15): Rubriker i listor på startsidan.
- **List title** (600, 1.125rem, 1.35): Rubriken i raderna på I media. Det är en länk, inte en rubrik (h3), så att rubriknavigering bara listar sektioner. Sista ordet och pilen hålls ihop.
- **Section** (700, 1.75rem, 1.15): Sektionsrubriker (h2).
- **Title** (700, 1.35rem, 1.15): Kortrubriker (h3).
- **Body** (400, 1.0625rem, 1.65): Löptext. Textspalten `.prose` är högst 42rem (cirka 65–75 tecken).
- **Lead** (400, 1.25rem, dämpad grå): Ingress under sidrubrik.
- **Label** (400, 0.9rem, dämpad grå): Datum och metadata. Varumärkesnamnet i menyn är 800 och 1.15rem.

### Named Rules
**The No Webfont Rule.** Inga webbtypsnitt laddas. Byt inte utan ett medvetet beslut om varumärket.

## Layout

Innehållet ligger i en centrerad behållare med max 80rem och sidmarginal clamp(1rem, 3vw, 2rem). Sidor har 2.5rem toppmarginal och 4rem botten. Löptext begränsas till 42rem. Kort ligger i ett auto-fit-rutnät med minst 16rem per kolumn och 1rem mellanrum, så de staplas av sig själva på mobil.

Sidan fyller alltid fönstrets höjd: sidfoten ligger längst ned även när innehållet är kortare än skärmen. Sidhuvudet är sticky. Under 75rem döljs menyn bakom en menyknapp (`aria-expanded`, Esc stänger). Utan JavaScript är menyn öppen. Vertikal rytm: 1rem mellan kort, 2.5rem mellan sektioner, 4rem inuti hero.

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
Sidhuvudet har två rader från 48rem: varumärket till vänster och färglägesknappen och "Bli medlem" till höger överst, och alla länkar på en rad under (Bläck, vikt 500, utan understrykning, hover i Läktarröd, aktiv sida i Läktarröd med `aria-current`). Raden radbryts om den inte ryms.

Färglägesknappen går igenom tre lägen: ljust, halvmörkt och mörkt, och tillbaka. Den är en ren ikon (2,75rem × 2,75rem, 1px linje, 0.4rem hörn) som visar läget som gäller nu: en ritad sol i ljust läge, en halvfylld cirkel i halvmörkt och en måne i mörkt. Namnet finns som dold text för skärmläsare och beskriver vad ett klick gör ("Halvmörkt läge", "Mörkt läge", "Ljust läge"). Vilken ikon som syns styrs i CSS av `data-theme` på html eller webbläsarens inställning, så den är rätt redan vid första målningen. Utan eget val följer sidan webbläsaren. Valet sparas i webbläsaren (`localStorage`, nyckel `tema`) och sätts före första målningen. Knappen ligger i sidhuvudets övre rad på alla bredder (före "Bli medlem" från 48rem, före menyknappen under). Den syns bara med JavaScript.

Under 48rem ligger varumärket, färglägesknappen och menyknappen på en rad, med menyknappen längst till höger. Båda knapparna är rena ikoner (2,75rem × 2,75rem). Menyknappens namn "Meny" finns kvar som dold text. Länkarna öppnas som en panel över innehållet under sidhuvudet (1px linje nedtill, ingen skugga), och "Bli medlem" ligger sist i panelen som röd knapp. Under 21rem kortas namnet till ASF. Utan JavaScript ligger länkarna och "Bli medlem" öppna under raden.

### Page head
Sidans rubrik och ingress ligger i ett band över hela bredden: Mjukt papper med en 1px Linje under, 2,5rem luft över och 1,75rem under. Hopplänkar och uppdateringstid ligger i bandet, med Papper som bakgrund på chipsen så att de syns mot bandet. Bandet används på alla innehållssidor utom startsidan (som har hero-ytan) och 404.

### Lists
Listor ("I media", "Matcher") ligger i en enda panel per lista: Mjukt papper, 1px Linje, 0.6rem hörn och 1.25rem sidoluft, med raderna skilda av en linje. Panelen ersätter kort runt varje rad. Titeln är en länk (List title) som är blockbred, så hela raden är en bra träffyta. Under den ligger källa och datum i dämpad grå, med datumet i `<time>`. Länken är Bläck med en tunn understrykning i dämpad grå, så att den syns som länk utan att röd text fyller sidan. Vid hover och tangentbordsfokus blir både text och understrykning röda. Besökt länk blir Dämpad grå. Röd text är avsiktligt sparsam i listor, eftersom rött mot vitt och framför allt mot mörkt blir tröttsamt i mängd.

Externa länkar öppnas i ny flik. Det syns som en liten ritad pil efter sista ordet och sägs som dold text "(öppnas i ny flik)". Ett skript i sidhuvudet lägger samma dolda text på andra externa länkar som saknar den.

Varje sektion på I media börjar med en kort röd stapel (3rem × 0.3rem, Läktarröd) över rubriken, sedan raderna. Senaste veckan visas direkt, minst fem rader, och resten ligger bakom en inbyggd "Äldre artiklar (n)". På Matcher visas de fem närmaste matcherna och de fem senaste resultaten direkt, och resten ligger bakom "Fler matcher (n)" och "Fler resultat (n)" i samma utseende (`<details>`, rubriken i Bläck med en ritad pil som vänds när raden är öppen, röd vid hover, minst 2,75rem hög). När listan kapats står det hur många som visas.

### Pil till toppen
En fast knapp nere till höger (3rem × 3rem, Nattfyllning/Läktarröd som fyllning med vit pil, 0.4rem hörn, ingen skugga). Den länkar till `#innehall`, så fokus följer med till innehållet. Med JavaScript visas den så fort man scrollat en liten bit (40px). Utan JavaScript syns den hela tiden. Den ligger under sidhuvudet i höjdled och respekterar säkra områden på telefoner.

### Hoppmeny
Rad med chips ovanför en lång lista, ett per sektion med innehåll, med antalet i dämpad grå ("Herrlaget 26"). Mjukt papper, 1px linje, 0.4rem hörn, minst 2,75rem höga. Hover ger röd linje och röd text. Chipsen ordnas med A-laget först och resten efter antal. Antalet visar det kapade talet och "26 av 41" när listan är kapad. Visas bara när det finns fler än en sektion. Samma chips används som lagval på Lagen (Herrlaget, Damlaget, U20), där det valda laget har Bläck som bakgrund och Papper som text och markeras med `aria-current`.

### Match-kort
Samma kort som övriga, men utan länk. På startsidan är kortets rubrik ("Nästa match", "Senaste resultat") tydligt störst: 1.5rem, vikt 800. Matchraden under är vanlig brödtext i vikt 600 och 1.0625rem, och datum och hemma/borta ligger i dämpad grå. Så läses rubriken som rubrik och matchen som innehåll. Källan anges under korten.

### Hero
Heltäckande Läktarröd yta med vit rubrik, ingress i Rosa dis och en vit knapp. Låg och bred: 2 till 3,5rem vertikal padding. Används på startsidan.

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
- **Don't** lägg röd text mot mörk bakgrund utan Nattröd (Skymningsröd i halvmörkt läge), eller vit text på `--red` i stället för `--red-fill`.
