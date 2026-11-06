-- Sites: edit and delete (decided 2026-11-03). Super admins edit a site's name, address and "Live" switch; they
-- delete a region site only while it isn't live. The main site (traveltonepal.com) is never deleted and always live.

-- As before, except that saving the main site keeps it live (its "Live" switch isn't offered).
create or replace function public.save_site(p_site_id text, p_site jsonb)
returns text
language plpgsql
set search_path = ''
as $$
declare
  saved_id text;
begin
  if p_site_id is null then
    insert into public.sites (id, kind, region_id, name, url, position, updated_by)
    values (
      p_site ->> 'id',
      'region',
      (p_site ->> 'region_id')::uuid,
      p_site ->> 'name',
      nullif(p_site ->> 'url', ''),
      coalesce((select max(s.position) from public.sites s), 0) + 1,
      auth.uid()
    )
    returning id into saved_id;
    return saved_id;
  end if;

  update public.sites
  set name = p_site ->> 'name',
      url = nullif(p_site ->> 'url', ''),
      is_live = case when kind = 'main' then true else (p_site ->> 'is_live')::boolean end,
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_site_id
  returning id into saved_id;

  if saved_id is null then
    raise exception 'Site not found' using errcode = 'P0002';
  end if;
  return saved_id;
end;
$$;

grant delete on public.sites to authenticated;

-- A live site or the main site can't be deleted, whoever asks.
create policy "Super admins delete draft region sites" on public.sites
  for delete to authenticated using ((select public.is_super_admin()) and kind = 'region' and not is_live);

-- Deletes a draft region site. Raises 22023 'main_site' or 'site_is_live' with the reason, P0002 for a site that
-- no longer exists, 42501 for an admin who may not delete. Runs as the admin: Row Level Security applies.
create function public.delete_site(p_site_id text)
returns void
language plpgsql
set search_path = ''
as $$
declare
  found_site public.sites%rowtype;
begin
  select * into found_site from public.sites where id = p_site_id;
  if not found then
    raise exception 'Site not found' using errcode = 'P0002';
  end if;
  if found_site.kind = 'main' then
    raise exception 'main_site' using errcode = '22023';
  end if;
  if found_site.is_live then
    raise exception 'site_is_live' using errcode = '22023';
  end if;

  delete from public.sites where id = p_site_id;
  if not found then
    raise exception 'Not allowed to delete this site' using errcode = '42501';
  end if;
end;
$$;

revoke execute on function public.delete_site(text) from public, anon;
grant execute on function public.delete_site(text) to authenticated;
