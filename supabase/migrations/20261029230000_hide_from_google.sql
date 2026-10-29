-- "Hide from Google" (Part C of the SEO work): a page can ask search engines not to list it (noindex, follow: its
-- links still count) and leaves sitemap.xml. Kept beside the Google title and description, per language. The home
-- page can't be hidden. Also replaces web_canonical_overrides with web_page_seo_overrides: the pages the website
-- shows that point at another page or are hidden, read once by the website.

alter table public.trek_translations add column hide_from_google boolean not null default false;
alter table public.region_translations add column hide_from_google boolean not null default false;
alter table public.article_translations add column hide_from_google boolean not null default false;
alter table public.site_pages add column hide_from_google boolean not null default false check (slug <> 'home' or not hide_from_google);

-- save_trek also saves "Hide from Google" (p_text: hide_from_google). Rebuilt from the live definition.
CREATE OR REPLACE FUNCTION public.save_trek(p_trek_id uuid, p_locale text, p_trek jsonb, p_text jsonb, p_photos jsonb, p_days jsonb, p_prices jsonb, p_departures jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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

  if jsonb_array_length(coalesce(p_trek -> 'route_region_ids', '[]')) > 4 then
    raise exception 'A trek can pass through up to 4 more regions' using errcode = '22023';
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
      section_order, optional_high_point_m, pdf_map_path, updated_by
    )
    values (
      p_trek ->> 'slug', region, (p_trek ->> 'status')::public.trek_status,
      (p_trek ->> 'difficulty')::public.trek_difficulty, (p_trek ->> 'grade')::smallint,
      (p_trek ->> 'days')::smallint, (p_trek ->> 'max_altitude_m')::integer, (p_trek ->> 'distance_km')::integer,
      array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
      array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
      (p_trek ->> 'is_popular')::boolean, nullif(p_trek ->> 'cover_photo_id', '')::uuid,
      (p_trek ->> 'meal_budget_min_usd')::integer, (p_trek ->> 'meal_budget_max_usd')::integer,
      coalesce((p_trek ->> 'has_fixed_dates')::boolean, false), p_trek ->> 'map_place', nullif(p_trek ->> 'my_maps_id', ''),
      array(select jsonb_array_elements_text(coalesce(p_trek -> 'hidden_shared_sections', '[]'))),
      array(select jsonb_array_elements_text(coalesce(p_trek -> 'section_order', '[]'))),
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
        has_fixed_dates = coalesce((p_trek ->> 'has_fixed_dates')::boolean, has_fixed_dates),
        map_place = p_trek ->> 'map_place',
        my_maps_id = nullif(p_trek ->> 'my_maps_id', ''),
        hidden_shared_sections = array(select jsonb_array_elements_text(coalesce(p_trek -> 'hidden_shared_sections', '[]'))),
        section_order = array(select jsonb_array_elements_text(coalesce(p_trek -> 'section_order', '[]'))),
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
    headline, short_name, seo_keyword, seo_title, seo_description, share_photo_id, canonical_path, hide_from_google, guides_intro,
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
    p_text ->> 'headline', p_text ->> 'short_name', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description', nullif(p_text ->> 'share_photo_id', '')::uuid, coalesce(p_text ->> 'canonical_path', ''), coalesce((p_text ->> 'hide_from_google')::boolean, false), p_text ->> 'guides_intro',
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
      share_photo_id = excluded.share_photo_id,
      canonical_path = excluded.canonical_path,
      hide_from_google = excluded.hide_from_google,
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

  insert into public.trek_days as k (id, trek_id, position, altitude_m, sleep_altitude_m, is_high_point, photo_id, meals, region_id)
  select i.id, saved_id, i.position, (i.day ->> 'altitude_m')::integer, (i.day ->> 'sleep_altitude_m')::integer,
         (i.day ->> 'is_high_point')::boolean, nullif(i.day ->> 'photo_id', '')::uuid,
         array(select jsonb_array_elements_text(coalesce(i.day -> 'meals', '[]'))),
         -- Only a region on this save's route (the main one or one after it); anything else stays empty.
         case
           when i.day ->> 'region_id' = region::text
             or i.day ->> 'region_id' in (select jsonb_array_elements_text(coalesce(p_trek -> 'route_region_ids', '[]')))
           then (i.day ->> 'region_id')::uuid
         end
  from incoming_days i
  on conflict (id) do update
  set position = excluded.position,
      altitude_m = excluded.altitude_m,
      sleep_altitude_m = excluded.sleep_altitude_m,
      is_high_point = excluded.is_high_point,
      photo_id = excluded.photo_id,
      meals = excluded.meals,
      region_id = excluded.region_id
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

  -- Departure dates: left as they are when none are sent (null), as the admin no longer edits them.
  if p_departures is not null then
    -- Departure dates: one per day per trek; past dates stay here and are hidden on the website.
    create temporary table incoming_departures on commit drop as
    select coalesce(nullif(d.departure ->> 'id', '')::uuid, gen_random_uuid()) as id, d.departure
    from jsonb_array_elements(p_departures) as d (departure);

    delete from public.trek_departures where trek_id = saved_id and id not in (select id from incoming_departures);

    -- The special price and team note are edited on the Departure dates screen, so an update keeps them.
    insert into public.trek_departures as k (id, trek_id, start_date, status)
    select i.id, saved_id, (i.departure ->> 'start_date')::date, (i.departure ->> 'status')::public.departure_status
    from incoming_departures i
    on conflict (id) do update
    set start_date = excluded.start_date, status = excluded.status
    where k.trek_id = saved_id;

    insert into public.trek_departure_translations as t (departure_id, locale, note)
    select i.id, p_locale, i.departure ->> 'note'
    from incoming_departures i
    join public.trek_departures k on k.id = i.id and k.trek_id = saved_id
    on conflict (departure_id, locale) do update set note = excluded.note;
  end if;

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

  delete from public.trek_regions where trek_id = saved_id;
  insert into public.trek_regions (trek_id, region_id, position)
  select saved_id, r.region_id::uuid, r.n::smallint
  from jsonb_array_elements_text(coalesce(p_trek -> 'route_region_ids', '[]')) with ordinality as r (region_id, n)
  where r.region_id::uuid <> region;

  return saved_id;
end;
$function$;

-- save_region also saves "Hide from Google" (p_text: hide_from_google). Rebuilt from the live definition.
CREATE OR REPLACE FUNCTION public.save_region(p_region_id uuid, p_locale text, p_region jsonb, p_text jsonb, p_photos jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
  ratings public.month_rating[] := array(
    select jsonb_array_elements_text(p_region -> 'month_ratings')::public.month_rating
  );
  cover_id uuid := nullif(p_region ->> 'cover_photo_id', '')::uuid;
  featured_id uuid := nullif(p_region ->> 'featured_trek_id', '')::uuid;
  pinned_ids jsonb := coalesce(p_region -> 'pinned_article_ids', '[]');
  pinned_count integer;
begin
  if jsonb_array_length(coalesce(p_region -> 'compare_region_ids', '[]')) > 4 then
    raise exception 'A region can be compared with up to 4 others' using errcode = '22023';
  end if;

  if jsonb_array_length(coalesce(p_region -> 'nearby_treks', '[]')) > 6 then
    raise exception 'A region can suggest up to 6 nearby treks' using errcode = '22023';
  end if;

  if jsonb_array_length(pinned_ids) > 3 then
    raise exception 'A region can pin up to 3 travel guides' using errcode = '22023';
  end if;

  if jsonb_array_length(p_photos -> 'gallery') > 30 then
    raise exception 'A region can have up to 30 gallery photos' using errcode = '22023';
  end if;

  if p_region_id is null then
    insert into public.regions (
      slug, district, latitude, longitude, month_ratings, cover_photo_id, featured_trek_id,
      max_altitude_m, difficulty, is_flight, updated_by
    )
    values (
      p_region ->> 'slug',
      p_region ->> 'district',
      (p_region ->> 'latitude')::numeric,
      (p_region ->> 'longitude')::numeric,
      ratings,
      cover_id,
      featured_id,
      (p_region ->> 'max_altitude_m')::integer,
      nullif(p_region ->> 'difficulty', '')::public.region_difficulty,
      (p_region ->> 'is_flight')::boolean,
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.regions
    set slug = p_region ->> 'slug',
        district = p_region ->> 'district',
        latitude = (p_region ->> 'latitude')::numeric,
        longitude = (p_region ->> 'longitude')::numeric,
        month_ratings = ratings,
        cover_photo_id = cover_id,
        featured_trek_id = featured_id,
        max_altitude_m = (p_region ->> 'max_altitude_m')::integer,
        difficulty = nullif(p_region ->> 'difficulty', '')::public.region_difficulty,
        is_flight = (p_region ->> 'is_flight')::boolean,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_region_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Region not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.region_translations as t (
    region_id, locale, name, pin_label, tagline, introduction, best_for,
    trek_length, getting_there, getting_there_details, permits,
    season_spring, season_monsoon, season_autumn, season_winter, faqs,
    seo_keyword, seo_title, seo_description, share_photo_id, canonical_path, hide_from_google, featured_trek_label, featured_trek_pitch, custom_route_pitch,
    short_name, summary, hero_highlight, overview_heading, why_points,
    from_kathmandu, nearest_airport, permits_details, where_you_sleep
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'pin_label', p_text ->> 'tagline', p_text -> 'introduction',
    array(select jsonb_array_elements_text(p_text -> 'best_for')),
    p_text ->> 'trek_length', p_text ->> 'getting_there',
    p_text ->> 'getting_there_details', p_text ->> 'permits',
    p_text ->> 'season_spring', p_text ->> 'season_monsoon', p_text ->> 'season_autumn', p_text ->> 'season_winter',
    p_text -> 'faqs', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description', nullif(p_text ->> 'share_photo_id', '')::uuid, coalesce(p_text ->> 'canonical_path', ''), coalesce((p_text ->> 'hide_from_google')::boolean, false),
    p_text ->> 'featured_trek_label', p_text ->> 'featured_trek_pitch', p_text ->> 'custom_route_pitch',
    p_text ->> 'short_name', p_text ->> 'summary', p_text ->> 'hero_highlight', p_text ->> 'overview_heading', p_text -> 'why_points',
    p_text ->> 'from_kathmandu', p_text ->> 'nearest_airport', p_text ->> 'permits_details', p_text ->> 'where_you_sleep'
  )
  on conflict (region_id, locale) do update
  set name = excluded.name,
      pin_label = excluded.pin_label,
      tagline = excluded.tagline,
      introduction = excluded.introduction,
      best_for = excluded.best_for,
      trek_length = excluded.trek_length,
      getting_there = excluded.getting_there,
      getting_there_details = excluded.getting_there_details,
      permits = excluded.permits,
      season_spring = excluded.season_spring,
      season_monsoon = excluded.season_monsoon,
      season_autumn = excluded.season_autumn,
      season_winter = excluded.season_winter,
      faqs = excluded.faqs,
      seo_keyword = excluded.seo_keyword,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      share_photo_id = excluded.share_photo_id,
      canonical_path = excluded.canonical_path,
      hide_from_google = excluded.hide_from_google,
      featured_trek_label = excluded.featured_trek_label,
      featured_trek_pitch = excluded.featured_trek_pitch,
      custom_route_pitch = excluded.custom_route_pitch,
      short_name = excluded.short_name,
      summary = excluded.summary,
      hero_highlight = excluded.hero_highlight,
      overview_heading = excluded.overview_heading,
      why_points = excluded.why_points,
      from_kathmandu = excluded.from_kathmandu,
      nearest_airport = excluded.nearest_airport,
      permits_details = excluded.permits_details,
      where_you_sleep = excluded.where_you_sleep,
      updated_at = now();

  update public.photos p
  set place = d.place,
      region_id = coalesce(p.region_id, saved_id),
      updated_at = now()
  from jsonb_to_recordset(p_photos -> 'details') as d (id uuid, place text)
  where p.id = d.id;

  delete from public.region_photos where region_id = saved_id;
  insert into public.region_photos (region_id, photo_id, position)
  select saved_id, g.photo_id::uuid, (g.n - 1)::smallint
  from jsonb_array_elements_text(p_photos -> 'gallery') with ordinality as g (photo_id, n);

  -- The featured trek has to be one of this region's treks: its main region, or one it passes through.
  if featured_id is not null
    and not exists (select 1 from public.treks where id = featured_id and region_id = saved_id)
    and not exists (select 1 from public.trek_regions where trek_id = featured_id and region_id = saved_id) then
    raise exception 'The featured trek is not in this region' using errcode = '23514';
  end if;

  -- Nearby treks (from other regions), in order, each with its label and note in p_locale.
  create temporary table incoming_nearby on commit drop as
  select n.item ->> 'trek_id' as trek_id_text, (n.position - 1)::smallint as position, n.item
  from jsonb_array_elements(coalesce(p_region -> 'nearby_treks', '[]')) with ordinality as n (item, position);

  delete from public.region_nearby_treks
  where region_id = saved_id and trek_id::text not in (select trek_id_text from incoming_nearby);

  insert into public.region_nearby_treks as k (region_id, trek_id, position)
  select saved_id, i.trek_id_text::uuid, i.position from incoming_nearby i
  on conflict (region_id, trek_id) do update set position = excluded.position;

  insert into public.region_nearby_trek_translations as t (region_id, trek_id, locale, label, note)
  select saved_id, i.trek_id_text::uuid, p_locale, i.item ->> 'label', i.item ->> 'note' from incoming_nearby i
  on conflict (region_id, trek_id, locale) do update set label = excluded.label, note = excluded.note;

  -- Guides are listed from Trekking guides automatically; these are the ones switched off for this region.
  delete from public.region_hidden_guides where region_id = saved_id;
  insert into public.region_hidden_guides (region_id, guide_id)
  select distinct saved_id, g.guide_id::uuid from jsonb_array_elements_text(coalesce(p_region -> 'hidden_guide_ids', '[]')) as g (guide_id);

  -- "Compare with other regions", in order (never the region itself).
  delete from public.region_compare where region_id = saved_id;
  insert into public.region_compare (region_id, other_region_id, position)
  select saved_id, c.other_id::uuid, (c.n - 1)::smallint
  from jsonb_array_elements_text(coalesce(p_region -> 'compare_region_ids', '[]')) with ordinality as c (other_id, n)
  where c.other_id::uuid <> saved_id;

  -- "Before you go": up to 3 of the region's travel guides shown first, in order. Each must be about this
  -- region (ticked in the guide's settings), so a pin never points at a guide that has left the region.
  update public.article_regions set pin_position = null where region_id = saved_id and pin_position is not null;
  update public.article_regions a
  set pin_position = (p.n - 1)::smallint
  from jsonb_array_elements_text(pinned_ids) with ordinality as p (article_id, n)
  where a.region_id = saved_id and a.article_id = p.article_id::uuid;
  get diagnostics pinned_count = row_count;
  if pinned_count <> jsonb_array_length(pinned_ids) then
    raise exception 'A pinned travel guide is not about this region' using errcode = '23514', hint = 'pinned_article_not_in_region';
  end if;

  return saved_id;
end;
$function$;

-- save_article also saves "Hide from Google" (p_text: hide_from_google). Rebuilt from the live definition.
CREATE OR REPLACE FUNCTION public.save_article(p_article_id uuid, p_locale text, p_article jsonb, p_text jsonb, p_region_ids jsonb, p_related_ids jsonb, p_sections jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
  site uuid := nullif(p_article ->> 'site_region_id', '')::uuid;
  site_key uuid := coalesce(nullif(p_article ->> 'site_region_id', '')::uuid, '00000000-0000-0000-0000-000000000000'::uuid);
  author uuid := nullif(p_article ->> 'author_id', '')::uuid;
  checker uuid := nullif(p_article ->> 'checker_guide_id', '')::uuid;
  new_status public.article_status := (p_article ->> 'status')::public.article_status;
  today date := (now() at time zone 'Asia/Kathmandu')::date;
  is_date_mode boolean := p_article ->> 'publish_mode' = 'date';
  chosen_date date := nullif(p_article ->> 'published_on', '')::date;
  start_number smallint := (p_article ->> 'start_here_position')::smallint;
begin
  if jsonb_array_length(p_region_ids) > 20 or jsonb_array_length(p_related_ids) > 3 or jsonb_array_length(p_sections) > 60 then
    raise exception 'Too many regions, related guides or sections' using errcode = '22023';
  end if;

  if author is not null and not exists (select 1 from public.authors a where a.id = author and p_locale = any (a.writes_in)) then
    raise exception 'author_language' using errcode = '22023';
  end if;

  if checker is not null and not exists (
    select 1 from public.trekking_guides g where g.id = checker and g.can_fact_check and g.photo_consent
  ) then
    raise exception 'checker_not_allowed' using errcode = '22023';
  end if;

  if new_status = 'published' and checker is null and exists (select 1 from public.authors a where a.id = author and a.kind = 'guest') then
    raise exception 'guest_needs_checker' using errcode = '22023';
  end if;

  -- A guide shown in the article (tip, quote, meet the guides) shows with photo and name: they must have agreed.
  if exists (
    select 1
    from jsonb_array_elements(p_sections) as s (section)
    cross join lateral jsonb_array_elements_text(coalesce(s.section -> 'guide_ids', '[]')) as g (guide_id)
    where not exists (select 1 from public.trekking_guides t where t.id = g.guide_id::uuid and t.photo_consent)
  ) then
    raise exception 'section_guide_not_agreed' using errcode = '22023';
  end if;

  -- Featured and "Start here" numbers are one per website: take them from the guide that has them.
  if is_date_mode and chosen_date is null then
    raise exception 'date_needed' using errcode = '22023';
  end if;

  if (p_article ->> 'is_featured')::boolean then
    update public.articles a set is_featured = false
    where a.is_featured and coalesce(a.site_region_id, '00000000-0000-0000-0000-000000000000'::uuid) = site_key
      and a.id is distinct from p_article_id;
  end if;
  if start_number is not null then
    update public.articles a set start_here_position = null
    where a.start_here_position = start_number and coalesce(a.site_region_id, '00000000-0000-0000-0000-000000000000'::uuid) = site_key
      and a.id is distinct from p_article_id;
  end if;

  if p_article_id is null then
    insert into public.articles (
      site_region_id, also_on_main_site, slug, topic, status, published_on, updated_on, is_featured, start_here_position,
      author_id, checker_guide_id, main_trek_id, photo_trek_id, cover_photo_id, month_ratings, updated_by
    )
    values (
      site, (p_article ->> 'also_on_main_site')::boolean and site is not null, p_article ->> 'slug',
      (p_article ->> 'topic')::public.article_topic, new_status,
      -- "On a date I choose": that date; "As soon as I click Publish": today once it goes live.
      case when is_date_mode then chosen_date when new_status = 'published' then today end, null,
      (p_article ->> 'is_featured')::boolean, start_number, author, checker,
      nullif(p_article ->> 'main_trek_id', '')::uuid, nullif(p_article ->> 'photo_trek_id', '')::uuid,
      nullif(p_article ->> 'cover_photo_id', '')::uuid,
      case when jsonb_array_length(coalesce(p_article -> 'month_ratings', '[]')) = 12
        then array(select jsonb_array_elements_text(p_article -> 'month_ratings')::public.month_rating) end,
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.articles a
    set site_region_id = site,
        also_on_main_site = (p_article ->> 'also_on_main_site')::boolean and site is not null,
        slug = p_article ->> 'slug',
        topic = (p_article ->> 'topic')::public.article_topic,
        status = new_status,
        -- "On a date I choose": that date. "As soon as I click Publish": a date already passed is kept (the day it
        -- first went live); otherwise today once it goes live, or none while it isn't.
        published_on = case
          when is_date_mode then chosen_date
          when a.published_on <= today then a.published_on
          when new_status = 'published' then today
        end,
        updated_on = case when (p_article ->> 'is_big_update')::boolean and new_status = 'published' then today else a.updated_on end,
        is_featured = (p_article ->> 'is_featured')::boolean,
        start_here_position = start_number,
        author_id = author,
        checker_guide_id = checker,
        main_trek_id = nullif(p_article ->> 'main_trek_id', '')::uuid,
        photo_trek_id = nullif(p_article ->> 'photo_trek_id', '')::uuid,
        cover_photo_id = nullif(p_article ->> 'cover_photo_id', '')::uuid,
        month_ratings = case when jsonb_array_length(coalesce(p_article -> 'month_ratings', '[]')) = 12
          then array(select jsonb_array_elements_text(p_article -> 'month_ratings')::public.month_rating) end,
        updated_at = now(),
        updated_by = auth.uid()
    where a.id = p_article_id
    returning a.id into saved_id;

    if saved_id is null then
      raise exception 'Travel guide not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.article_translations as t (
    article_id, locale, title, intro, card_text, cover_alt, highlight_tag, updated_line, facts,
    seo_keyword, seo_title, seo_description, share_photo_id, canonical_path, hide_from_google, month_notes
  )
  values (
    saved_id, p_locale, p_text ->> 'title', p_text ->> 'intro', p_text ->> 'card_text', p_text ->> 'cover_alt',
    p_text ->> 'highlight_tag', p_text ->> 'updated_line', p_text -> 'facts', p_text ->> 'seo_keyword',
    p_text ->> 'seo_title', p_text ->> 'seo_description', nullif(p_text ->> 'share_photo_id', '')::uuid, coalesce(p_text ->> 'canonical_path', ''), coalesce((p_text ->> 'hide_from_google')::boolean, false), coalesce(p_text -> 'month_notes', '[]')
  )
  on conflict (article_id, locale) do update
  set title = excluded.title,
      intro = excluded.intro,
      card_text = excluded.card_text,
      cover_alt = excluded.cover_alt,
      highlight_tag = excluded.highlight_tag,
      updated_line = excluded.updated_line,
      facts = excluded.facts,
      seo_keyword = excluded.seo_keyword,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      share_photo_id = excluded.share_photo_id,
      canonical_path = excluded.canonical_path,
      hide_from_google = excluded.hide_from_google,
      month_notes = excluded.month_notes,
      updated_at = now();

  -- Only the regions unticked are removed and only new ones added: a kept region keeps its pin (save_region).
  delete from public.article_regions
  where article_id = saved_id and region_id::text not in (select jsonb_array_elements_text(p_region_ids));
  insert into public.article_regions (article_id, region_id)
  select distinct saved_id, r.region_id::uuid from jsonb_array_elements_text(p_region_ids) as r (region_id)
  on conflict (article_id, region_id) do nothing;

  delete from public.article_related where article_id = saved_id;
  insert into public.article_related (article_id, related_article_id, position)
  select saved_id, r.related_id::uuid, (r.n - 1)::smallint
  from jsonb_array_elements_text(p_related_ids) with ordinality as r (related_id, n);

  -- Sections: keep the ids the editor sends (so other languages stay attached), add new ones, drop removed ones.
  drop table if exists pg_temp.incoming_sections;
  create temporary table incoming_sections on commit drop as
  select coalesce(nullif(s.section ->> 'id', '')::uuid, gen_random_uuid()) as id, (s.n - 1)::smallint as position, s.section
  from jsonb_array_elements(p_sections) with ordinality as s (section, n);

  delete from public.article_sections where article_id = saved_id and id not in (select id from incoming_sections);

  insert into public.article_sections as k (id, article_id, position, type, trek_id, settings)
  select i.id, saved_id, i.position, (i.section ->> 'type')::public.article_section_type, nullif(i.section ->> 'trek_id', '')::uuid,
         coalesce(i.section -> 'settings', '{}')
  from incoming_sections i
  on conflict (id) do update
  set position = excluded.position, type = excluded.type, trek_id = excluded.trek_id, settings = excluded.settings
  -- An id from another guide is never taken over.
  where k.article_id = saved_id;

  insert into public.article_section_translations as t (section_id, locale, content)
  select i.id, p_locale, i.section -> 'content'
  from incoming_sections i
  join public.article_sections k on k.id = i.id and k.article_id = saved_id
  on conflict (section_id, locale) do update set content = excluded.content;

  -- The guides and photos a section shows, in order (they can't be removed while a section shows them).
  delete from public.article_section_guides g using public.article_sections k where g.section_id = k.id and k.article_id = saved_id;
  insert into public.article_section_guides (section_id, guide_id, position)
  select i.id, g.guide_id::uuid, (g.n - 1)::smallint
  from incoming_sections i
  join public.article_sections k on k.id = i.id and k.article_id = saved_id
  cross join lateral jsonb_array_elements_text(coalesce(i.section -> 'guide_ids', '[]')) with ordinality as g (guide_id, n);

  delete from public.article_section_photos p using public.article_sections k where p.section_id = k.id and k.article_id = saved_id;
  insert into public.article_section_photos (section_id, photo_id, position)
  select i.id, p.photo_id::uuid, (p.n - 1)::smallint
  from incoming_sections i
  join public.article_sections k on k.id = i.id and k.article_id = saved_id
  cross join lateral jsonb_array_elements_text(coalesce(i.section -> 'photo_ids', '[]')) with ordinality as p (photo_id, n);

  return saved_id;
end;
$function$;

-- save_site_page (and so save_site_pages) also saves "Hide from Google" (p_page: hide_from_google).
CREATE OR REPLACE FUNCTION public.save_site_page(p_slug text, p_page jsonb, p_photo_ids jsonb)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
  where slug = p_slug;

  if not found then
    raise exception 'Not allowed to change this page' using errcode = '42501';
  end if;

  delete from public.site_page_photos where page_slug = p_slug;
  insert into public.site_page_photos (page_slug, position, photo_id)
  select p_slug, n, photo_id::uuid
  from jsonb_array_elements_text(p_photo_ids) with ordinality as p (photo_id, n)
  where n <= 8 and photo_id <> '';
end;
$function$;

drop view public.web_canonical_overrides;

-- The pages the website shows that name another page as their main version or are hidden from Google (like
-- web_page_schemas: kind and slug, only shown pages).
create view public.web_page_seo_overrides as
select 'page'::text as page_kind, s.slug::text as page_slug, 'en'::text as locale, s.canonical_path, s.hide_from_google
from public.site_pages s
where s.canonical_path <> '' or s.hide_from_google
union all
select 'trek', w.slug, w.locale, t.canonical_path, t.hide_from_google
from public.trek_translations t
join public.web_trek_pages w on w.id = t.trek_id and w.locale = t.locale
where t.canonical_path <> '' or t.hide_from_google
union all
select 'region', w.slug, w.locale, t.canonical_path, t.hide_from_google
from public.region_translations t
join public.web_region_pages w on w.id = t.region_id and w.locale = t.locale
where t.canonical_path <> '' or t.hide_from_google
union all
select 'guide', w.slug, w.locale, t.canonical_path, t.hide_from_google
from public.article_translations t
join public.web_travel_guide_pages w on w.id = t.article_id and w.locale = t.locale
where t.canonical_path <> '' or t.hide_from_google;

revoke all on public.web_page_seo_overrides from public, authenticated;
grant select on public.web_page_seo_overrides to anon;
