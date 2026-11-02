// Fria meddelanden som visas i en gul remsa överst på alla sidor.
// Möten och nästa bortaresa lägger sig i remsan av sig själva utifrån vad som läggs in på /admin
// (möte 14 dagar före, bortaresa 7 dagar före), så de ska inte skrivas in här.
// Lägg till ett meddelande här för annat; det försvinner av sig självt efter `till` (sista dagen det visas,
// svensk tid). Sajten byggs om var tredje timme, så borttagningen sker inom några timmar.
// `från` är valfritt (första dagen). `text` är ren text; `länk` kan vara en sida på sajten eller en https-adress.
export interface Meddelande {
  text: string;
  länk?: { href: string; etikett: string };
  från?: string; // YYYY-MM-DD
  till: string; // YYYY-MM-DD
}

export const meddelanden: Meddelande[] = [];

// Dagens datum i Sverige som YYYY-MM-DD (sv-SE ger den formen).
export function aktuellaMeddelanden(nu = new Date()): Meddelande[] {
  const idag = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm' }).format(nu);
  return meddelanden.filter((m) => idag <= m.till && (!m.från || idag >= m.från));
}
