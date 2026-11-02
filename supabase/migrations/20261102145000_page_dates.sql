-- Published and modified dates on every page (2026-11-02), for Google and SEO tools: the website sends them as
-- datePublished / dateModified in each page's JSON-LD and as article:published_time / article:modified_time.
-- Modified is the last save (updated_at, which every save_* function sets). Published is:
--   a trek: the first time it was published (treks.published_at, set by the trigger below; the treks published
--           before it existed take the day they were created);
--   a region: the day it was created (a region has no status: its page shows once its introduction is written);
--   a fixed page: the day it was seeded (site_pages.created_at; all ten were seeded on 2026-10-26).
-- Travel guides already have theirs (articles.published_on / updated_on). The views send the new columns last,
-- rebuilt from the live definitions (20261031120000_photo_file_names.sql).

alter table public.treks add column published_at timestamptz;

update public.treks set published_at = created_at where status = 'published';

-- Sets published_at the first time a trek is published; hiding and publishing it again keeps the first date.
create function public.set_trek_published_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'published' and new.published_at is null then
    new.published_at := now();
  end if;
  return new;
end;
$$;

revoke all on function public.set_trek_published_at() from public, anon, authenticated;

create trigger treks_set_published_at
before insert or update of status on public.treks
for each row execute function public.set_trek_published_at();

alter table public.site_pages add column created_at timestamptz not null default now();

update public.site_pages set created_at = least(updated_at, timestamptz '2026-10-26 00:00:00+05:45');

create or replace view public.web_regions as
 SELECT r.id,
    r.slug,
    t.locale,
    t.name,
    t.short_name,
    t.tagline,
    t.summary,
    r.max_altitude_m,
    r.website_domain,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    r.district,
    r.latitude,
    r.longitude,
    r.difficulty,
    r.is_flight,
    r.month_ratings,
    t.trek_length,
    t.getting_there,
    t.getting_there_details,
    t.permits,
    t.best_for,
    rich_text_has_words(t.introduction) AS has_page,
    p.file_name AS cover_file_name,
    r.created_at AS published_at,
    GREATEST(r.updated_at, t.updated_at) AS updated_at
   FROM regions r
     JOIN region_translations t ON t.region_id = r.id
     LEFT JOIN photos p ON p.id = r.cover_photo_id;

create or replace view public.web_treks as
 SELECT tr.id,
    tr.slug,
    t.locale,
    t.name,
    t.summary,
    t.card_badge,
    t.season_label,
    tr.days,
    tr.difficulty,
    tr.max_altitude_m,
    tr.seasons,
    tr.tags,
    tr.is_popular,
    tr.has_fixed_dates,
    tr.price_from_usd,
    r.slug AS region_slug,
    rt.name AS region_name,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    tr.updated_at,
    (EXISTS ( SELECT 1
           FROM trek_days d
          WHERE d.trek_id = tr.id)) AS has_page,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('slug', o.slug, 'name', ot.name) ORDER BY x."position") AS jsonb_agg
           FROM ( SELECT tr.region_id,
                    0 AS "position"
                UNION ALL
                 SELECT rr.region_id,
                    rr."position"
                   FROM trek_regions rr
                  WHERE rr.trek_id = tr.id) x
             JOIN regions o ON o.id = x.region_id
             JOIN region_translations ot ON ot.region_id = o.id AND ot.locale = t.locale), '[]'::jsonb) AS route_regions,
    p.file_name AS cover_file_name,
    COALESCE(tr.published_at, tr.created_at) AS published_at
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
     JOIN regions r ON r.id = tr.region_id
     JOIN region_translations rt ON rt.region_id = r.id AND rt.locale = t.locale
     LEFT JOIN photos p ON p.id = tr.cover_photo_id
  WHERE tr.status = 'published'::trek_status;

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
          WHERE pp.page_slug = s.slug), '[]'::jsonb) AS story_photos,
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
     LEFT JOIN photos sh ON sh.id = s.share_photo_id;
