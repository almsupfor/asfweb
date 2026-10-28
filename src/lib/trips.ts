// Shared helpers for the away-trip pages: types, Swedish formatting and error texts.

export interface Trip {
  id: string;
  title: string;
  trip_date: string; // YYYY-MM-DD
  departure_time: string | null; // HH:MM:SS
  departure_place: string | null;
  price_member: number;
  price_other: number;
  capacity: number;
  is_open: boolean;
  published: boolean;
  info: string | null;
  external_url: string | null; // external page where this trip's sign-up happens instead of the form
}

export interface Spots {
  trip_id: string;
  capacity: number;
  taken: number;
}

export const fmtTripDate = (d: string) =>
  new Date(`${d}T12:00:00`).toLocaleDateString('sv-SE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

export const fmtTripTime = (t: string | null) => (t ? t.slice(0, 5) : null);

export const kr = (n: number) => `${n} kr`;

/** The external sign-up link of a trip, or null unless it is an https address (database text is never trusted as a link). */
export const externalLink = (url: string | null | undefined): string | null => {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
};

// The database raises short codes; these are the texts shown to visitors.
const ERRORS: Record<string, string> = {
  privacy_not_accepted: 'Du måste godkänna hur föreningen hanterar dina uppgifter.',
  invalid_email: 'Kontrollera e-postadressen.',
  invalid_phone: 'Kontrollera mobilnumret.',
  invalid_passengers: 'Lägg till minst en och högst åtta passagerare.',
  invalid_passenger: 'Fyll i för- och efternamn för alla passagerare.',
  trip_not_found: 'Resan hittades inte.',
  trip_closed: 'Anmälan är stängd för den här resan.',
  trip_full: 'Det finns inte tillräckligt många platser kvar.',
};

export const errorText = (message: string | undefined) => {
  const code = Object.keys(ERRORS).find((c) => message?.includes(c));
  return code ? ERRORS[code] : 'Något gick fel. Försök igen om en stund, eller mejla föreningen.';
};

/** Tiny DOM helper so database text is always set as text, never as HTML. */
export const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<Record<string, string>> = {},
  ...children: (Node | string | null | undefined | false)[]
): HTMLElementTagNameMap[K] => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) if (v !== undefined) node.setAttribute(k, v);
  for (const c of children) if (c) node.append(c);
  return node;
};
