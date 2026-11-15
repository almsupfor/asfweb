// Membership runs per season, 1 July to 30 June. paid_season is the year the season starts (2026 = 2026/27).
export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  paid_season: number | null;
  wants_mail: boolean;
  note: string | null;
  email_confirmed_at: string | null;
  confirmation_sent_at: string | null;
  created_at: string;
}

/** The season that is running on the given date, as its start year. July or later starts a new one. */
export const seasonStart = (d: Date = new Date()) => (d.getMonth() >= 6 ? d.getFullYear() : d.getFullYear() - 1);

/** 2026 -> "2026/27" */
export const seasonLabel = (start: number) => `${start}/${String((start + 1) % 100).padStart(2, '0')}`;

export const isActive = (m: Pick<Member, 'paid_season'>, now: Date = new Date()) => m.paid_season === seasonStart(now);
