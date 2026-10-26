-- The trek page's "Practical field knowledge" topics show the photo the admin picked for each (photoId). The view
-- keeps its columns and anon's grant ("create or replace view"); know_topics now carries each topic's photo.
create or replace view public.web_trek_pages as
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
  -- Each topic with its photo (the admin's photoId), as the other views name photo columns; a video id stays as typed.
  coalesce(
    (
      select jsonb_agg(
        topic.item || jsonb_build_object(
          'photo', case when ph.id is null then null else jsonb_build_object(
            'cover_id', ph.id,
            'cover_width', ph.width,
            'cover_height', ph.height,
            'cover_variant_widths', ph.variant_widths,
            'cover_placeholder', ph.placeholder,
            'cover_place', ph.place
          ) end
        )
        order by topic.position
      )
      from jsonb_array_elements(case when jsonb_typeof(t.know_topics) = 'array' then t.know_topics else '[]'::jsonb end)
        with ordinality as topic (item, position)
      left join public.photos ph
        on ph.id = case
          when (topic.item ->> 'photoId') ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then (topic.item ->> 'photoId')::uuid
        end
    ),
    '[]'::jsonb
  ) as know_topics,
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
