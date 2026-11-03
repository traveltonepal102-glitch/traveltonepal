-- Pages per site (decided 2026-11-03): every website has its own fixed pages (Home, the list pages, About, Contact,
-- the legal pages), written for that site only. Nothing is copied from Travel To Nepal: a new site gets its pages as
-- empty drafts (a heading only), and a deleted draft site takes its pages with it.
-- The website still reads only Travel To Nepal's pages (the web_ views below keep to 'ttn') until it is built per site.

-- 1. A page belongs to a site; its slug repeats once per site.
alter table public.site_pages add column site_id text not null default 'ttn' references public.sites (id) on delete cascade;
alter table public.site_pages alter column site_id drop default;
alter table public.site_page_photos add column site_id text not null default 'ttn';
alter table public.site_page_photos alter column site_id drop default;
-- Structured data stays with the main site for now (Super admins add it there), so its rows default to it.
alter table public.page_schemas add column site_id text not null default 'ttn' references public.sites (id) on delete cascade;

alter table public.site_page_photos drop constraint site_page_photos_page_slug_fkey;
alter table public.page_schemas drop constraint page_schemas_site_page_slug_fkey;
alter table public.site_page_photos drop constraint site_page_photos_pkey;
alter table public.site_pages drop constraint site_pages_pkey;

alter table public.site_pages add primary key (site_id, slug);
alter table public.site_page_photos add primary key (site_id, page_slug, position);
alter table public.site_page_photos
  add constraint site_page_photos_page_fkey foreign key (site_id, page_slug) references public.site_pages (site_id, slug) on delete cascade;
alter table public.page_schemas
  add constraint page_schemas_site_page_fkey foreign key (site_id, site_page_slug) references public.site_pages (site_id, slug) on delete cascade;

-- 2. Every site has all its pages: made with the site, as empty drafts with a heading.
create function public.create_site_pages()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.site_pages (site_id, slug, heading)
  select new.id, page.slug, page.heading
  from (values
    ('home', new.name),
    ('treks', 'Treks'),
    ('regions', 'Regions'),
    ('travel-guides', 'Travel guides'),
    ('about', 'About us'),
    ('contact', 'Contact'),
    ('terms', 'Terms and conditions'),
    ('privacy', 'Privacy policy'),
    ('impressum', 'Impressum'),
    ('cookies', 'Cookie settings')
  ) as page (slug, heading)
  on conflict (site_id, slug) do nothing;
  return new;
end;
$$;

revoke execute on function public.create_site_pages() from public, anon, authenticated;

create trigger sites_create_pages after insert on public.sites for each row execute function public.create_site_pages();

-- The region sites added before this migration get theirs now.
insert into public.site_pages (site_id, slug, heading)
select s.id, page.slug, case when page.slug = 'home' then s.name else page.heading end
from public.sites s
cross join (values
  ('home', ''),
  ('treks', 'Treks'),
  ('regions', 'Regions'),
  ('travel-guides', 'Travel guides'),
  ('about', 'About us'),
  ('contact', 'Contact'),
  ('terms', 'Terms and conditions'),
  ('privacy', 'Privacy policy'),
  ('impressum', 'Impressum'),
  ('cookies', 'Cookie settings')
) as page (slug, heading)
where s.kind = 'region'
on conflict (site_id, slug) do nothing;

-- 3. Saving: the same functions with the site last (default 'ttn', so the admin that is running keeps working).
drop function public.save_site_pages(jsonb);
drop function public.save_site_page(text, jsonb, jsonb);

create function public.save_site_page(p_slug text, p_page jsonb, p_photo_ids jsonb, p_site_id text default 'ttn')
returns void
language plpgsql
set search_path = ''
as $$
declare
  founder uuid := nullif(p_page ->> 'founder_author_id', '')::uuid;
begin
  if founder is not null and not exists (select 1 from public.authors where id = founder and kind = 'office') then
    raise exception 'founder_kind' using errcode = '22023';
  end if;

  update public.site_pages
  set eyebrow = p_page ->> 'eyebrow',
      heading = p_page ->> 'heading',
      intro = p_page ->> 'intro',
      seo_title = p_page ->> 'seo_title',
      seo_description = p_page ->> 'seo_description',
      seo_keyword = p_page ->> 'seo_keyword',
      share_photo_id = nullif(p_page ->> 'share_photo_id', '')::uuid,
      canonical_path = coalesce(p_page ->> 'canonical_path', ''),
      hide_from_google = coalesce((p_page ->> 'hide_from_google')::boolean, false),
      photo_id = nullif(p_page ->> 'photo_id', '')::uuid,
      founder_author_id = founder,
      content = p_page -> 'content',
      updated_at = now(),
      updated_by = auth.uid()
  where site_id = p_site_id and slug = p_slug;

  if not found then
    raise exception 'Not allowed to change this page' using errcode = '42501';
  end if;

  delete from public.site_page_photos where site_id = p_site_id and page_slug = p_slug;
  insert into public.site_page_photos (site_id, page_slug, position, photo_id)
  select p_site_id, p_slug, n, photo_id::uuid
  from jsonb_array_elements_text(p_photo_ids) with ordinality as p (photo_id, n)
  where n <= 8 and photo_id <> '';
end;
$$;

