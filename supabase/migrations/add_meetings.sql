-- Association meetings (annual meeting etc.), managed on /admin and shown on /moten and in the info bar.
-- Same access model as trips: published rows are public, only admins can see drafts or change anything.
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('Årsmöte', 'Extra föreningsmöte', 'Medlemsmöte')),
  meeting_date date not null,
  meeting_time time not null,
  place text,
  notice_url text check (notice_url is null or notice_url ~ '^https://[^[:space:]]+$'),
  note text,
  published boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.meetings enable row level security;

create policy "published meetings are public" on public.meetings
  for select to anon, authenticated
  using (published or (select private.is_admin()));

create policy "admins insert meetings" on public.meetings
  for insert to authenticated
  with check ((select private.is_admin()));

create policy "admins update meetings" on public.meetings
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "admins delete meetings" on public.meetings
  for delete to authenticated
  using ((select private.is_admin()));

-- The meeting that was previously hard-coded in src/data/moten.ts.
insert into public.meetings (kind, meeting_date, meeting_time, place, notice_url, published)
values ('Årsmöte', '2026-11-14', '16:00', 'Gränby ishall', 'https://www.facebook.com/groups/121469757864190/posts/29656465340604574', true);
