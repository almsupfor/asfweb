-- Not run yet. Delete bookings (and, by cascade, their passengers) a fixed number of days after the trip.
-- Retention is two years (730 days), so that a January trip is still available when the accounts for its year
-- are closed and audited the following year. Keep /integritet in step with the number below.
-- Trips themselves hold no personal data and are kept. Export the CSV in /admin before the cleanup if a record of
-- the bookings is needed, for example as accounting documentation.

create extension if not exists pg_cron with schema pg_catalog;

create or replace function private.delete_old_bookings(retention_days integer)
returns integer
language plpgsql
as $$
declare
  deleted integer;
begin
  if retention_days is null or retention_days < 1 then
    raise exception 'retention_days must be at least 1';
  end if;
  delete from public.bookings b
    using public.trips t
    where b.trip_id = t.id
      and t.trip_date < current_date - retention_days;
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

-- Only the database itself (pg_cron) runs it; the API roles may not.
revoke all on function private.delete_old_bookings(integer) from public, anon, authenticated;

-- Every night at 03:15 UTC.
select cron.schedule('delete-old-bookings', '15 3 * * *', $$select private.delete_old_bookings(730)$$);
