// Lagen som följs på sajten: adress, namn och länkar till klubbens egna sidor.
const sasong = 'ndcf81nlb3';
const schema = (serie: string) =>
  `https://www.almtuna.com/game-schedule?seasonUuid=${sasong}&seriesUuid=${serie}&gameTypeUuid=qQ9-af37Ti40B&completeSeason=all&homeAway=all&allGames=all`;

export type LagKey = 'herr' | 'dam' | 'j20';
export interface Lag {
  key: LagKey;
  namn: string;
  knapp: string; // kortare namn för lagvalet
  fullt?: string; // officiellt namn, om det avviker från namn
  href: string; // adress på Laget-sidan
  matcher: string; // adress på Matcher-sidan
  lag: string;
  statistik: string;
  schema: string;
}

export const lagen: Lag[] = [
  { key: 'herr', namn: 'Herrlaget', knapp: 'Herrlaget', href: '/laget', matcher: '/matcher', lag: 'https://www.almtuna.com/team/181c-181cv0b9i/ais1_ais/overview', statistik: 'https://www.almtuna.com/team/181c-181cv0b9i/ais1_ais/stats', schema: schema('qQ9-594cW8OWD') },
  { key: 'dam', namn: 'Damlaget', knapp: 'Damlaget', fullt: 'Almtuna IS Dam', href: '/laget/damlaget', matcher: '/matcher/damlaget', lag: 'https://www.almtuna.com/team/181c-ebbfvOfZG/ais1_ais/overview', statistik: 'https://www.almtuna.com/team/181c-ebbfvOfZG/ais1_ais/stats', schema: schema('qYE-42dTycW3f') },
  { key: 'j20', namn: 'U20', knapp: 'U20', href: '/laget/u20', matcher: '/matcher/u20', lag: 'https://www.almtuna.com/team/181c-97a6brSab/ais1_ais/overview', statistik: 'https://www.almtuna.com/team/181c-97a6brSab/ais1_ais/stats', schema: schema('qV0-8wgHrHJmG') },
];

// Namnet med "Almtuna IS" först, utan att upprepa det för lag som redan heter så.
export const fulltNamn = (l: Lag) => l.fullt ?? (l.namn.startsWith('Almtuna IS') ? l.namn : `Almtuna IS ${l.namn}`);
