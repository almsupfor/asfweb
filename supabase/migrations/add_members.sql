-- Membership register, managed on /admin (Medlemmar tab). Admin-only: no public or anonymous access at all.
-- A membership is a season, 1 July to 30 June. paid_season is the year the season starts (2026 = season 2026/27).
create table public.members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 1 and 80),
  last_name text not null check (char_length(last_name) between 1 and 80),
  email text not null check (email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' and char_length(email) <= 200),
  paid_season smallint check (paid_season is null or paid_season between 2020 and 2100),
  wants_mail boolean not null default true,
  note text check (note is null or char_length(note) <= 500),
  created_at timestamptz not null default now()
);

create unique index members_email_key on public.members (lower(email));

alter table public.members enable row level security;

create policy "admins read members" on public.members
  for select to authenticated
  using ((select private.is_admin()));

create policy "admins insert members" on public.members
  for insert to authenticated
  with check ((select private.is_admin()));

create policy "admins update members" on public.members
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "admins delete members" on public.members
  for delete to authenticated
  using ((select private.is_admin()));
