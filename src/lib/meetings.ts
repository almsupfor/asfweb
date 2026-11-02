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
