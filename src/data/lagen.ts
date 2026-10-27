// Lagen som följs på sajten: adress, namn och länkar till klubbens egna sidor.
const sasong = 'ndcf81nlb3';
const schema = (serie: string) =>
  `https://www.almtuna.com/game-schedule?seasonUuid=${sasong}&seriesUuid=${serie}&gameTypeUuid=qQ9-af37Ti40B&completeSeason=all&homeAway=all&allGames=all`;

export type LagKey = 'herr' | 'dam' | 'j20';
export interface Lag {
  key: LagKey;
  namn: string;
  href: string; // adress på den här sajten
  lag: string;
  statistik: string;
  schema: string;
}

export const lagen: Lag[] = [
  { key: 'herr', namn: 'Herrlaget', href: '/lagen', lag: 'https://www.almtuna.com/team/181c-181cv0b9i/ais1_ais/overview', statistik: 'https://www.almtuna.com/team/181c-181cv0b9i/ais1_ais/stats', schema: schema('qQ9-594cW8OWD') },
  { key: 'dam', namn: 'Damlaget', href: '/lagen/damlaget', lag: 'https://www.almtuna.com/team/181c-ebbfvOfZG/ais1_ais/overview', statistik: 'https://www.almtuna.com/team/181c-ebbfvOfZG/ais1_ais/stats', schema: schema('qYE-42dTycW3f') },
  { key: 'j20', namn: 'U20', href: '/lagen/u20', lag: 'https://www.almtuna.com/team/181c-97a6brSab/ais1_ais/overview', statistik: 'https://www.almtuna.com/team/181c-97a6brSab/ais1_ais/stats', schema: schema('qV0-8wgHrHJmG') },
];
