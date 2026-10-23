-- Admins are created and updated from the Supabase SQL Editor (supabase/admin-users.sql), so the
-- seed script and its revoke_user_sessions helper are gone.
drop function if exists public.revoke_user_sessions(uuid);

-- Creates a Supabase Auth user with admin access, or updates an existing one (by email):
-- new password (bcrypt, as Supabase Auth stores it), name and role, signed out everywhere, unlocked.
-- Only the database owner (the SQL Editor) can run it: no API key can call it.
create function public.admin_upsert_user(
  p_email text,
  p_password text,
  p_full_name text,
  p_role public.admin_role default 'super_admin'
)
returns text
language plpgsql
set search_path = ''
as $$
declare
  normalized_email text := lower(trim(p_email));
  target_id uuid;
begin
  if normalized_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'Not a valid email: %', p_email;
  end if;
  if length(coalesce(p_password, '')) < 12 then
    raise exception 'The password must be at least 12 characters.';
  end if;
  if coalesce(trim(p_full_name), '') = '' then
    raise exception 'Enter the full name (shown in the admin header).';
  end if;

  select u.id into target_id from auth.users u where u.email = normalized_email;

  if target_id is null then
    target_id := gen_random_uuid();

    -- Empty strings, not NULL, in the token columns: Supabase Auth can't read NULL there.
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', target_id, 'authenticated', 'authenticated', normalized_email,
      extensions.crypt(p_password, extensions.gen_salt('bf', 10)), now(),
      '{"provider": "email", "providers": ["email"]}', '{}', now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
    values (
      target_id, target_id::text, 'email',
      jsonb_build_object('sub', target_id::text, 'email', normalized_email, 'email_verified', true, 'phone_verified', false),
      now(), now(), now()
    );
  else
    update auth.users u
    set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
        email_confirmed_at = coalesce(u.email_confirmed_at, now()),
        updated_at = now()
    where u.id = target_id;

    -- A new password signs the user out on every device.
    delete from auth.sessions s where s.user_id = target_id;
  end if;

  insert into public.admin_users (id, full_name, role)
  values (target_id, trim(p_full_name), p_role)
  on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;

  delete from public.login_locks l where l.email = normalized_email;

  return format('Saved %s as %s. Sign in at the admin with this email and password.', normalized_email, p_role);
end;
$$;

revoke execute on function public.admin_upsert_user(text, text, text, public.admin_role)
  from public, anon, authenticated, service_role;
