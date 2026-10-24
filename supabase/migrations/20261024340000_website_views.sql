-- The public website's read access (decided 2026-10-24): read-only "web_" views that show only what the website
-- shows: published content and public fields (never drafts, licence numbers, admin users or notes). The website's
-- server reads them with the publishable key as `anon`, which may read these views and nothing else.
-- The views run as their owner (not as anon), so anon needs no access to the tables themselves; each view does its
-- own filtering. One row per language (locale), so German comes as more rows.
-- Step 1, the home page: regions, published treks and published travel guides.

-- Every region (regions have no draft state), with its cover photo.
create view public.web_regions as
select
  r.id,
  r.slug,
  t.locale,
  t.name,
  t.short_name,
  t.tagline,
  t.summary,
  r.max_altitude_m,
  r.website_domain,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.regions r
join public.region_translations t on t.region_id = r.id
left join public.photos p on p.id = r.cover_photo_id;

-- Published treks, as their cards and the trek finder show them.
create view public.web_treks as
select
  tr.id,
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
  r.slug as region_slug,
  rt.name as region_name,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place,
  tr.updated_at
from public.treks tr
join public.trek_translations t on t.trek_id = tr.id
join public.regions r on r.id = tr.region_id
join public.region_translations rt on rt.region_id = r.id and rt.locale = t.locale
left join public.photos p on p.id = tr.cover_photo_id
where tr.status = 'published';

-- Published travel guides whose date has come (a Nepal date), as their cards show them.
create view public.web_travel_guides as
select
  a.id,
  a.slug,
  t.locale,
  t.title,
  t.card_text,
  a.topic,
  -- null: the main site's guide.
  r.slug as site_region_slug,
  a.also_on_main_site,
  a.is_featured,
  a.start_here_position,
  a.published_on,
  a.updated_on,
  t.cover_alt,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.articles a
join public.article_translations t on t.article_id = a.id
left join public.regions r on r.id = a.site_region_id
left join public.photos p on p.id = a.cover_photo_id
where a.status = 'published' and a.published_on <= (now() at time zone 'Asia/Kathmandu')::date;

revoke all on public.web_regions, public.web_treks, public.web_travel_guides from public, authenticated;
grant select on public.web_regions, public.web_treks, public.web_travel_guides to anon;
