// Sends the "confirm your e-mail" message to members. Admin-only: the caller's login is checked with am_i_admin().
// Secrets (set with `supabase secrets set`): RESEND_API_KEY, and optionally MAIL_FROM, REPLY_TO, SITE_URL.
// SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase.
import { createClient } from 'npm:@supabase/supabase-js@2';

const SITE_URL = Deno.env.get('SITE_URL') ?? 'https://almtunasupporter.se';
const MAIL_FROM = Deno.env.get('MAIL_FROM') ?? 'Almtuna Supporterförening <medlem@almtunasupporter.se>';
const REPLY_TO = Deno.env.get('REPLY_TO') ?? 'almtunasupporter@gmail.com';
const MAX_PER_CALL = 50;

const cors = {
  'Access-Control-Allow-Origin': SITE_URL,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const body = (firstName: string, link: string) => `Hej ${firstName}!

Du är registrerad som medlem i Almtuna Supporterförening. Vi vill kontrollera att vi har rätt e-postadress till dig, och att du vill få medlemsbrev från föreningen (information om möten, bortaresor och annat som rör medlemskapet).

Bekräfta här:
${link}

Stämmer inte uppgifterna, eller vill du inte ha medlemsbrev? Svara på det här mejlet så ordnar vi det. Du kan när som helst be om att få dina uppgifter rättade eller raderade. Läs mer om hur vi hanterar dem: ${SITE_URL}/integritet/

Hälsningar
Almtuna Supporterförening
`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  const auth = req.headers.get('Authorization') ?? '';
  const asCaller = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: auth } } });
  const { data: isAdmin } = await asCaller.rpc('am_i_admin');
  if (isAdmin !== true) return json({ error: 'forbidden' }, 403);

  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) return json({ error: 'not_configured' }, 503);

  let ids: string[] = [];
  try {
    const parsed = await req.json();
    ids = Array.isArray(parsed?.ids) ? parsed.ids.filter((x: unknown) => typeof x === 'string') : [];
  } catch {
    return json({ error: 'bad_request' }, 400);
  }
  if (ids.length === 0) return json({ error: 'no_ids' }, 400);
  if (ids.length > MAX_PER_CALL) return json({ error: 'too_many', max: MAX_PER_CALL }, 400);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  // Only members who have not confirmed yet and have not said no to letters are mailed, whatever ids the caller sent.
  const { data: members, error } = await admin
    .from('members')
    .select('id, first_name, email, confirm_token')
    .in('id', ids)
    .is('email_confirmed_at', null)
    .eq('wants_mail', true);
  if (error) return json({ error: 'db' }, 500);

  let sent = 0;
  const failed: { id: string; email: string }[] = [];
  for (const m of members ?? []) {
    const link = `${SITE_URL}/medlem/bekrafta/?kod=${m.confirm_token}`;
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [m.email],
        reply_to: REPLY_TO,
        subject: 'Bekräfta din e-postadress till Almtuna Supporterförening',
        text: body(m.first_name, link),
      }),
    });
    if (res.ok) {
      sent++;
      await admin.from('members').update({ confirmation_sent_at: new Date().toISOString() }).eq('id', m.id);
    } else {
      failed.push({ id: m.id, email: m.email });
    }
    await new Promise((r) => setTimeout(r, 600)); // stay under Resend's request rate limit
  }
  return json({ sent, failed });
});
