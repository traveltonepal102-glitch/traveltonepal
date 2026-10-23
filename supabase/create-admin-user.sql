-- Create (or update) a super_admin for the admin portal.
--
-- How to use: copy this whole file into the Supabase SQL Editor, fill in the three values below,
-- and click Run. Running it again with the same email updates that admin's name and password and
-- signs them out everywhere, instead of creating a duplicate.
--
-- Never save real values in this file (it is committed to git), and clear them from the SQL Editor
-- after running.
do $$
declare
  admin_email     text := '';  -- e.g. 'name@example.com'
  admin_password  text := '';
  admin_full_name text := '';  -- shown in the admin header

  admin_id uuid;
begin
  admin_email := lower(trim(admin_email));

  if admin_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' then
    raise exception 'Not a valid email: %', admin_email;
  end if;
  if coalesce(admin_password, '') = '' or coalesce(trim(admin_full_name), '') = '' then
    raise exception 'Fill in the password and the full name.';
  end if;

  select id into admin_id from auth.users where email = admin_email;

  if admin_id is null then
    admin_id := gen_random_uuid();

    -- Empty strings, not NULL, in the token columns: Supabase Auth can't read NULL there.
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) values (
      '00000000-0000-0000-0000-000000000000', admin_id, 'authenticated', 'authenticated', admin_email,
      extensions.crypt(admin_password, extensions.gen_salt('bf', 10)), now(),
      '{"provider": "email", "providers": ["email"]}', '{}', now(), now(),
      '', '', '', ''
    );

    insert into auth.identities (user_id, provider_id, provider, identity_data, last_sign_in_at, created_at, updated_at)
    values (
      admin_id, admin_id::text, 'email',
      jsonb_build_object('sub', admin_id::text, 'email', admin_email, 'email_verified', true, 'phone_verified', false),
      now(), now(), now()
    );
  else
    -- Existing user: new password, and signed out everywhere.
    update auth.users
    set encrypted_password = extensions.crypt(admin_password, extensions.gen_salt('bf', 10)),
        email_confirmed_at = coalesce(email_confirmed_at, now()),
        updated_at = now()
    where id = admin_id;

    delete from auth.sessions where user_id = admin_id;
  end if;

  insert into public.admin_users (id, full_name, role)
  values (admin_id, trim(admin_full_name), 'super_admin')
  on conflict (id) do update set full_name = excluded.full_name, role = excluded.role;

  delete from public.login_locks where email = admin_email;

  raise notice 'Saved % as super_admin.', admin_email;
end $$;
