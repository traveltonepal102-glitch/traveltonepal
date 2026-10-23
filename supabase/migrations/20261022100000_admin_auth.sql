-- Admin sign-in on Supabase Auth (replaces Payload).
-- Accounts live in auth.users; admin_users says who may use the admin portal and with which role.
-- Nothing here is reachable with the public (publishable) key: RLS is on and anon gets no grants.

-- 1. Remove Payload's tables (they only held the old admin user).
drop table if exists
  public.payload_locked_documents_rels,
  public.payload_locked_documents,
  public.payload_preferences_rels,
  public.payload_preferences,
  public.payload_migrations,
  public.payload_kv,
  public.users_sessions,
  public.users
  cascade;

-- 2. Admin users and roles. Editors come later.
create type public.admin_role as enum ('super_admin', 'editor');

create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role public.admin_role not null default 'editor',
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- No policies and no grants yet: read only through current_admin() below.

-- 3. The signed-in admin, or no row. Checked on every protected page and action.
-- Returns nothing when the user isn't an admin, the session was revoked (signed out, password reset)
-- or the session is older than 7 days (hard limit, whatever the cookies say).
create function public.current_admin()
returns table (id uuid, email text, full_name text, role public.admin_role)
language sql
stable
security definer
set search_path = ''
as $$
  select a.id, u.email::text, a.full_name, a.role
  from public.admin_users a
  join auth.users u on u.id = a.id
  join auth.sessions s on s.id = (auth.jwt() ->> 'session_id')::uuid and s.user_id = a.id
  where a.id = auth.uid()
    and (u.banned_until is null or u.banned_until < now())
    and s.created_at > now() - interval '7 days'
    and (s.not_after is null or s.not_after > now());
$$;

revoke execute on function public.current_admin() from public, anon;

grant execute on function public.current_admin() to authenticated;

-- 4. Sign-in lock: after N wrong passwords for an email, that email is locked for a while.
-- Used only by the admin server with the secret key (service_role).
create table public.login_locks (
  email text primary key,
  failed_attempts integer not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.login_locks enable row level security;

-- When the email is locked: the time it unlocks, else null.
create function public.login_locked_until(p_email text)
returns timestamptz
language sql
stable
set search_path = ''
as $$
  select locked_until from public.login_locks where email = p_email and locked_until > now();
$$;

-- Counts a wrong password (atomically) and locks the email when it reaches p_max_attempts.
-- A lock that has run out starts the count again.
create function public.login_record_failure(p_email text, p_max_attempts integer, p_lock_seconds integer)
returns table (failed_attempts integer, locked_until timestamptz)
language plpgsql
set search_path = ''
as $$
declare
  lock_row public.login_locks;
begin
  insert into public.login_locks as l (email, failed_attempts)
  values (p_email, 1)
  on conflict (email) do update
    set failed_attempts = case when l.locked_until <= now() then 1 else l.failed_attempts + 1 end,
        locked_until = case when l.locked_until <= now() then null else l.locked_until end,
        updated_at = now()
  returning * into lock_row;

  if lock_row.failed_attempts >= p_max_attempts and lock_row.locked_until is null then
    update public.login_locks l
    set locked_until = now() + make_interval(secs => p_lock_seconds)
    where l.email = p_email
    returning * into lock_row;
  end if;

  return query select lock_row.failed_attempts, lock_row.locked_until;
end;
$$;

-- After a correct password.
create function public.login_clear_failures(p_email text)
returns void
language sql
set search_path = ''
as $$
  delete from public.login_locks where email = p_email;
$$;

revoke execute on function public.login_locked_until(text) from public, anon, authenticated;

revoke execute on function public.login_record_failure(text, integer, integer) from public, anon, authenticated;

revoke execute on function public.login_clear_failures(text) from public, anon, authenticated;

grant execute on function public.login_locked_until(text) to service_role;

grant execute on function public.login_record_failure(text, integer, integer) to service_role;

grant execute on function public.login_clear_failures(text) to service_role;

grant select, insert, update, delete on public.login_locks to service_role;
