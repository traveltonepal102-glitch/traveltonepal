-- "Before you go to <region>" in the admin (decided 2026-10-25): a region lists every travel guide about it
-- (ticked in the guide's settings, article_regions) and pins up to 3 to show first on its page.

-- The pin lives on the guide–region link, so unticking the region in the guide also removes its pin.
alter table public.article_regions
  add column pin_position smallint check (pin_position between 0 and 2),
  add constraint article_regions_region_pin_key unique (region_id, pin_position);

-- Admins could add and remove links; setting a pin is an update.
create policy "Admins edit article regions" on public.article_regions
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- save_article (from 20261024330000) keeps the links it doesn't change, instead of deleting and re-adding them all,
-- so saving a guide keeps its pins.
create or replace function public.save_article(
  p_article_id uuid, p_locale text, p_article jsonb, p_text jsonb, p_region_ids jsonb, p_related_ids jsonb, p_sections jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
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
    seo_keyword, seo_title, seo_description, month_notes
  )
  values (
    saved_id, p_locale, p_text ->> 'title', p_text ->> 'intro', p_text ->> 'card_text', p_text ->> 'cover_alt',
    p_text ->> 'highlight_tag', p_text ->> 'updated_line', p_text -> 'facts', p_text ->> 'seo_keyword',
    p_text ->> 'seo_title', p_text ->> 'seo_description', coalesce(p_text -> 'month_notes', '[]')
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
$$;

-- save_region (from 20261024210000) also saves the pinned guides (p_region.pinned_article_ids, in order).
create or replace function public.save_region(p_region_id uuid, p_locale text, p_region jsonb, p_text jsonb, p_photos jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
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

  -- The featured trek has to be one of this region's treks.
  if featured_id is not null and not exists (select 1 from public.treks where id = featured_id and region_id = saved_id) then
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
