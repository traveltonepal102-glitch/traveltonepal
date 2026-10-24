-- Regions: every field the website's region page shows (design: Admin-region-editor; data: the website's
-- RegionDetail, RegionOverview and RegionSummary). Adds the hero chip, the overview heading and "why trek here"
-- points, the "Where it is" lines, the Regions-page card text (short name, summary, fly or drive) and "Compare
-- with other regions". The highest point becomes a number in metres and the difficulty one of the website's
-- six levels (both were free text), so cards, filters and the compare table stay consistent.

create type public.region_difficulty as enum ('easy', 'easy_moderate', 'moderate', 'easy_challenging', 'challenging', 'strenuous');

alter table public.regions
  add column max_altitude_m integer check (max_altitude_m between 500 and 9000),
  add column difficulty public.region_difficulty,
  -- Flown in (Everest: Lukla): the website shows a plane instead of a road.
  add column is_flight boolean not null default false;

alter table public.region_translations
  -- Where space is tight, e.g. "Tamang Heritage".
  add column short_name text not null default '' check (char_length(short_name) <= 40),
  -- One or two lines on the Regions page cards and in Google's list of regions.
  add column summary text not null default '' check (char_length(summary) <= 200),
  -- The 4th chip on the top photo, e.g. "No flights needed".
  add column hero_highlight text not null default '' check (char_length(hero_highlight) <= 40),
  -- "About the region": the heading above the introduction.
  add column overview_heading text not null default '' check (char_length(overview_heading) <= 120),
  -- Up to 4 cards under the introduction: [{ "icon", "title", "text" }].
  add column why_points jsonb not null default '[]' check (jsonb_typeof(why_points) = 'array' and jsonb_array_length(why_points) <= 4),
  -- "Where it is" lines.
  add column from_kathmandu text not null default '' check (char_length(from_kathmandu) <= 120),
  add column nearest_airport text not null default '' check (char_length(nearest_airport) <= 80),
  add column permits_details text not null default '' check (char_length(permits_details) <= 120),
  add column where_you_sleep text not null default '' check (char_length(where_you_sleep) <= 80);

-- The free-text highest point ("5,416 m") and difficulty move into the new columns.
update public.regions r
set max_altitude_m = nullif(regexp_replace(t.highest_point, '[^0-9]', '', 'g'), '')::integer,
    difficulty = case t.difficulty
      when 'Easy' then 'easy' when 'Easy–moderate' then 'easy_moderate' when 'Moderate' then 'moderate'
      when 'Easy–challenging' then 'easy_challenging' when 'Challenging' then 'challenging' when 'Strenuous' then 'strenuous'
    end::public.region_difficulty
from public.region_translations t
where t.region_id = r.id and t.locale = 'en';

alter table public.region_translations drop column highest_point, drop column difficulty;

create table public.region_compare (
  region_id uuid not null references public.regions (id) on delete cascade,
  other_region_id uuid not null references public.regions (id) on delete cascade,
  position smallint not null check (position between 0 and 3),
  primary key (region_id, other_region_id),
  check (other_region_id <> region_id)
);

create index region_compare_other_region_id_idx on public.region_compare (other_region_id);

alter table public.region_compare enable row level security;

grant select, insert, update, delete on public.region_compare to authenticated;

create policy "Admins read compared regions" on public.region_compare for select to authenticated using ((select public.is_admin()));
create policy "Admins add compared regions" on public.region_compare for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit compared regions" on public.region_compare
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove compared regions" on public.region_compare for delete to authenticated using ((select public.is_admin()));

-- save_region saves the new fields (p_region: max_altitude_m, difficulty, is_flight, compare_region_ids;
-- p_text: the new text columns). Same arguments, so the grants stay as they are.

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
begin
  if jsonb_array_length(coalesce(p_region -> 'compare_region_ids', '[]')) > 4 then
    raise exception 'A region can be compared with up to 4 others' using errcode = '22023';
  end if;

  if jsonb_array_length(coalesce(p_region -> 'nearby_treks', '[]')) > 6 then
    raise exception 'A region can suggest up to 6 nearby treks' using errcode = '22023';
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

  return saved_id;
end;
$$;

-- From the website: every region's card summary, Tamang Heritage's short name, and Everest is flown in.
update public.region_translations t
set summary = s.summary
from (values
    ('annapurna', 'The most varied region: rice terraces, rhododendron forest, the Annapurna Sanctuary and the high desert beyond Thorong La.'),
    ('mardi-himal', 'A quiet ridge walk straight up towards Machapuchare, ideal when you only have a week.'),
    ('nar-phu', 'Medieval stone villages and Tibetan culture in a hidden valley north of Annapurna, over the Kang La.'),
    ('manaslu', 'A wild circuit around the world''s eighth-highest mountain, crossing the Larkya La, with far fewer trekkers.'),
    ('tamang-heritage-trail', 'Village homestays, hot springs and Tamang traditions near the Tibet border. Gentle and cultural.'),
    ('langtang', 'Glaciers, yak pastures and the monastery at Kyanjin Gompa, the closest big-mountain valley to Kathmandu.'),
    ('pikey-peak', 'A short trek in Sherpa country with one of the widest Himalayan panoramas, from Everest to Kanchenjunga.'),
    ('everest', 'Sherpa villages, monasteries and the classic walk to Everest Base Camp and Kala Patthar.'),
    ('kanchenjunga', 'A long expedition-style trek in the far east to the base camps of the world''s third-highest mountain.')
) as s (slug, summary), public.regions r
where t.region_id = r.id and r.slug = s.slug and t.locale = 'en';

update public.region_translations t set short_name = 'Tamang Heritage'
from public.regions r where t.region_id = r.id and r.slug = 'tamang-heritage-trail' and t.locale = 'en';

update public.regions set is_flight = true where slug = 'everest';

-- Langtang's page, as on the website.
update public.region_translations t
set hero_highlight = 'No flights needed',
    overview_heading = 'The valley next door to Kathmandu',
    why_points = '[
      { "icon": "landscape", "title": "Big mountains, fast", "text": "Langtang Lirung (7,227 m) from Kyanjin Gompa after 4 days of walking." },
      { "icon": "temple_buddhist", "title": "Tamang culture", "text": "Monasteries, mani walls and villages that welcome trekkers." },
      { "icon": "directions_walk", "title": "Gentle climb", "text": "Gradual height gain, good for a first Himalayan trek." },
      { "icon": "volunteer_activism", "title": "Your money stays local", "text": "Village teahouses and guides from the valley itself." }
    ]'::jsonb,
    from_kathmandu = '120 km · 7–8 hours by jeep to Syabrubesi',
    nearest_airport = 'Kathmandu (KTM)',
    permits_details = 'Langtang National Park + local area permit',
    where_you_sleep = 'Family-run teahouses'
from public.regions r
where t.region_id = r.id and r.slug = 'langtang' and t.locale = 'en';

insert into public.region_compare (region_id, other_region_id, position)
select r.id, o.id, c.position
from public.regions r
cross join (values ('tamang-heritage-trail', 0), ('everest', 1), ('annapurna', 2), ('manaslu', 3)) as c (slug, position)
join public.regions o on o.slug = c.slug
where r.slug = 'langtang';
