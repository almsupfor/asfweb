-- A member may lack an e-mail address, and two members may share one (for example a couple). Letters still need an address.
alter table public.members alter column email drop not null;

drop index public.members_email_key;
create index members_email_idx on public.members (lower(email));

-- Someone who wants membership letters must have an address to receive them.
alter table public.members add constraint members_mail_needs_email check (wants_mail = false or email is not null);
