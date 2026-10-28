-- Optional external page (for example a Facebook post) where sign-up for a trip happens instead of the form.
alter table public.trips
  add column external_url text
  check (external_url is null or external_url ~ '^https://[^[:space:]]+$');
