-- Page sections (decided 2026-11-03): a region website's Home page is built from sections, like a travel guide's body.
-- It starts with 14 default sections (hero, key facts, treks, prices, itinerary, photos, "is this trek for you?",
-- why us, reviews, best months, day by day, questions, travel guides, call to action); admins edit each one, move
-- them, add more from the catalog and remove them. Everything is typed for that website: nothing comes from
-- Travel To Nepal. A section's own fields are in `data` (checked by the admin's zod schemas, read leniently by the
-- website); photos are kept as "photoId" keys, which photo_uses() finds.

create table public.site_page_sections (
  id uuid primary key default gen_random_uuid(),
  site_id text not null,
  page_slug text not null,
  -- Order on the page, 0 first.
  position smallint not null check (position between 0 and 59),
  type text not null check (type in (
    'hero', 'facts', 'treks', 'prices', 'itinerary', 'gallery', 'fit', 'why',
    'reviews', 'months', 'days', 'faq', 'guides', 'cta', 'text'
  )),
  data jsonb not null default '{}' check (jsonb_typeof(data) = 'object' and octet_length(data::text) <= 100000),
  is_shown boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  foreign key (site_id, page_slug) references public.site_pages (site_id, slug) on delete cascade,
  unique (site_id, page_slug, position) deferrable initially deferred
);

alter table public.site_page_sections enable row level security;

grant select, insert, update, delete on public.site_page_sections to authenticated;

create policy "Admins read page sections" on public.site_page_sections for select to authenticated using ((select public.is_admin()));
create policy "Admins add page sections" on public.site_page_sections for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit page sections" on public.site_page_sections
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove page sections" on public.site_page_sections for delete to authenticated using ((select public.is_admin()));

-- Saves a page's sections in one transaction: p_sections is the whole list, top to bottom
-- ([{ "type", "data", "is_shown" }]); the old list is replaced. Runs as the admin: Row Level Security applies.
create function public.save_site_page_sections(p_site_id text, p_page_slug text, p_sections jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  if jsonb_typeof(p_sections) <> 'array' or jsonb_array_length(p_sections) > 60 then
    raise exception 'Sections must be a list of at most 60' using errcode = '22023';
  end if;

  update public.site_pages set updated_at = now(), updated_by = auth.uid()
  where site_id = p_site_id and slug = p_page_slug;
  if not found then
    raise exception 'Not allowed to change this page' using errcode = '42501';
  end if;

  delete from public.site_page_sections where site_id = p_site_id and page_slug = p_page_slug;
  insert into public.site_page_sections (site_id, page_slug, position, type, data, is_shown, updated_by)
  select p_site_id, p_page_slug, (n - 1)::smallint, s.section ->> 'type', coalesce(s.section -> 'data', '{}'::jsonb),
         coalesce((s.section ->> 'is_shown')::boolean, true), auth.uid()
  from jsonb_array_elements(p_sections) with ordinality as s (section, n);
end;
$$;

revoke execute on function public.save_site_page_sections(text, text, jsonb) from public, anon;
grant execute on function public.save_site_page_sections(text, text, jsonb) to authenticated;

-- A region website's Home page starts with the default sections (headings only; the admin fills them in).
create function public.insert_default_home_sections(p_site_id text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.site_page_sections (site_id, page_slug, position, type, data)
  select p_site_id, 'home', (d.n - 1)::smallint, d.type, d.data
  from (values
    (1, 'hero', '{"buttonLabel": "Plan my trek on WhatsApp", "secondLabel": "See the itinerary"}'::jsonb),
    (2, 'facts', '{"heading": "Trek facts"}'::jsonb),
    (3, 'treks', '{"heading": "Our treks"}'::jsonb),
    (4, 'prices', '{"heading": "Price per person"}'::jsonb),
    (5, 'itinerary', '{"heading": "Itinerary at a glance"}'::jsonb),
    (6, 'gallery', '{"heading": "Photos from the trail"}'::jsonb),
    (7, 'fit', '{"heading": "Is this trek for you?"}'::jsonb),
    (8, 'why', '{"heading": "Why trek with us"}'::jsonb),
    (9, 'reviews', '{"heading": "What trekkers say"}'::jsonb),
    (10, 'months', '{"heading": "Best months to trek"}'::jsonb),
    (11, 'days', '{"heading": "Day by day"}'::jsonb),
    (12, 'faq', '{"heading": "Questions and answers"}'::jsonb),
    (13, 'guides', '{"heading": "Travel guides"}'::jsonb),
    (14, 'cta', '{"heading": "Plan your trek with us", "buttonLabel": "Plan my trek on WhatsApp"}'::jsonb)
  ) as d (n, type, data)
  where not exists (select 1 from public.site_page_sections x where x.site_id = p_site_id and x.page_slug = 'home');
$$;

revoke execute on function public.insert_default_home_sections(text) from public, anon, authenticated;

create function public.create_home_sections()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.slug = 'home' and exists (select 1 from public.sites s where s.id = new.site_id and s.kind = 'region') then
    perform public.insert_default_home_sections(new.site_id);
  end if;
  return new;
end;
$$;

revoke execute on function public.create_home_sections() from public, anon, authenticated;

create trigger site_pages_create_home_sections after insert on public.site_pages for each row execute function public.create_home_sections();

-- The region sites added before this migration get theirs now.
select public.insert_default_home_sections(s.id) from public.sites s where s.kind = 'region';

-- photo_uses(): as before, plus the photos in page sections (so they show as used and can't be deleted).
CREATE OR REPLACE FUNCTION public.photo_uses(p_photo_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(photo_id uuid, kind text, item_id text, item_label text, detail text)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
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
      union all
      select tt.share_photo_id, 'trek', tt.trek_id::text, n.name, 'Share photo'
      from public.trek_translations tt join trek_names n on n.id = tt.trek_id where tt.share_photo_id is not null

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
      union all
      select rt.share_photo_id, 'region', rt.region_id::text, n.name, 'Share photo'
      from public.region_translations rt join region_names n on n.id = rt.region_id where rt.share_photo_id is not null

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
      union all
      select at.share_photo_id, 'guide', at.article_id::text, n.name, 'Share photo'
      from public.article_translations at join guide_names n on n.id = at.article_id where at.share_photo_id is not null

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
      union all
      select p.share_photo_id, 'page', p.slug, p.slug, 'Share photo'
      from public.site_pages p where p.share_photo_id is not null

      union all
      select ids.id, 'page', s.page_slug, s.page_slug, 'Section ' || (s.position + 1)
      from public.site_page_sections s cross join lateral public.photo_ids_in(s.data) as ids (id)

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
$function$;
