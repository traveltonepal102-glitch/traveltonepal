-- Deleting a region (decided 2026-10-27). Only a Super admin deletes, and only a region nothing else uses: its treks,
-- the travel guides about it or on its site, the trekking guides who lead there and the regions that compare with it
-- are moved or unticked first. What belongs to the region itself (its text, gallery, nearby treks, hidden guides and
-- its own compare list) goes with it; library photos tagged with it stay, untagged.

grant delete on public.regions to authenticated;

create policy "Super admins delete regions" on public.regions
  for delete to authenticated using ((select public.is_super_admin()));

-- 1. What still uses a region, with each thing's name: the admin lists it ("Remove it from these first") and
-- delete_region refuses while there is any. Runs as the caller, so it sees what the admin may read.
create function public.region_usage(p_region_id uuid, p_locale text default 'en')
returns table (kind text, id uuid, name text)
language sql
stable
set search_path = ''
as $$
  select 'trek', t.id, coalesce(tt.name, t.slug)
  from public.treks t
  left join public.trek_translations tt on tt.trek_id = t.id and tt.locale = p_locale
  where t.region_id = p_region_id
  union all
  select 'travel_guide', a.id, coalesce(art.title, a.slug)
  from public.articles a
  left join public.article_translations art on art.article_id = a.id and art.locale = p_locale
  where a.site_region_id = p_region_id
     or exists (select 1 from public.article_regions ar where ar.article_id = a.id and ar.region_id = p_region_id)
  union all
  select 'trekking_guide', g.id, g.name
  from public.trekking_guides g
  join public.trekking_guide_regions gr on gr.guide_id = g.id
  where gr.region_id = p_region_id
  union all
  select 'region', r.id, coalesce(rt.name, r.slug)
  from public.region_compare c
  join public.regions r on r.id = c.region_id
  left join public.region_translations rt on rt.region_id = r.id and rt.locale = p_locale
  where c.other_region_id = p_region_id
  order by 1, 3;
$$;

revoke execute on function public.region_usage(uuid, text) from public, anon;
grant execute on function public.region_usage(uuid, text) to authenticated;

-- 2. Delete a region once nothing uses it (runs as the caller, so the policies above apply). The row lock makes
-- anyone linking something to the region meanwhile wait, and then fail, instead of slipping in after the check.
create function public.delete_region(p_region_id uuid)
returns void
language plpgsql
set search_path = ''
as $$
begin
  perform 1 from public.regions where id = p_region_id for update;
  if not found then
    raise exception 'Region not found' using errcode = 'P0002';
  end if;

  if exists (select 1 from public.region_usage(p_region_id)) then
    raise exception 'The region is still in use' using errcode = '23503', hint = 'region_in_use';
  end if;

  delete from public.regions where id = p_region_id;
  if not found then
    raise exception 'Only a Super admin can delete a region' using errcode = '42501';
  end if;
end;
$$;

revoke execute on function public.delete_region(uuid) from public, anon;
grant execute on function public.delete_region(uuid) to authenticated;

-- 3. A deleted region's old addresses no longer redirect anywhere, so they are forgotten with it. Runs as its owner,
-- like remember_old_slug (the admin's rights don't cover slug_redirects).
create function public.forget_slug_redirects()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.slug_redirects where kind = tg_argv[0] and target_id = old.id;
  return old;
end;
$$;

revoke all on function public.forget_slug_redirects() from public, anon, authenticated;

create trigger regions_forget_slug_redirects
after delete on public.regions
for each row execute function public.forget_slug_redirects('region');
