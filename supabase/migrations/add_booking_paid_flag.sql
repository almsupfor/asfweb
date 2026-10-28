alter table public.bookings add column paid boolean not null default false;

-- Admins may only toggle the paid flag, not edit contact details or prices.
revoke update on public.bookings from authenticated;
grant update (paid) on public.bookings to authenticated;

create policy "admins mark bookings paid" on public.bookings
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));
