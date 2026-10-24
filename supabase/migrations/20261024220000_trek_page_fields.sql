-- Treks: every field the website's trek page shows, matching the reworked trek editor design (Admin-trek-editor:
-- 17 sections in page order). Adds each section's heading and line under it, the season, trek style and park tags,
-- the "Kathmandu return" note, the high point and an optional higher side trip, the "Activity" box, the route line,
-- the elevation note, the trek's start and end, the field guide ("Trek guide: season, facilities and safety"),
-- YouTube videos and the printable PDF map. The itinerary text, each day's text and FAQ answers become rich text.
-- Two more shared sections: "Why we don't include meals" and "Booking box at the end".

-- Plain text (paragraphs split by blank lines) → a rich text document; used only by this migration.
create function pg_temp.plain_to_rich(p_text text)
returns jsonb
language sql
immutable
as $$
  select jsonb_build_object('type', 'doc', 'content', coalesce(
    (
      select jsonb_agg(
        jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(
          jsonb_build_object('type', 'text', 'text', regexp_replace(btrim(part), '\s*\n\s*', ' ', 'g'))
        ))
        order by n
      )
      from regexp_split_to_table(coalesce(p_text, ''), '\n\s*\n') with ordinality as s (part, n)
      where btrim(part) <> ''
    ),
    '[{"type": "paragraph"}]'::jsonb
  ));
$$;

alter table public.trek_translations
  add column current_season text not null default '' check (char_length(current_season) <= 20),
  add column category text not null default '' check (char_length(category) <= 40),
  add column protected_area text not null default '' check (char_length(protected_area) <= 60),
  add column days_note text not null default '' check (char_length(days_note) <= 40),
  add column high_point text not null default '' check (char_length(high_point) <= 60),
  add column optional_high_point text not null default '' check (char_length(optional_high_point) <= 60),
  add column activity text not null default 'Trekking / hiking' check (char_length(activity) <= 60),
  add column suitability_heading text not null default 'Is this trek for you?' check (char_length(suitability_heading) <= 120),
  add column itinerary_heading text not null default 'day-by-day itinerary' check (char_length(itinerary_heading) <= 120),
  add column route_line text not null default '' check (char_length(route_line) <= 160),
  add column inclusions_heading text not null default 'What’s covered · What’s not included' check (char_length(inclusions_heading) <= 120),
  add column guides_heading text not null default 'Meet your trek guide' check (char_length(guides_heading) <= 120),
  add column elevation_heading text not null default 'Route and elevation profile' check (char_length(elevation_heading) <= 120),
  add column elevation_note text not null default '' check (char_length(elevation_note) <= 200),
  add column route_map_heading text not null default '' check (char_length(route_map_heading) <= 120),
  add column trek_start text not null default '' check (char_length(trek_start) <= 80),
  add column trek_end text not null default '' check (char_length(trek_end) <= 80),
  add column pricing_heading text not null default 'Group rates by team size' check (char_length(pricing_heading) <= 120),
  add column pricing_intro text not null default 'Book directly with our Kathmandu team, with no middlemen. Every trek is private, so you choose your own start date.' check (char_length(pricing_intro) <= 300),
  add column packing_heading text not null default '' check (char_length(packing_heading) <= 120),
  add column know_heading text not null default '' check (char_length(know_heading) <= 120),
  add column know_intro text not null default 'Essential insights from our local trek leaders.' check (char_length(know_intro) <= 200),
  add column faq_heading text not null default '' check (char_length(faq_heading) <= 120),
  add column similar_heading text not null default 'Similar trekking options in Nepal' check (char_length(similar_heading) <= 120),
  add column similar_intro text not null default 'Treks planned with you and led by local guides.' check (char_length(similar_intro) <= 200),
  -- [{ "icon", "title", "points": [{ "title", "text" }], "note", "photoId", "videoId" }]
  add column know_topics jsonb not null default '[]' check (jsonb_typeof(know_topics) = 'array' and jsonb_array_length(know_topics) <= 8),
  -- [{ "youtubeId", "title", "inGallery", "inGuide" }]
  add column videos jsonb not null default '[]' check (jsonb_typeof(videos) = 'array' and jsonb_array_length(videos) <= 10);

alter table public.treks
  -- A higher side trip some trekkers add, e.g. Tserko Ri (its name is in the translations).
  add column optional_high_point_m integer check (optional_high_point_m between 500 and 9000),
  -- The printable map in the trek-files bucket (pdf-maps/<uuid>.pdf); "Download PDF map" shows only with one.
  add column pdf_map_path text check (pdf_map_path ~ '^pdf-maps/[0-9a-f-]{36}\.pdf$');

