-- Deleting treks and travel guides (decided 2026-11-10). Only a Super admin deletes, like regions.
--
-- A trek is refused while something would lose a trek it shows: a region website's main trek, a region's featured
-- trek, or a travel guide that points at it (its "Plan this trek" box, or a Trek, Days, Altitude or Compare section).
-- Everything else lets go by itself: the trek's own rows go with it (foreign keys cascade), other treks' similar
-- lists and regions' "more treks" lists drop it, its reviews stay without a trek, and library photos stay.
--
-- A travel guide has nothing that must be fixed first: its own rows go with it and other guides' related lists drop
-- it. RLS already lets Super admins delete articles (20261024260000_travel_guides.sql).

grant delete on public.treks to authenticated;

create policy "Super admins delete treks" on public.treks
  for delete to authenticated using ((select public.is_super_admin()));

-- 1. What still uses a trek, with each thing's name: the admin lists it and delete_trek refuses while there is any.
-- Runs as the caller, so it sees what the admin may read. A website's id is text, so every id is returned as text.
create function public.trek_usage(p_trek_id uuid, p_locale text default 'en')
returns table (kind text, id text, name text)
language sql
stable
set search_path = ''
as $$
  select 'website', s.id, s.name
  from public.sites s
  where s.home_trek_id = p_trek_id
  union all
  select 'region', r.id::text, coalesce(rt.name, r.slug)
  from public.regions r
  left join public.region_translations rt on rt.region_id = r.id and rt.locale = p_locale
  where r.featured_trek_id = p_trek_id
  union all
  select 'travel_guide', a.id::text, coalesce(art.title, a.slug)
  from public.articles a
  left join public.article_translations art on art.article_id = a.id and art.locale = p_locale
  where a.main_trek_id = p_trek_id
     or exists (
       select 1 from public.article_sections s
       where s.article_id = a.id
         and (s.trek_id = p_trek_id or coalesce(s.settings -> 'trekIds', '[]'::jsonb) ? p_trek_id::text)
     )
  order by 1, 3;
$$;

revoke execute on function public.trek_usage(uuid, text) from public, anon;
grant execute on function public.trek_usage(uuid, text) to authenticated;

-- 2. Delete a trek of a website once nothing uses it (runs as the caller, so the policies above apply). The row lock
-- makes anyone linking something to the trek meanwhile wait, and then fail, instead of slipping in after the check.
-- Returns the trek's printable map (or null), so the admin can delete that file too.
create function public.delete_trek(p_trek_id uuid, p_site_id text)
returns text
language plpgsql
set search_path = ''
as $$
declare
  v_pdf_map_path text;
begin
  perform 1 from public.treks where id = p_trek_id and site_id = p_site_id for update;
  if not found then
    raise exception 'Trek not found' using errcode = 'P0002';
  end if;

  if exists (select 1 from public.trek_usage(p_trek_id)) then
    raise exception 'The trek is still in use' using errcode = '23503', hint = 'trek_in_use';
  end if;

  delete from public.treks where id = p_trek_id and site_id = p_site_id returning pdf_map_path into v_pdf_map_path;
  if not found then
    raise exception 'Only a Super admin can delete a trek' using errcode = '42501';
  end if;

  return v_pdf_map_path;
end;
$$;

revoke execute on function public.delete_trek(uuid, text) from public, anon;
grant execute on function public.delete_trek(uuid, text) to authenticated;

-- 3. A deleted trek's or guide's old addresses no longer redirect anywhere, so they are forgotten with it
-- (forget_slug_redirects: 20261027090000_delete_region.sql).
create trigger treks_forget_slug_redirects
after delete on public.treks
for each row execute function public.forget_slug_redirects('trek');

create trigger articles_forget_slug_redirects
after delete on public.articles
for each row execute function public.forget_slug_redirects('guide');
