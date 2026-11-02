// Nästa möte som visas på /moten. Byt ut posten när ett nytt möte utlysts.
// Fält som inte är bekräftade lämnas tomma: sidan skriver då "Meddelas senare". Hitta inte på uppgifter.
// Efter mötets datum visar sidan "Inget möte är utlyst just nu" av sig själv (sajten byggs om var tredje timme).
export interface Möte {
  typ: 'Årsmöte' | 'Extra föreningsmöte' | 'Medlemsmöte';
  datum: string; // YYYY-MM-DD
  tid: string; // HH:MM
  plats?: string;
  kallelse?: string; // länk till kallelsen, till exempel inlägget i Facebook-gruppen
  anmärkning?: string;
}

export const nästaMöte: Möte | null = {
  typ: 'Årsmöte',
  datum: '2026-11-14',
  tid: '16:00',
  plats: 'Gränby ishall',
  kallelse: 'https://www.facebook.com/groups/121469757864190/posts/29656465340604574',
};