-- Rich text: the text above the days, each day's text and FAQ answers.
alter table public.trek_translations drop constraint trek_translations_itinerary_intro_check;
alter table public.trek_translations alter column itinerary_intro drop default;
alter table public.trek_translations alter column itinerary_intro type jsonb using pg_temp.plain_to_rich(itinerary_intro);
alter table public.trek_translations alter column itinerary_intro set default '{"type": "doc", "content": [{"type": "paragraph"}]}'::jsonb;
alter table public.trek_translations add constraint trek_translations_itinerary_intro_check
  check (jsonb_typeof(itinerary_intro) = 'object' and octet_length(itinerary_intro::text) <= 100000);

alter table public.trek_day_translations drop constraint trek_day_translations_description_check;
alter table public.trek_day_translations alter column description drop default;
alter table public.trek_day_translations alter column description type jsonb using pg_temp.plain_to_rich(description);
alter table public.trek_day_translations alter column description set default '{"type": "doc", "content": [{"type": "paragraph"}]}'::jsonb;
alter table public.trek_day_translations add constraint trek_day_translations_description_check
  check (jsonb_typeof(description) = 'object' and octet_length(description::text) <= 100000);

update public.trek_translations t
set faqs = (
  select coalesce(jsonb_agg(
    jsonb_set(topic, '{items}', (
      select coalesce(jsonb_agg(
        case when jsonb_typeof(item -> 'answer') = 'string' then jsonb_set(item, '{answer}', pg_temp.plain_to_rich(item ->> 'answer')) else item end
        order by n
      ), '[]'::jsonb)
      from jsonb_array_elements(topic -> 'items') with ordinality as i (item, n)
    ))
    order by m
  ), '[]'::jsonb)
  from jsonb_array_elements(t.faqs) with ordinality as f (topic, m)
)
where jsonb_array_length(t.faqs) > 0;

-- Two more shared sections a trek can switch off.
alter table public.treks drop constraint treks_hidden_shared_sections_check;
alter table public.treks add constraint treks_hidden_shared_sections_check
  check (hidden_shared_sections <@ array[
    'founder', 'consultation', 'customization', 'meals', 'why_book', 'credentials', 'reviews', 'differentiators',
    'booking_form', 'booking_cta', 'newsletter'
  ]::text[]);

-- Printable maps: public (visitors download them); admins upload through a one-time link and remove them.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('trek-files', 'trek-files', true, 15728640, array['application/pdf']);

create policy "Admins manage trek files" on storage.objects
  for all to authenticated
  using (bucket_id = 'trek-files' and (select public.is_admin()))
  with check (bucket_id = 'trek-files' and (select public.is_admin()));

