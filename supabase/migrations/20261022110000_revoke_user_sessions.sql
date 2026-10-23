-- Signs a user out on every device (deletes their sessions; refresh tokens go with them).
-- Used by the admin seed script after a password change. Secret key (service_role) only.
create function public.revoke_user_sessions(p_user_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from auth.sessions where user_id = p_user_id;
$$;

revoke execute on function public.revoke_user_sessions(uuid) from public, anon, authenticated;

grant execute on function public.revoke_user_sessions(uuid) to service_role;
