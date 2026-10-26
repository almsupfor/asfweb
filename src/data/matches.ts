// Schema och resultat. Fylls automatiskt av scripts/fetch-matches.mjs (se deploy.yml).
// Schema: iCal-fil. Resultat: TheSportsDB. Tid som saknas eller är exakt midnatt visas som preliminärt 19:00 på vardagar och annars som "ej fastställd".
import data from './matches.json';

export interface Match {
  date: string; // ÅÅÅÅ-MM-DD, svensk tid
  start: string | null; // ISO i UTC, null om tiden inte är fastställd
  timeKnown: boolean;
  home: string;
  away: string;
  isHome: boolean;
  venue: string | null;
  kind: 'league' | 'training';
}

export interface Result {
  id: string;
  date: string;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  ext?: 'OT' | 'SO'; // förlängning eller straffar
}

export const fmtScore = (r: Result) => `${r.homeScore}–${r.awayScore}${r.ext ? ` (${r.ext})` : ''}`;

export const schedule = data.schedule as Match[];
export const results = data.results as Result[];
export const matchesUpdated: string | null = data.updated;

const TZ = 'Europe/Stockholm';
const today = () => new Date().toLocaleDateString('sv-SE', { timeZone: TZ }); // ÅÅÅÅ-MM-DD

/** Kommande matcher. En match med fastställd tid räknas som kommande tills den har börjat. */
export function upcoming(): Match[] {
  const now = Date.now();
  const d = today();
  return schedule.filter((m) => (m.timeKnown && m.start ? Date.parse(m.start) > now : m.date >= d));
}

export const nextMatch = (): Match | null => upcoming()[0] ?? null;
export const lastResult = (): Result | null => results[0] ?? null;

const dateOnly = (date: string) => new Date(`${date}T12:00:00Z`);
export const fmtDay = (date: string) =>
  dateOnly(date).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
export const fmtShortDay = (date: string) =>
  dateOnly(date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'long', timeZone: 'UTC' });
// Kvällsmatcher på vardagar börjar nästan alltid 19:00. När en vardagsmatch saknar tid i schemat
// visas därför 19:00 som preliminär tid. Helgmatcher varierar, så de visas utan tid.
const WEEKDAY_EVENING = '19:00';
const isWeekday = (date: string) => {
  const day = dateOnly(date).getUTCDay();
  return day >= 1 && day <= 5;
};
export const fmtTime = (m: Match) => {
  if (m.timeKnown && m.start) {
    return new Date(m.start).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
  }
  return isWeekday(m.date) ? `${WEEKDAY_EVENING} (preliminärt)` : 'tid ej fastställd';
};
