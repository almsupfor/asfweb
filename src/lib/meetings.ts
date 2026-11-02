// Shared helpers for meetings: type and Swedish formatting. Meetings are entered on /admin and read from Supabase.

export interface Meeting {
  id: string;
  kind: 'Årsmöte' | 'Extra föreningsmöte' | 'Medlemsmöte';
  meeting_date: string; // YYYY-MM-DD
  meeting_time: string; // HH:MM:SS
  place: string | null;
  notice_url: string | null; // link to the notice, for example the post in the Facebook group
  note: string | null;
  published: boolean;
}

export const MEETING_KINDS: Meeting['kind'][] = ['Årsmöte', 'Extra föreningsmöte', 'Medlemsmöte'];

/** Today's date in Sweden as YYYY-MM-DD, plus an optional number of days. */
export const stockholmDay = (plusDays = 0) => {
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Stockholm' }).format(new Date());
  const d = new Date(`${today}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + plusDays);
  return d.toISOString().slice(0, 10);
};

export const fmtMeetingDay = (d: string, withYear = true) =>
  new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', ...(withYear && { year: 'numeric' }), timeZone: 'UTC' }).format(new Date(`${d}T12:00:00Z`));

export const fmtMeetingTime = (t: string) => t.slice(0, 5);

// ---- Info bar ---------------------------------------------------------------
// A meeting shows in the yellow bar from 14 days before through the day of the meeting,
// a trip from 7 days before until the day before it leaves. Used at build time and again in the browser.

export const MEETING_DAYS_BEFORE = 14;
export const TRIP_DAYS_BEFORE = 7;

export const infoBarQueries = () => {
  const today = stockholmDay();
  return {
    meetings: `meetings?select=*&published=eq.true&meeting_date=gte.${today}&meeting_date=lte.${stockholmDay(MEETING_DAYS_BEFORE)}&order=meeting_date.asc,meeting_time.asc&limit=1`,
    trips: `trips?select=*&published=eq.true&trip_date=gt.${today}&trip_date=lte.${stockholmDay(TRIP_DAYS_BEFORE)}&order=trip_date.asc&limit=1`,
  };
};

// "Almtuna IS" is left out of "Södertälje SK – Almtuna IS" so the text reads "Bortaresa till Södertälje SK".
const opponent = (title: string) => {
  const other = title.split(/\s+[–-]\s+/).filter((s) => !/almtuna/i.test(s));
  return other.length === 1 ? other[0] : title;
};

export interface InfoRow {
  text: string;
  href: string;
}

export const infoRows = (meetings: Meeting[], trips: { title: string; trip_date: string }[]): InfoRow[] => {
  const rows: InfoRow[] = [];
  const [m] = meetings;
  if (m) rows.push({ text: `${m.kind} ${fmtMeetingDay(m.meeting_date, false)} kl. ${fmtMeetingTime(m.meeting_time)}.`, href: '/moten' });
  const [t] = trips;
  if (t) rows.push({ text: `Bortaresa till ${opponent(t.title)} ${fmtMeetingDay(t.trip_date, false)}.`, href: '/bortaresor' });
  return rows;
};
