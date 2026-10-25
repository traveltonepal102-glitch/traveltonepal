-- The Regions page reads regions from the database (decided 2026-10-25): web_regions gains what its map, cards
-- and tables show. New columns go at the end ("create or replace view" keeps the existing ones, and anon's
-- select grant, as they are). Public facts only, as before.

create or replace view public.web_regions as
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
  p.place as cover_place,
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
  t.best_for
from public.regions r
join public.region_translations t on t.region_id = r.id
left join public.photos p on p.id = r.cover_photo_id;
