-- The region page reads the database (decided 2026-10-25), replacing the website's hand-written Langtang page.
-- Public content only, as the other web_ views: never licence numbers, ages, admin users or hidden guides.

-- A region has its own page once its introduction has words in it (rich text with any non-blank text). Until then
-- its links go to its treks. web_regions gains the flag at the end, so the header, home and Regions page know which
-- regions to link to their page ("create or replace view" keeps the existing columns and anon's grant).
create or replace function public.rich_text_has_words(p_doc jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select jsonb_path_exists(p_doc, '$.** ? (@.type == "text" && @.text like_regex "\\S")');
$$;

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
  t.best_for,
  public.rich_text_has_words(t.introduction) as has_page
from public.regions r
join public.region_translations t on t.region_id = r.id
left join public.photos p on p.id = r.cover_photo_id;

-- The rest of a region's page, for regions that have one. Treks and travel guides come through web_treks and
-- web_travel_guides, so only published ones show (by address, in the admin's order).
create view public.web_region_pages as
select
  r.id,
  r.slug,
  t.locale,
  t.seo_title,
  t.seo_description,
  t.hero_highlight,
  t.overview_heading,
  t.introduction,
  t.why_points,
  t.from_kathmandu,
  t.nearest_airport,
  t.permits_details,
  t.where_you_sleep,
  t.season_spring,
  t.season_monsoon,
  t.season_autumn,
  t.season_winter,
  t.faqs,
  (select w.slug from public.web_treks w where w.id = r.featured_trek_id and w.locale = t.locale) as featured_trek_slug,
  t.featured_trek_label,
  t.featured_trek_pitch,
  t.custom_route_pitch,
  coalesce(
    (
      select jsonb_agg(jsonb_build_object('slug', w.slug, 'label', coalesce(nt.label, ''), 'note', coalesce(nt.note, '')) order by n.position)
      from public.region_nearby_treks n
      join public.web_treks w on w.id = n.trek_id and w.locale = t.locale
      left join public.region_nearby_trek_translations nt
        on nt.region_id = n.region_id and nt.trek_id = n.trek_id and nt.locale = t.locale
      where n.region_id = r.id
    ),
    '[]'::jsonb
  ) as nearby_treks,
  array(
    select o.slug
    from public.region_compare c
    join public.regions o on o.id = c.other_region_id
    where c.region_id = r.id
    order by c.position
  ) as compare_slugs,
  -- Pinned first (in pin order), then the newest.
  array(
    select g.slug
    from public.article_regions ar
    join public.web_travel_guides g on g.id = ar.article_id and g.locale = t.locale
    where ar.region_id = r.id
    order by ar.pin_position nulls last, g.published_on desc, g.slug
  ) as travel_guide_slugs
from public.regions r
join public.region_translations t on t.region_id = r.id
where public.rich_text_has_words(t.introduction);

-- The region's gallery, in the admin's order. The photo columns are named as in the other views (cover_…), so the
-- website reads every photo the same way.
create view public.web_region_photos as
select
  r.slug as region_slug,
  rp.position,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.region_photos rp
join public.regions r on r.id = rp.region_id
join public.photos p on p.id = rp.photo_id;

-- "Your guides": every guide who leads treks in the region (Trekking guides), agreed to be shown with photo and
-- name, and isn't switched off on the region. The licence shows only as licensed or not, never its number.
create view public.web_region_guides as
select
  r.slug as region_slug,
  gt.locale,
  g.id,
  g.name,
  gt.role,
  gt.quote,
  g.years_guiding,
  g.languages,
  g.badge,
  (g.licence_number <> '' and (g.licence_valid_until is null or g.licence_valid_until >= (now() at time zone 'Asia/Kathmandu')::date))
    as is_licensed,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.trekking_guide_regions gr
join public.regions r on r.id = gr.region_id
join public.trekking_guides g on g.id = gr.guide_id
join public.trekking_guide_translations gt on gt.guide_id = g.id
left join public.photos p on p.id = g.photo_id
where g.can_lead_treks
  and g.photo_consent
  and not exists (select 1 from public.region_hidden_guides h where h.region_id = gr.region_id and h.guide_id = g.id);

revoke all on public.web_region_pages, public.web_region_photos, public.web_region_guides from public, authenticated;
grant select on public.web_region_pages, public.web_region_photos, public.web_region_guides to anon;

-- A function in a view runs as whoever reads the view (unlike its tables), so anon may run this one.
revoke all on function public.rich_text_has_words(jsonb) from public, authenticated;
grant execute on function public.rich_text_has_words(jsonb) to anon;