create function public.save_site_pages(p_pages jsonb, p_site_id text default 'ttn')
returns void
language plpgsql
set search_path = ''
as $$
declare
  page_slug text;
begin
  if jsonb_typeof(p_pages) <> 'object' then
    raise exception 'Pages must be an object' using errcode = '22023';
  end if;
  for page_slug in select jsonb_object_keys(p_pages) loop
    perform public.save_site_page(page_slug, p_pages -> page_slug, '[]'::jsonb, p_site_id);
  end loop;
end;
$$;

revoke all on function public.save_site_page(text, jsonb, jsonb, text), public.save_site_pages(jsonb, text) from public, anon;
grant execute on function public.save_site_page(text, jsonb, jsonb, text), public.save_site_pages(jsonb, text) to authenticated;

-- 4. The website: Travel To Nepal's pages only, as before (the same columns; the region websites come later).
create or replace view public.web_site_pages as
 SELECT s.slug,
    s.eyebrow,
    s.heading,
    s.intro,
    s.seo_title,
    s.seo_description,
    s.seo_keyword,
    s.content,
    s.updated_at,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    fa.name AS founder_name,
    ft.job_title AS founder_role,
        CASE
            WHEN fa.photo_consent THEN fp.id
            ELSE NULL::uuid
        END AS founder_photo_id,
        CASE
            WHEN fa.photo_consent THEN fp.variant_widths
            ELSE NULL::integer[]
        END AS founder_photo_variant_widths,
        CASE
            WHEN fa.photo_consent THEN fp.placeholder
            ELSE NULL::text
        END AS founder_photo_placeholder,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', sp.id, 'width', sp.width, 'height', sp.height, 'variant_widths', sp.variant_widths, 'file_name', sp.file_name, 'placeholder', sp.placeholder, 'place', sp.place, 'position', pp."position") ORDER BY pp."position") AS jsonb_agg
           FROM site_page_photos pp
             JOIN photos sp ON sp.id = pp.photo_id
          WHERE pp.site_id = s.site_id AND pp.page_slug = s.slug), '[]'::jsonb) AS story_photos,
    sh.id AS share_id,
    sh.variant_widths AS share_variant_widths,
    sh.place AS share_place,
    p.file_name AS cover_file_name,
    CASE WHEN fa.photo_consent THEN fp.file_name ELSE NULL::text END AS founder_photo_file_name,
    sh.file_name AS share_file_name,
    s.created_at AS published_at
   FROM site_pages s
     LEFT JOIN photos p ON p.id = s.photo_id
     LEFT JOIN authors fa ON fa.id = s.founder_author_id
     LEFT JOIN author_translations ft ON ft.author_id = fa.id AND ft.locale = 'en'::text
     LEFT JOIN photos fp ON fp.id = fa.photo_id
     LEFT JOIN photos sh ON sh.id = s.share_photo_id
  WHERE s.site_id = 'ttn'::text;

create or replace view public.web_page_seo_overrides as
 SELECT 'page'::text AS page_kind,
    s.slug AS page_slug,
    'en'::text AS locale,
    s.canonical_path,
    s.hide_from_google
   FROM site_pages s
  WHERE s.site_id = 'ttn'::text AND (s.canonical_path <> ''::text OR s.hide_from_google)
UNION ALL
 SELECT 'trek'::text AS page_kind,
    w.slug AS page_slug,
    w.locale,
    t.canonical_path,
    t.hide_from_google
   FROM trek_translations t
     JOIN web_trek_pages w ON w.id = t.trek_id AND w.locale = t.locale
  WHERE t.canonical_path <> ''::text OR t.hide_from_google
UNION ALL
 SELECT 'region'::text AS page_kind,
    w.slug AS page_slug,
    w.locale,
    t.canonical_path,
    t.hide_from_google
   FROM region_translations t
     JOIN web_region_pages w ON w.id = t.region_id AND w.locale = t.locale
  WHERE t.canonical_path <> ''::text OR t.hide_from_google
UNION ALL
 SELECT 'guide'::text AS page_kind,
    w.slug AS page_slug,
    w.locale,
    t.canonical_path,
    t.hide_from_google
   FROM article_translations t
     JOIN web_travel_guide_pages w ON w.id = t.article_id AND w.locale = t.locale
  WHERE t.canonical_path <> ''::text OR t.hide_from_google;

create or replace view public.web_page_schemas as
 SELECT 'page'::text AS page_kind,
    s.site_page_slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
  WHERE s.is_shown AND s.site_page_slug IS NOT NULL AND s.site_id = 'ttn'::text
UNION ALL
 SELECT 'trek'::text AS page_kind,
    t.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN treks t ON t.id = s.trek_id
  WHERE s.is_shown AND (EXISTS ( SELECT 1
           FROM web_trek_pages w
          WHERE w.id = t.id))
UNION ALL
 SELECT 'region'::text AS page_kind,
    r.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN regions r ON r.id = s.region_id
  WHERE s.is_shown AND (EXISTS ( SELECT 1
           FROM web_region_pages w
          WHERE w.id = r.id))
UNION ALL
 SELECT 'guide'::text AS page_kind,
    a.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN articles a ON a.id = s.article_id
  WHERE s.is_shown AND (EXISTS ( SELECT 1
           FROM web_travel_guide_pages w
          WHERE w.id = a.id));
