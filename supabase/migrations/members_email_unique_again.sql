-- Decision: a member may have no e-mail address, but two members may not share one (unclear consent, cannot be reached separately).
-- Several members without an address are fine: a unique index ignores nulls.
drop index public.members_email_idx;
create unique index members_email_key on public.members (lower(email));
