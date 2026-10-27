// Trupper för klubbens lag. Fylls automatiskt av scripts/fetch-squads.mjs (se deploy.yml).
import data from './squads.json';

export interface Player {
  name: string;
  number: number | null;
  nationality: string | null;
}
export interface PositionGroup {
  position: string;
  players: Player[];
}

const teams = data.teams as Record<string, PositionGroup[] | undefined>;
export const squad = (team: 'herr' | 'dam' | 'j20'): PositionGroup[] => teams[team] ?? [];
export const squadUpdated: string | null = data.updated;

const SV: Record<string, string> = { Goalies: 'Målvakter', Goalkeepers: 'Målvakter', Defense: 'Backar', Defensemen: 'Backar', Defenders: 'Backar', Forwards: 'Forwards' };
export const positionLabel = (p: string) => SV[p] ?? p;
