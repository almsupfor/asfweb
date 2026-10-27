// Serietabeller för klubbens lag. Fylls automatiskt av scripts/fetch-tables.mjs (se deploy.yml).
import data from './tables.json';

export interface TableRow {
  rank: number;
  team: string;
  ours: boolean; // Almtuna IS
  gp: number;
  w: number;
  otw: number;
  otl: number;
  l: number;
  diff: number;
  pts: number;
}
export interface LeagueTable {
  name: string;
  rows: TableRow[];
}

const tables = data.tables as Record<string, LeagueTable | undefined>;
export const table = (team: 'herr' | 'dam' | 'j20'): LeagueTable | null => {
  const t = tables[team];
  return t && t.rows.length > 0 ? t : null;
};
export const tablesUpdated: string | null = data.updated;
