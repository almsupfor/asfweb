// Viktiga meddelanden som visas i en gul remsa överst på alla sidor.
// Lägg till ett meddelande här; det försvinner av sig självt efter `till` (sista dagen det visas,
// svensk tid). Sajten byggs om var tredje timme, så borttagningen sker inom några timmar.
// `från` är valfritt (första dagen). `text` är ren text; `länk` kan vara en sida på sajten eller en https-adress.
export interface Meddelande {
  text: string;
  länk?: { href: string; etikett: string };
  från?: string; // YYYY-MM-DD
  till: string; // YYYY-MM-DD
}

export const meddelanden: Meddelande[] = [
  {
    text: 'Årsmöte lördag 14 november kl. 16:00.',
    länk: { href: '/moten', etikett: '(mer info)' },
    till: '2026-11-14',
  },
  {
    text: 'Bortaresa till Södertälje fredag 13 november.',
    länk: { href: '/bortaresor', etikett: '(mer info)' },
    till: '2026-11-12',
  },
];

// Dagens datum i Sverige som YYYY-MM-DD (sv-SE ger den formen).
export function aktuellaMeddelanden(nu = new Date()): Meddelande[] {
  const idag = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm' }).format(nu);
  return meddelanden.filter((m) => idag <= m.till && (!m.från || idag >= m.från));
}
