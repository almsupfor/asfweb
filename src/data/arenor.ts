// Ungefärlig körtid från Gränby ishall (Uppsala) till bortahallarna, för att föreslå avgångstid.
// Bilrestid i minuter enligt OpenStreetMap/OSRM, uträknad 2026-10-28. Nycklarna är hallnamnen i spelschemat.
// Visby Ishall saknas med flit: där krävs färja, så ingen avgångstid föreslås.
import type { Match } from './matches';

const DRIVE_MINUTES: Record<string, number> = {
  'ABB Arena Nord': 69,
  'Östersund Arena': 382,
  'Tegera Arena': 195,
  'VBO Arena': 287,
  'Hatstore Arena': 375,
  'Be-Ge Hockey Center': 319,
  'Wibe Arena': 227,
  'Scaniarinken': 90,
  'Hägglunds Arena': 342,
  'Hovet': 65,
  'Nobelhallen': 169,
  'Liljas Arena': 395,
};

const BUS_FACTOR = 1.15; // bussen går lugnare än bil
const BREAK_AFTER = 180; // från så här lång körning ingår en rast
const BREAK_MINUTES = 20;
export const ARRIVE_BEFORE = 30; // minuter före nedsläpp som vi vill vara på plats
const TZ = 'Europe/Stockholm';

const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`;
export const fmtDuration = (min: number) => (min >= 60 ? `${Math.floor(min / 60)} h ${min % 60} min` : `${min} min`);

export interface TravelEstimate {
  busMinutes: number; // restid med buss inklusive rast
  arrive: string; // senast på plats (HH:MM)
  departure: string; // föreslagen avgång (HH:MM), avrundad nedåt till 5 min
  preliminary: boolean; // matchtiden är inte fastställd
}

/** Föreslagen avgång för en bortamatch, eller null om hallen eller matchtiden saknas. */
export function travelEstimate(m: Match): TravelEstimate | null {
  const drive = m.venue ? DRIVE_MINUTES[m.venue] : undefined;
  if (drive === undefined) return null;
  let startMin: number;
  let preliminary = false;
  if (m.timeKnown && m.start) {
    const [h, min] = new Date(m.start).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).split(':').map(Number);
    startMin = h * 60 + min;
  } else {
    // Samma antagande som schemat: vardagskvällar börjar 19:00, helgmatcher saknar tid.
    const day = new Date(`${m.date}T12:00:00Z`).getUTCDay();
    if (day < 1 || day > 5) return null;
    startMin = 19 * 60;
    preliminary = true;
  }
  const busMinutes = Math.ceil(drive * BUS_FACTOR) + (drive >= BREAK_AFTER ? BREAK_MINUTES : 0);
  const arrive = startMin - ARRIVE_BEFORE;
  const departure = Math.floor((arrive - busMinutes) / 5) * 5;
  if (departure < 0) return null;
  return { busMinutes, arrive: hhmm(arrive), departure: hhmm(departure), preliminary };
}
