-- A region page's featured trek can also be a trek that passes through the region (trek_regions), not only one whose
-- main region it is. Same arguments, so the grants stay as they are.
CREATE OR REPLACE FUNCTION public.save_region(p_region_id uuid, p_locale text, p_region jsonb, p_text jsonb, p_photos jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $$
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
    seo_keyword, seo_title, seo_description, featured_trek_label, featured_trek_pitch, custom_route_pitch,
    short_name, summary, hero_highlight, overview_heading, why_points,
    from_kathmandu, nearest_airport, permits_details, where_you_sleep
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'pin_label', p_text ->> 'tagline', p_text -> 'introduction',
    array(select jsonb_array_elements_text(p_text -> 'best_for')),
    p_text ->> 'trek_length', p_text ->> 'getting_there',
    p_text ->> 'getting_there_details', p_text ->> 'permits',
    p_text ->> 'season_spring', p_text ->> 'season_monsoon', p_text ->> 'season_autumn', p_text ->> 'season_winter',
    p_text -> 'faqs', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description',
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
$$;
