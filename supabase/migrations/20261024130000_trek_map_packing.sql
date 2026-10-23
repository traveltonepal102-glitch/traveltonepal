-- Treks, step 4: Map and packing (data shape: the website's trek page, routeMap and packing).
-- The Google map is built from a place name, or from a Google My Maps id to draw the GPS trail. Only the id is
-- stored, never a URL, so the website builds every map link itself.
-- packing_groups: [{ "title", "icon", "items": [{ "title", "text" }] }] in display order (the packing cards).

alter table public.treks
  -- What the Google map centres on, e.g. "Kyanjin Gompa, Langtang, Nepal" (same in every language).
  add column map_place text not null default '' check (char_length(map_place) <= 120),
  -- From a My Maps share link (…/maps/d/viewer?mid=THIS_PART).
  add column my_maps_id text check (my_maps_id ~ '^[A-Za-z0-9_-]{10,100}$');

alter table public.trek_translations
  add column packing_intro text not null default '' check (char_length(packing_intro) <= 200),
  add column packing_groups jsonb not null default '[]'
    check (jsonb_typeof(packing_groups) = 'array' and jsonb_array_length(packing_groups) <= 6);

-- save_trek also saves the map (p_trek: map_place, my_maps_id) and the packing list (p_text: packing_intro,
-- packing_groups). Same arguments, so the grants stay as they are.

create or replace function public.save_trek(
  p_trek_id uuid, p_locale text, p_trek jsonb, p_text jsonb, p_photos jsonb, p_days jsonb, p_prices jsonb, p_departures jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
  region uuid := (p_trek ->> 'region_id')::uuid;
begin
  if jsonb_array_length(p_prices) > 10 or jsonb_array_length(p_departures) > 100 then
    raise exception 'Too many group prices or departure dates' using errcode = '22023';
  end if;

  if jsonb_array_length(p_days) > 60 then
    raise exception 'A trek can have up to 60 days' using errcode = '22023';
  end if;

  if jsonb_array_length(p_photos -> 'gallery') > 30 then
    raise exception 'A trek can have up to 30 gallery photos' using errcode = '22023';
  end if;

  if p_trek_id is null then
    insert into public.treks (
      slug, region_id, status, difficulty, grade, days, max_altitude_m, distance_km,
      seasons, tags, is_popular, cover_photo_id, meal_budget_min_usd, meal_budget_max_usd, has_fixed_dates, map_place, my_maps_id, updated_by
    )
    values (
      p_trek ->> 'slug', region, (p_trek ->> 'status')::public.trek_status,
      (p_trek ->> 'difficulty')::public.trek_difficulty, (p_trek ->> 'grade')::smallint,
      (p_trek ->> 'days')::smallint, (p_trek ->> 'max_altitude_m')::integer, (p_trek ->> 'distance_km')::integer,
      array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
      array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
      (p_trek ->> 'is_popular')::boolean, nullif(p_trek ->> 'cover_photo_id', '')::uuid,
      (p_trek ->> 'meal_budget_min_usd')::integer, (p_trek ->> 'meal_budget_max_usd')::integer,
      (p_trek ->> 'has_fixed_dates')::boolean, p_trek ->> 'map_place', nullif(p_trek ->> 'my_maps_id', ''), auth.uid()
    )
    returning id into saved_id;
  else
    update public.treks
    set slug = p_trek ->> 'slug',
        region_id = region,
        status = (p_trek ->> 'status')::public.trek_status,
        difficulty = (p_trek ->> 'difficulty')::public.trek_difficulty,
        grade = (p_trek ->> 'grade')::smallint,
        days = (p_trek ->> 'days')::smallint,
        max_altitude_m = (p_trek ->> 'max_altitude_m')::integer,
        distance_km = (p_trek ->> 'distance_km')::integer,
        seasons = array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
        tags = array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
        is_popular = (p_trek ->> 'is_popular')::boolean,
        cover_photo_id = nullif(p_trek ->> 'cover_photo_id', '')::uuid,
        meal_budget_min_usd = (p_trek ->> 'meal_budget_min_usd')::integer,
        meal_budget_max_usd = (p_trek ->> 'meal_budget_max_usd')::integer,
        has_fixed_dates = (p_trek ->> 'has_fixed_dates')::boolean,
        map_place = p_trek ->> 'map_place',
        my_maps_id = nullif(p_trek ->> 'my_maps_id', ''),
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_trek_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Trek not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.trek_translations as t (
    trek_id, locale, name, summary, card_badge, photo_badges,
    start_finish, daily_walking, guide_ratio, season_label, accommodation, transport,
    introduction, highlights_heading, highlights, suitability_intro, suitability_points, itinerary_intro,
    included, excluded, meal_trail_tips, meal_teahouse_notes, packing_intro, packing_groups
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'summary', p_text ->> 'card_badge', p_text -> 'photo_badges',
    p_text ->> 'start_finish', p_text ->> 'daily_walking', p_text ->> 'guide_ratio', p_text ->> 'season_label',
    p_text ->> 'accommodation', p_text ->> 'transport',
    p_text -> 'introduction', p_text ->> 'highlights_heading', p_text -> 'highlights',
    p_text ->> 'suitability_intro', p_text -> 'suitability_points', p_text ->> 'itinerary_intro',
    p_text -> 'included', p_text -> 'excluded', p_text -> 'meal_trail_tips', p_text -> 'meal_teahouse_notes',
    p_text ->> 'packing_intro', p_text -> 'packing_groups'
  )
  on conflict (trek_id, locale) do update
  set name = excluded.name,
      summary = excluded.summary,
      card_badge = excluded.card_badge,
      photo_badges = excluded.photo_badges,
      start_finish = excluded.start_finish,
      daily_walking = excluded.daily_walking,
      guide_ratio = excluded.guide_ratio,
      season_label = excluded.season_label,
      accommodation = excluded.accommodation,
      transport = excluded.transport,
      introduction = excluded.introduction,
      highlights_heading = excluded.highlights_heading,
      highlights = excluded.highlights,
      suitability_intro = excluded.suitability_intro,
      suitability_points = excluded.suitability_points,
      itinerary_intro = excluded.itinerary_intro,
      included = excluded.included,
      excluded = excluded.excluded,
      meal_trail_tips = excluded.meal_trail_tips,
      meal_teahouse_notes = excluded.meal_teahouse_notes,
      packing_intro = excluded.packing_intro,
      packing_groups = excluded.packing_groups,
      updated_at = now();

  update public.photos p
  set place = d.place,
      region_id = coalesce(p.region_id, region),
      updated_at = now()
  from jsonb_to_recordset(p_photos -> 'details') as d (id uuid, place text)
  where p.id = d.id;

  delete from public.trek_photos where trek_id = saved_id;
  insert into public.trek_photos (trek_id, photo_id, position)
  select saved_id, g.photo_id::uuid, (g.n - 1)::smallint
  from jsonb_array_elements_text(p_photos -> 'gallery') with ordinality as g (photo_id, n);

  -- Days: keep the ids the editor sends (so other languages stay attached), add new ones, drop removed ones.
  create temporary table incoming_days on commit drop as
  select coalesce(nullif(d.day ->> 'id', '')::uuid, gen_random_uuid()) as id, (d.n - 1)::smallint as position, d.day
  from jsonb_array_elements(p_days) with ordinality as d (day, n);

  delete from public.trek_days where trek_id = saved_id and id not in (select id from incoming_days);
  -- Cleared first, so moving the highlight to another day never briefly makes two (one per trek is enforced).
  update public.trek_days set is_high_point = false where trek_id = saved_id and is_high_point;

  insert into public.trek_days as k (id, trek_id, position, altitude_m, sleep_altitude_m, is_high_point, photo_id)
  select i.id, saved_id, i.position, (i.day ->> 'altitude_m')::integer, (i.day ->> 'sleep_altitude_m')::integer,
         (i.day ->> 'is_high_point')::boolean, nullif(i.day ->> 'photo_id', '')::uuid
  from incoming_days i
  on conflict (id) do update
  set position = excluded.position,
      altitude_m = excluded.altitude_m,
      sleep_altitude_m = excluded.sleep_altitude_m,
      is_high_point = excluded.is_high_point,
      photo_id = excluded.photo_id
  -- An id from another trek is never taken over.
  where k.trek_id = saved_id;

  insert into public.trek_day_translations as t (day_id, locale, place, title, subtitle, duration, description)
  select i.id, p_locale, i.day ->> 'place', i.day ->> 'title', i.day ->> 'subtitle', i.day ->> 'duration', i.day ->> 'description'
  from incoming_days i
  join public.trek_days k on k.id = i.id and k.trek_id = saved_id
  on conflict (day_id, locale) do update
  set place = excluded.place,
      title = excluded.title,
      subtitle = excluded.subtitle,
      duration = excluded.duration,
      description = excluded.description;

  -- Group prices: same pattern as days (ids kept so other languages stay attached; one "Most popular").
  create temporary table incoming_prices on commit drop as
  select coalesce(nullif(p.price ->> 'id', '')::uuid, gen_random_uuid()) as id, (p.n - 1)::smallint as position, p.price
  from jsonb_array_elements(p_prices) with ordinality as p (price, n);

  delete from public.trek_group_prices where trek_id = saved_id and id not in (select id from incoming_prices);
  update public.trek_group_prices set is_default = false where trek_id = saved_id and is_default;

  insert into public.trek_group_prices as g (id, trek_id, position, price_usd, is_default)
  select i.id, saved_id, i.position, (i.price ->> 'price_usd')::integer, (i.price ->> 'is_default')::boolean
  from incoming_prices i
  on conflict (id) do update
  set position = excluded.position, price_usd = excluded.price_usd, is_default = excluded.is_default
  where g.trek_id = saved_id;

  insert into public.trek_group_price_translations as t (price_id, locale, label, short_label, team)
  select i.id, p_locale, i.price ->> 'label', i.price ->> 'short_label', i.price ->> 'team'
  from incoming_prices i
  join public.trek_group_prices g on g.id = i.id and g.trek_id = saved_id
  on conflict (price_id, locale) do update
  set label = excluded.label, short_label = excluded.short_label, team = excluded.team;

  -- The "From" price on cards and lists is the Most popular group's price.
  update public.treks
  set price_from_usd = (select price_usd from public.trek_group_prices where trek_id = saved_id and is_default)
  where id = saved_id;

  -- Departure dates: one per day per trek; past dates stay here and are hidden on the website.
  create temporary table incoming_departures on commit drop as
  select coalesce(nullif(d.departure ->> 'id', '')::uuid, gen_random_uuid()) as id, d.departure
  from jsonb_array_elements(p_departures) as d (departure);

  delete from public.trek_departures where trek_id = saved_id and id not in (select id from incoming_departures);

  insert into public.trek_departures as k (id, trek_id, start_date, is_guaranteed)
  select i.id, saved_id, (i.departure ->> 'start_date')::date, (i.departure ->> 'is_guaranteed')::boolean
  from incoming_departures i
  on conflict (id) do update
  set start_date = excluded.start_date, is_guaranteed = excluded.is_guaranteed
  where k.trek_id = saved_id;

  insert into public.trek_departure_translations as t (departure_id, locale, note)
  select i.id, p_locale, i.departure ->> 'note'
  from incoming_departures i
  join public.trek_departures k on k.id = i.id and k.trek_id = saved_id
  on conflict (departure_id, locale) do update set note = excluded.note;

  return saved_id;
end;
$$;


-- Langtang Valley's map and packing list, as on the website.
update public.treks set map_place = 'Kyanjin Gompa, Langtang, Nepal' where slug = 'langtang-valley';

update public.trek_translations t
set packing_intro = 'Tested gear for the valley: −10 °C nights at Kyanjin to 25 °C days in the forest.',
    packing_groups = '[
      { "title": "Clothing and layering", "icon": "apparel", "items": [
        { "title": "Base layers", "text": "2–3 merino or synthetic tops and bottoms." },
        { "title": "Fleece mid-layer", "text": "a warm fleece or softshell." },
        { "title": "Down jacket", "text": "rated to about −10 °C for evenings at Kyanjin." },
        { "title": "Waterproof shell", "text": "jacket and trousers for rain and wind." }
      ] },
      { "title": "Footwear and trail care", "icon": "footprint", "items": [
        { "title": "Trekking boots", "text": "waterproof, broken in, with ankle support." },
        { "title": "Camp shoes", "text": "light trainers or sandals for the teahouse." },
        { "title": "Socks", "text": "4–5 pairs of cushioned trekking socks." },
        { "title": "Gaiters", "text": "useful for spring mud on the lower trail." }
      ] },
      { "title": "Gear and packs", "icon": "backpack", "items": [
        { "title": "Daypack (25–35 L)", "text": "with a rain cover for layers, water and snacks." },
        { "title": "Duffel bag", "text": "carried by your porter (max 15 kg)." },
        { "title": "Sleeping bag", "text": "comfort to −10 °C (you can rent one in Kathmandu)." },
        { "title": "Trekking poles and headlamp", "text": "for the descent and the sunrise hike." }
      ] },
      { "title": "Health, hygiene and water", "icon": "medical_services", "items": [
        { "title": "Water purification", "text": "tablets or a UV pen, plus two 1 L bottles." },
        { "title": "Medical kit", "text": "blister plasters, painkillers, rehydration salts." },
        { "title": "Sun protection", "text": "SPF 50 sunscreen and lip balm." },
        { "title": "Hygiene", "text": "wet wipes, hand sanitizer and a quick-dry towel." }
      ] }
    ]'::jsonb
from public.treks k
where t.trek_id = k.id and k.slug = 'langtang-valley' and t.locale = 'en';
