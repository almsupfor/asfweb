// Spelare och deras statistik per lag. Fylls automatiskt av scripts/fetch-squads.mjs (se deploy.yml).
import data from './squads.json';

export interface Player {
  name: string;
  number: number | null;
  nationality: string | null;
  gp: number; // spelade matcher
  g: number; // mål
  a: number; // assist
  tp: number; // poäng
  pm: number; // plus/minus
  pim: number; // utvisningsminuter
  toi: string | null; // snittid per match, "0:00" för den som inte spelat som utespelare
}

export interface Keeper {
  name: string;
  gp: number; // matcher som målvakt
  svs: number; // räddningar
  ga: number; // insläppta mål
  svsPerc: string | null; // räddningsprocent
  gaa: string | null; // insläppta mål per match
  so: number; // hållna nollor
  mip: string | null; // speltid i minuter
}

const teams = data.teams as Record<string, Player[] | undefined>;
export const squad = (team: 'herr' | 'dam' | 'j20'): Player[] => teams[team] ?? [];
const keepers = (data as { keepers?: Record<string, Keeper[] | undefined> }).keepers ?? {};
export const goalkeepers = (team: 'herr' | 'dam' | 'j20'): Keeper[] => keepers[team] ?? [];
export const squadUpdated: string | null = data.updated;

/** Har spelat som utespelare. Målvakter och de som inte fått speltid saknar utespelarstatistik. */
export const hasPlayed = (p: Player) => (p.toi ? p.toi !== '0:00' : p.gp > 0);
