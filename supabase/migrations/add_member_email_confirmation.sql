-- E-mail confirmation for members. A member gets a mail with a link holding confirm_token; opening the link and pressing the button
-- stamps email_confirmed_at. Changing the e-mail address resets the confirmation and issues a new token.
alter table public.members
  add column email_confirmed_at timestamptz,
  add column confirmation_sent_at timestamptz,
  add column confirm_token uuid not null default gen_random_uuid();

create unique index members_confirm_token_key on public.members (confirm_token);

create function private.reset_member_confirmation() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.email is distinct from old.email then
    new.email_confirmed_at := null;
    new.confirmation_sent_at := null;
    new.confirm_token := gen_random_uuid();
  end if;
  return new;
end;
$$;

create trigger members_reset_confirmation
  before update of email on public.members
  for each row execute function private.reset_member_confirmation();

-- Called from the public confirmation page. The token is only known to the person the mail went to.
-- The member's own choice about membership letters replaces whatever was noted from paper. Returns whether the token matched.
create function public.confirm_member_email(p_token uuid, p_wants_mail boolean) returns boolean
language sql
security definer
set search_path = ''
as $$
  with u as (
    update public.members
       set email_confirmed_at = coalesce(email_confirmed_at, now()),
           wants_mail = p_wants_mail
     where confirm_token = p_token
    returning 1
  )
  select exists (select 1 from u);
$$;

revoke all on function public.confirm_member_email(uuid, boolean) from public;
grant execute on function public.confirm_member_email(uuid, boolean) to anon, authenticated;