-- save_trek saves the new fields (p_trek: optional_high_point_m, pdf_map_path; p_text: the new text and JSON
-- columns; itinerary_intro and each day's description are rich text). Same arguments, same grants.

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

  if jsonb_array_length(coalesce(p_trek -> 'similar_trek_ids', '[]')) > 4 then
    raise exception 'A trek can suggest up to 4 similar treks' using errcode = '22023';
  end if;

  if jsonb_array_length(coalesce(p_trek -> 'guide_ids', '[]')) > 10 then
    raise exception 'A trek can show up to 10 guides' using errcode = '22023';
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
      seasons, tags, is_popular, cover_photo_id, meal_budget_min_usd, meal_budget_max_usd, has_fixed_dates, map_place, my_maps_id, hidden_shared_sections,
      optional_high_point_m, pdf_map_path, updated_by
    )
    values (
      p_trek ->> 'slug', region, (p_trek ->> 'status')::public.trek_status,
      (p_trek ->> 'difficulty')::public.trek_difficulty, (p_trek ->> 'grade')::smallint,
      (p_trek ->> 'days')::smallint, (p_trek ->> 'max_altitude_m')::integer, (p_trek ->> 'distance_km')::integer,
      array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
      array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
      (p_trek ->> 'is_popular')::boolean, nullif(p_trek ->> 'cover_photo_id', '')::uuid,
      (p_trek ->> 'meal_budget_min_usd')::integer, (p_trek ->> 'meal_budget_max_usd')::integer,
      (p_trek ->> 'has_fixed_dates')::boolean, p_trek ->> 'map_place', nullif(p_trek ->> 'my_maps_id', ''),
      array(select jsonb_array_elements_text(coalesce(p_trek -> 'hidden_shared_sections', '[]'))),
      (p_trek ->> 'optional_high_point_m')::integer, nullif(p_trek ->> 'pdf_map_path', ''), auth.uid()
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
        hidden_shared_sections = array(select jsonb_array_elements_text(coalesce(p_trek -> 'hidden_shared_sections', '[]'))),
        optional_high_point_m = (p_trek ->> 'optional_high_point_m')::integer,
        pdf_map_path = nullif(p_trek ->> 'pdf_map_path', ''),
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
    included, excluded, meal_trail_tips, meal_teahouse_notes, packing_intro, packing_groups, faqs,
    headline, short_name, seo_keyword, seo_title, seo_description, guides_intro,
    current_season, category, protected_area, days_note, high_point, optional_high_point, activity, suitability_heading, itinerary_heading, route_line, inclusions_heading, guides_heading, elevation_heading, elevation_note, route_map_heading, trek_start, trek_end, pricing_heading, pricing_intro, packing_heading, know_heading, know_intro, faq_heading, similar_heading, similar_intro,
    know_topics, videos
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'summary', p_text ->> 'card_badge', p_text -> 'photo_badges',
    p_text ->> 'start_finish', p_text ->> 'daily_walking', p_text ->> 'guide_ratio', p_text ->> 'season_label',
    p_text ->> 'accommodation', p_text ->> 'transport',
    p_text -> 'introduction', p_text ->> 'highlights_heading', p_text -> 'highlights',
    p_text ->> 'suitability_intro', p_text -> 'suitability_points', p_text -> 'itinerary_intro',
    p_text -> 'included', p_text -> 'excluded', p_text -> 'meal_trail_tips', p_text -> 'meal_teahouse_notes',
    p_text ->> 'packing_intro', p_text -> 'packing_groups', p_text -> 'faqs',
    p_text ->> 'headline', p_text ->> 'short_name', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description', p_text ->> 'guides_intro',
    p_text ->> 'current_season', p_text ->> 'category', p_text ->> 'protected_area', p_text ->> 'days_note', p_text ->> 'high_point', p_text ->> 'optional_high_point', p_text ->> 'activity', p_text ->> 'suitability_heading', p_text ->> 'itinerary_heading', p_text ->> 'route_line', p_text ->> 'inclusions_heading', p_text ->> 'guides_heading', p_text ->> 'elevation_heading', p_text ->> 'elevation_note', p_text ->> 'route_map_heading', p_text ->> 'trek_start', p_text ->> 'trek_end', p_text ->> 'pricing_heading', p_text ->> 'pricing_intro', p_text ->> 'packing_heading', p_text ->> 'know_heading', p_text ->> 'know_intro', p_text ->> 'faq_heading', p_text ->> 'similar_heading', p_text ->> 'similar_intro',
    p_text -> 'know_topics', p_text -> 'videos'
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
      faqs = excluded.faqs,
      headline = excluded.headline,
      short_name = excluded.short_name,
      seo_keyword = excluded.seo_keyword,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      guides_intro = excluded.guides_intro,
      current_season = excluded.current_season,
      category = excluded.category,
      protected_area = excluded.protected_area,
      days_note = excluded.days_note,
      high_point = excluded.high_point,
      optional_high_point = excluded.optional_high_point,
      activity = excluded.activity,
      suitability_heading = excluded.suitability_heading,
      itinerary_heading = excluded.itinerary_heading,
      route_line = excluded.route_line,
      inclusions_heading = excluded.inclusions_heading,
      guides_heading = excluded.guides_heading,
      elevation_heading = excluded.elevation_heading,
      elevation_note = excluded.elevation_note,
      route_map_heading = excluded.route_map_heading,
      trek_start = excluded.trek_start,
      trek_end = excluded.trek_end,
      pricing_heading = excluded.pricing_heading,
      pricing_intro = excluded.pricing_intro,
      packing_heading = excluded.packing_heading,
      know_heading = excluded.know_heading,
      know_intro = excluded.know_intro,
      faq_heading = excluded.faq_heading,
      similar_heading = excluded.similar_heading,
      similar_intro = excluded.similar_intro,
      know_topics = excluded.know_topics,
      videos = excluded.videos,
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
  select i.id, p_locale, i.day ->> 'place', i.day ->> 'title', i.day ->> 'subtitle', i.day ->> 'duration', i.day -> 'description'
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

  -- Similar treks in order (never the trek itself). An id that isn't a trek fails the foreign key.
  delete from public.trek_similar where trek_id = saved_id;
  insert into public.trek_similar (trek_id, similar_trek_id, position)
  select saved_id, s.similar_id::uuid, (s.n - 1)::smallint
  from jsonb_array_elements_text(coalesce(p_trek -> 'similar_trek_ids', '[]')) with ordinality as s (similar_id, n)
  where s.similar_id::uuid <> saved_id;

  -- Guides in page order. An id that isn't a guide fails the foreign key.
  delete from public.trek_guides where trek_id = saved_id;
  insert into public.trek_guides (trek_id, guide_id, position)
  select saved_id, g.guide_id::uuid, (g.n - 1)::smallint
  from jsonb_array_elements_text(coalesce(p_trek -> 'guide_ids', '[]')) with ordinality as g (guide_id, n);

  return saved_id;
end;
$$;

-- Headings that name the trek, for every trek (as the website writes them).
update public.trek_translations t
set route_map_heading = t.name || ' route map',
    faq_heading = 'Frequently asked questions for the ' || t.name,
    packing_heading = coalesce(nullif(t.short_name, ''), t.name) || ' packing list',
    current_season = '2026/2027'
where t.locale = 'en';

-- Langtang Valley, as on the website.
update public.treks set optional_high_point_m = 4984 where slug = 'langtang-valley';

update public.trek_translations t
set category = 'Classic valley trek',
    protected_area = 'Langtang National Park',
    days_note = 'Kathmandu return',
    high_point = 'Kyanjin Ri',
    optional_high_point = 'Tserko Ri',
    route_line = 'Langtang Valley Trek route overview (Kathmandu – Syabrubesi – Kyanjin Gompa)',
    elevation_note = 'You sleep no higher than 3,870 m and only day hike to the high point.',
    trek_start = 'Syabrubesi, Rasuwa',
    trek_end = 'Syabrubesi, Rasuwa',
    packing_heading = 'Langtang Trek packing list',
    know_heading = 'Langtang Valley Trek guide: best season, facilities and high-altitude safety',
    know_topics = '[
  {
    "icon": "wb_twilight",
    "title": "Best season and weather windows",
    "points": [
      {
        "title": "Spring (March to May)",
        "text": "warm days and rhododendron forest in bloom."
      },
      {
        "title": "Autumn (October to November)",
        "text": "the clearest skies of the year and stable temperatures."
      }
    ],
    "note": "Winter (Dec–Feb) is clear but very cold at Kyanjin. The monsoon (Jun–Sep) brings rain, leeches and landslide risk on the road.",
    "photoId": null,
    "videoId": null
  },
  {
    "icon": "cottage",
    "title": "Teahouse accommodation and facilities",
    "points": [
      {
        "title": "Rooms",
        "text": "simple twin rooms with foam mattresses and blankets; use your sleeping bag on top."
      },
      {
        "title": "Heating and showers",
        "text": "dining rooms are warmed in the evening; hot showers cost a few dollars."
      },
      {
        "title": "Wi-Fi and power",
        "text": "charging and Wi-Fi are available in most lodges for a small fee."
      }
    ],
    "note": "",
    "photoId": null,
    "videoId": null
  },
  {
    "icon": "soup_kitchen",
    "title": "Food, nutrition and safe water",
    "points": [
      {
        "title": "Dal bhat",
        "text": "rice, lentil soup, vegetables and pickle, with free refills."
      },
      {
        "title": "Trail menus",
        "text": "garlic soup, Tibetan bread, porridge, noodles, pasta and ginger tea."
      },
      {
        "title": "Hydration",
        "text": "drink 3–4 litres a day and treat your water; skip single-use plastic."
      }
    ],
    "note": "",
    "photoId": null,
    "videoId": null
  },
  {
    "icon": "emergency",
    "title": "Emergency plan and helicopter evacuation",
    "points": [
      {
        "title": "Rescue",
        "text": "our Kathmandu office coordinates helicopter evacuation with your insurer if it is ever needed."
      },
      {
        "title": "On the trail",
        "text": "your guide carries a first-aid kit and pulse oximeter and knows the nearest helipads."
      },
      {
        "title": "Insurance",
        "text": "travel insurance covering emergency evacuation is required for every trekker."
      }
    ],
    "note": "",
    "photoId": null,
    "videoId": null
  }
]'::jsonb
from public.treks k
where t.trek_id = k.id and k.slug = 'langtang-valley' and t.locale = 'en';
