-- The admin's Photos screen: where each library photo is used (its folders), and deleting a photo nothing uses.
-- Both functions run as the caller, so the tables' RLS applies: admins only, and deleting needs a Super admin.

-- 1. Every library photo id in a JSON value: rich texts and legal texts keep each image block's photo id.
create function public.photo_ids_in(p_value jsonb)
returns setof uuid
language sql
immutable
set search_path = ''
as $$
  select distinct (found #>> '{}')::uuid
  from jsonb_path_query(p_value, 'strict $.**.photoId') as found
  where jsonb_typeof(found) = 'string'
    and found #>> '{}' ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
$$;

-- 2. Where each photo is used: what kind of thing, which one (id and name) and where on it, e.g. trek · Day 3.
-- Texts are searched in every language; names are the English ones. A page's name is its slug (the admin names it).
create function public.photo_uses(p_photo_id uuid default null)
returns table (photo_id uuid, kind text, item_id text, item_label text, detail text)
language sql
stable
set search_path = ''
as $$
  with
    trek_names as (
      select t.id, coalesce(nullif(tt.name, ''), t.slug) as name
      from public.treks t left join public.trek_translations tt on tt.trek_id = t.id and tt.locale = 'en'
    ),
    region_names as (
      select r.id, coalesce(nullif(rt.name, ''), r.slug) as name
      from public.regions r left join public.region_translations rt on rt.region_id = r.id and rt.locale = 'en'
    ),
    guide_names as (
      select a.id, coalesce(nullif(at.title, ''), a.slug) as name
      from public.articles a left join public.article_translations at on at.article_id = a.id and at.locale = 'en'
    ),
    uses (photo_id, kind, item_id, item_label, detail) as (
      -- Treks
      select t.cover_photo_id, 'trek', t.id::text, n.name, 'Cover'
      from public.treks t join trek_names n on n.id = t.id where t.cover_photo_id is not null
      union all
      select tp.photo_id, 'trek', tp.trek_id::text, n.name, 'Gallery'
      from public.trek_photos tp join trek_names n on n.id = tp.trek_id
      union all
      select d.photo_id, 'trek', d.trek_id::text, n.name, 'Day ' || (d.position + 1)
      from public.trek_days d join trek_names n on n.id = d.trek_id where d.photo_id is not null
      union all
      select ids.id, 'trek', tt.trek_id::text, n.name, 'In the text'
      from public.trek_translations tt join trek_names n on n.id = tt.trek_id
      cross join lateral public.photo_ids_in(to_jsonb(tt)) as ids (id)
      union all
      select ids.id, 'trek', d.trek_id::text, n.name, 'Day ' || (d.position + 1) || ' text'
      from public.trek_day_translations dt
      join public.trek_days d on d.id = dt.day_id
      join trek_names n on n.id = d.trek_id
      cross join lateral public.photo_ids_in(to_jsonb(dt)) as ids (id)

      -- Regions
      union all
      select r.cover_photo_id, 'region', r.id::text, n.name, 'Cover'
      from public.regions r join region_names n on n.id = r.id where r.cover_photo_id is not null
      union all
      select rp.photo_id, 'region', rp.region_id::text, n.name, 'Gallery'
      from public.region_photos rp join region_names n on n.id = rp.region_id
      union all
      select ids.id, 'region', rt.region_id::text, n.name, 'In the text'
      from public.region_translations rt join region_names n on n.id = rt.region_id
      cross join lateral public.photo_ids_in(to_jsonb(rt)) as ids (id)

      -- Travel guides
      union all
      select a.cover_photo_id, 'guide', a.id::text, n.name, 'Cover'
      from public.articles a join guide_names n on n.id = a.id where a.cover_photo_id is not null
      union all
      select sp.photo_id, 'guide', s.article_id::text, n.name, 'Section ' || (s.position + 1)
      from public.article_section_photos sp
      join public.article_sections s on s.id = sp.section_id
      join guide_names n on n.id = s.article_id
      union all
      select ids.id, 'guide', s.article_id::text, n.name, 'Section ' || (s.position + 1) || ' text'
      from public.article_sections s
      left join public.article_section_translations st on st.section_id = s.id
      join guide_names n on n.id = s.article_id
      cross join lateral public.photo_ids_in(jsonb_build_array(s.settings, st.content)) as ids (id)
      union all
      select ids.id, 'guide', at.article_id::text, n.name, 'In the text'
      from public.article_translations at join guide_names n on n.id = at.article_id
      cross join lateral public.photo_ids_in(to_jsonb(at)) as ids (id)

      -- Fixed pages
      union all
      select p.photo_id, 'page', p.slug, p.slug, 'Top photo'
      from public.site_pages p where p.photo_id is not null
      union all
      select pp.photo_id, 'page', pp.page_slug, pp.page_slug, 'Photo ' || pp.position
      from public.site_page_photos pp
      union all
      select ids.id, 'page', p.slug, p.slug, 'In the text'
      from public.site_pages p cross join lateral public.photo_ids_in(p.content) as ids (id)

      -- Adventures
      union all
      select a.photo_id, 'adventure', a.id::text, a.title, 'Card photo'
      from public.adventures a where a.photo_id is not null
      union all
      select ids.id, 'adventure', 'section', 'Section text', 'In the text'
      from public.adventure_section s cross join lateral public.photo_ids_in(s.steps) as ids (id)

      -- People
      union all
      select a.photo_id, 'author', a.id::text, a.name, 'Author photo'
      from public.authors a where a.photo_id is not null
      union all
      select g.photo_id, 'trekking_guide', g.id::text, g.name, 'Guide photo'
      from public.trekking_guides g where g.photo_id is not null
      union all
      select r.photo_id, 'review', r.id::text, r.reviewer_name, 'Reviewer photo'
      from public.reviews r where r.photo_id is not null

      -- Company (Site settings)
      union all
      select s.certificate_photo_id, 'settings', 'settings', 'Site settings', 'Licence scan'
      from public.site_settings s where s.certificate_photo_id is not null
      union all
      select s.pan_certificate_photo_id, 'settings', 'settings', 'Site settings', 'PAN certificate scan'
      from public.site_settings s where s.pan_certificate_photo_id is not null
      union all
      select s.share_photo_id, 'settings', 'settings', 'Site settings', 'Share image'
      from public.site_settings s where s.share_photo_id is not null
    )
  select distinct u.photo_id, u.kind, u.item_id, u.item_label, u.detail
  from uses u
  where p_photo_id is null or u.photo_id = p_photo_id;
$$;

-- 3. Deleting: Super admins only, and only a photo nothing uses (its foreign keys protect most uses, but not the
-- photos placed in texts). Returns the files to remove from storage; no row when the photo was already gone.
grant delete on public.photos to authenticated;

create policy "Super admins delete photos" on public.photos
  for delete to authenticated using ((select public.is_super_admin()));

create function public.delete_unused_photo(p_photo_id uuid)
returns table (master_key text, variant_widths integer[])
language plpgsql
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not (select public.is_super_admin()) then
    raise exception 'Only a Super admin can delete photos.' using errcode = '42501';
  end if;

  perform 1 from public.photos p where p.id = p_photo_id for update;
  if not found then
    return;
  end if;

  if exists (select 1 from public.photo_uses(p_photo_id)) then
    raise exception 'This photo is still used.' using errcode = 'P0001', hint = 'photo_in_use';
  end if;

  return query delete from public.photos p where p.id = p_photo_id returning p.master_key, p.variant_widths;
end;
$$;

revoke execute on function public.photo_ids_in(jsonb) from public, anon;
revoke execute on function public.photo_uses(uuid) from public, anon;
revoke execute on function public.delete_unused_photo(uuid) from public, anon;
grant execute on function public.photo_ids_in(jsonb) to authenticated;
grant execute on function public.photo_uses(uuid) to authenticated;
grant execute on function public.delete_unused_photo(uuid) to authenticated;
