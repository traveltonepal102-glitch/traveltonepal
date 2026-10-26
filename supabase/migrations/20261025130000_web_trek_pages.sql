-- The trek page reads the database (decided 2026-10-25), replacing the website's hand-written Langtang page.
-- Public content only, as the other web_ views: never ages, licence numbers, internal team notes or admin users.

-- A published trek has its own page once it has a day-by-day plan. Until then its links offer a WhatsApp inquiry.
-- web_treks gains the flag at the end ("create or replace view" keeps the existing columns and anon's grant).
create or replace view public.web_treks as
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
  tr.updated_at,
  exists (select 1 from public.trek_days d where d.trek_id = tr.id) as has_page
from public.treks tr
join public.trek_translations t on t.trek_id = tr.id
join public.regions r on r.id = tr.region_id
join public.region_translations rt on rt.region_id = r.id and rt.locale = t.locale
left join public.photos p on p.id = tr.cover_photo_id
where tr.status = 'published';

-- The rest of a trek's page, for published treks that have one. Days, group prices and upcoming departure dates
-- come as JSON lists in the admin's order; similar treks only when they are published too.
create view public.web_trek_pages as
select
  tr.id,
  tr.slug,
  t.locale,
  t.headline,
  t.short_name,
  t.seo_title,
  t.seo_description,
  t.category,
  t.protected_area,
  t.current_season,
  t.days_note,
  tr.grade,
  t.high_point,
  t.optional_high_point,
  tr.optional_high_point_m,
  t.introduction,
  t.photo_badges,
  t.highlights_heading,
  t.highlights,
  t.suitability_intro,
  t.suitability_points,
  t.itinerary_intro,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'place', dt.place,
          'title', dt.title,
          'subtitle', dt.subtitle,
          'duration', dt.duration,
          'altitude_m', d.altitude_m,
          'sleep_altitude_m', d.sleep_altitude_m,
          'is_high_point', d.is_high_point,
          'description', dt.description,
          'photo', case when ph.id is null then null else jsonb_build_object(
            'cover_id', ph.id,
            'cover_width', ph.width,
            'cover_height', ph.height,
            'cover_variant_widths', ph.variant_widths,
            'cover_placeholder', ph.placeholder,
            'cover_place', ph.place
          ) end
        )
        order by d.position
      )
      from public.trek_days d
      join public.trek_day_translations dt on dt.day_id = d.id and dt.locale = t.locale
      left join public.photos ph on ph.id = d.photo_id
      where d.trek_id = tr.id
    ),
    '[]'::jsonb
  ) as days,
  t.guides_intro,
  t.included,
  t.excluded,
  tr.meal_budget_min_usd,
  tr.meal_budget_max_usd,
  t.meal_trail_tips,
  t.meal_teahouse_notes,
  t.start_finish,
  tr.distance_km,
  t.daily_walking,
  t.guide_ratio,
  t.accommodation,
  t.transport,
  t.trek_start,
  tr.map_place,
  tr.my_maps_id,
  t.packing_intro,
  t.packing_groups,
  t.know_heading,
  t.know_topics,
  t.faqs,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object('label', pt.label, 'short_label', pt.short_label, 'price_usd', gp.price_usd, 'team', pt.team, 'is_default', gp.is_default)
        order by gp.position
      )
      from public.trek_group_prices gp
      join public.trek_group_price_translations pt on pt.price_id = gp.id and pt.locale = t.locale
      where gp.trek_id = tr.id
    ),
    '[]'::jsonb
  ) as group_prices,
  tr.has_fixed_dates,
  -- From today (Nepal time) on; full dates stay listed so visitors see the season is running.
  coalesce(
    (
      select jsonb_agg(jsonb_build_object('start_date', dep.start_date, 'status', dep.status, 'note', coalesce(dn.note, '')) order by dep.start_date)
      from public.trek_departures dep
      left join public.trek_departure_translations dn on dn.departure_id = dep.id and dn.locale = t.locale
      where dep.trek_id = tr.id and dep.start_date >= (now() at time zone 'Asia/Kathmandu')::date
    ),
    '[]'::jsonb
  ) as departures,
  array(
    select w.slug
    from public.trek_similar s
    join public.treks w on w.id = s.similar_trek_id and w.status = 'published'
    where s.trek_id = tr.id
    order by s.position
  ) as similar_slugs,
  tr.hidden_shared_sections
from public.treks tr
join public.trek_translations t on t.trek_id = tr.id
where tr.status = 'published'
  and exists (select 1 from public.trek_days d where d.trek_id = tr.id);

-- The trek's gallery, in the admin's order (cover_… columns, as the other photo views).
create view public.web_trek_photos as
select
  tr.slug as trek_slug,
  tp.position,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.trek_photos tp
join public.treks tr on tr.id = tp.trek_id and tr.status = 'published'
join public.photos p on p.id = tp.photo_id;

-- "Meet your trek guide": the trek's guides in the admin's order, when they lead treks and agreed to be shown with
-- photo and name. Licence and first-aid certificates show only as valid today or not, never their numbers or dates.
create view public.web_trek_guides as
select
  tr.slug as trek_slug,
  tg.position,
  gt.locale,
  g.id,
  g.name,
  gt.role,
  gt.quote,
  g.home_village,
  g.home_district,
  g.years_guiding,
  g.languages,
  g.badge,
  (g.licence_number <> '' and (g.licence_valid_until is null or g.licence_valid_until >= (now() at time zone 'Asia/Kathmandu')::date))
    as is_licensed,
  ('wfr' = any (g.certificates) and (g.wfr_valid_until is null or g.wfr_valid_until >= (now() at time zone 'Asia/Kathmandu')::date))
    as has_wfr,
  ('first_aid' = any (g.certificates) and (g.first_aid_valid_until is null or g.first_aid_valid_until >= (now() at time zone 'Asia/Kathmandu')::date))
    as has_first_aid,
  array(select c from unnest(g.certificates) as c where c in ('nathm', 'nma', 'language')) as other_certificates,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.trek_guides tg
join public.treks tr on tr.id = tg.trek_id and tr.status = 'published'
join public.trekking_guides g on g.id = tg.guide_id
join public.trekking_guide_translations gt on gt.guide_id = g.id
left join public.photos p on p.id = g.photo_id
where g.can_lead_treks
  and g.photo_consent;

revoke all on public.web_trek_pages, public.web_trek_photos, public.web_trek_guides from public, authenticated;
grant select on public.web_trek_pages, public.web_trek_photos, public.web_trek_guides to anon;

