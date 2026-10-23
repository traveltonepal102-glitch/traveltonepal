-- Treks, step 2b: Day by day (data shape: the website's trek page, ItineraryDay).
-- trek_days holds what every language shares (order, altitudes, highlight day, photo);
-- trek_day_translations holds the text. Days keep their id when reordered, so other languages stay attached.
-- altitude_m is the day's highest point; sleep_altitude_m only when you sleep lower (a day hike up and back).

alter table public.trek_translations
  add column itinerary_intro text not null default '' check (char_length(itinerary_intro) <= 1500);

create table public.trek_days (
  id uuid primary key default gen_random_uuid(),
  trek_id uuid not null references public.treks (id) on delete cascade,
  position smallint not null check (position between 0 and 59),
  altitude_m integer not null check (altitude_m between 0 and 9000),
  sleep_altitude_m integer check (sleep_altitude_m between 0 and 9000),
  is_high_point boolean not null default false,
  photo_id uuid references public.photos (id) on delete restrict,
  check (sleep_altitude_m is null or sleep_altitude_m <= altitude_m)
);

create index trek_days_trek_id_idx on public.trek_days (trek_id, position);
create index trek_days_photo_id_idx on public.trek_days (photo_id);
-- One highlight day per trek at most.
create unique index trek_days_one_high_point_idx on public.trek_days (trek_id) where is_high_point;

create table public.trek_day_translations (
  day_id uuid not null references public.trek_days (id) on delete cascade,
  locale text not null check (locale in ('en', 'de')),
  -- Short name under the altitude chart, e.g. "Lama Hotel".
  place text not null default '' check (char_length(place) <= 40),
  title text not null check (char_length(title) between 1 and 160),
  subtitle text not null default '' check (char_length(subtitle) <= 160),
  -- Walking or driving time, e.g. "6–7 hrs" or "7–8 hrs drive"; empty on arrival and departure days.
  duration text not null default '' check (char_length(duration) <= 40),
  description text not null default '' check (char_length(description) <= 1500),
  primary key (day_id, locale)
);

alter table public.trek_days enable row level security;
alter table public.trek_day_translations enable row level security;

grant select, insert, update, delete on public.trek_days to authenticated;
grant select, insert, update, delete on public.trek_day_translations to authenticated;

create policy "Admins read trek days" on public.trek_days for select to authenticated using ((select public.is_admin()));
create policy "Admins add trek days" on public.trek_days for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit trek days" on public.trek_days
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove trek days" on public.trek_days for delete to authenticated using ((select public.is_admin()));

create policy "Admins read trek day text" on public.trek_day_translations for select to authenticated using ((select public.is_admin()));
create policy "Admins add trek day text" on public.trek_day_translations for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit trek day text" on public.trek_day_translations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove trek day text" on public.trek_day_translations for delete to authenticated using ((select public.is_admin()));

-- save_trek also saves the days (p_days: [{ id, altitude_m, sleep_altitude_m, is_high_point, photo_id, place, title,
-- subtitle, duration, description }] in order) and the itinerary intro.
drop function public.save_trek(uuid, text, jsonb, jsonb, jsonb);

create function public.save_trek(p_trek_id uuid, p_locale text, p_trek jsonb, p_text jsonb, p_photos jsonb, p_days jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
  region uuid := (p_trek ->> 'region_id')::uuid;
begin
  if jsonb_array_length(p_days) > 60 then
    raise exception 'A trek can have up to 60 days' using errcode = '22023';
  end if;

  if jsonb_array_length(p_photos -> 'gallery') > 30 then
    raise exception 'A trek can have up to 30 gallery photos' using errcode = '22023';
  end if;

  if p_trek_id is null then
    insert into public.treks (
      slug, region_id, status, difficulty, grade, days, max_altitude_m, distance_km,
      seasons, tags, is_popular, cover_photo_id, updated_by
    )
    values (
      p_trek ->> 'slug', region, (p_trek ->> 'status')::public.trek_status,
      (p_trek ->> 'difficulty')::public.trek_difficulty, (p_trek ->> 'grade')::smallint,
      (p_trek ->> 'days')::smallint, (p_trek ->> 'max_altitude_m')::integer, (p_trek ->> 'distance_km')::integer,
      array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
      array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
      (p_trek ->> 'is_popular')::boolean, nullif(p_trek ->> 'cover_photo_id', '')::uuid, auth.uid()
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
    introduction, highlights_heading, highlights, suitability_intro, suitability_points, itinerary_intro
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'summary', p_text ->> 'card_badge', p_text -> 'photo_badges',
    p_text ->> 'start_finish', p_text ->> 'daily_walking', p_text ->> 'guide_ratio', p_text ->> 'season_label',
    p_text ->> 'accommodation', p_text ->> 'transport',
    p_text -> 'introduction', p_text ->> 'highlights_heading', p_text -> 'highlights',
    p_text ->> 'suitability_intro', p_text -> 'suitability_points', p_text ->> 'itinerary_intro'
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

  return saved_id;
end;
$$;

revoke execute on function public.save_trek(uuid, text, jsonb, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.save_trek(uuid, text, jsonb, jsonb, jsonb, jsonb) to authenticated;

-- Langtang Valley's 10 days, as on the website (apps/web/src/features/trek-detail/content/langtangValleyItinerary.ts).
update public.trek_translations t
set itinerary_intro = 'Ten unhurried days from Kathmandu to the glaciers of the upper Langtang valley and back. You drive to Syabrubesi, follow the river up through forest and Tamang villages, spend two nights at Kyanjin Gompa, and climb Kyanjin Ri at sunrise before walking back down the valley. Every night is in a family-run teahouse.'
from public.treks k
where k.id = t.trek_id and k.slug = 'langtang-valley' and t.locale = 'en';

with seed (position, place, title, subtitle, duration, altitude_m, sleep_altitude_m, is_high_point, description) as (
  values
    (0, 'Kathmandu', 'Arrive in Kathmandu (1,400 m), welcome and trip briefing', 'Airport pickup · Gear check in Thamel', 'Arrival', 1400, null, false, 'Our team meets you at Tribhuvan International Airport and takes you to your hotel. In the evening we check your gear, sort the permits and talk you through the route.'),
    (1, 'Syabrubesi', 'Drive Kathmandu to Syabrubesi (1,503 m)', 'Scenic mountain road via Dhunche · Trishuli valley', '7–8 hrs drive', 1503, null, false, 'A long but beautiful drive north through terraced hills and the Trishuli valley to Syabrubesi, the trailhead village on the Bhote Koshi river.'),
    (2, 'Lama Hotel', 'Syabrubesi to Lama Hotel (2,470 m) along the Langtang Khola', 'River gorge · Bamboo and rhododendron forest', '6–7 hrs', 2470, null, false, 'Cross the suspension bridge out of Syabrubesi and follow the river upstream through oak, bamboo and rhododendron forest. Look out for langur monkeys near the trail.'),
    (3, 'Langtang', 'Lama Hotel to Langtang Village (3,430 m)', 'Yak pastures · First views of Langtang Lirung', '6–7 hrs', 3430, null, false, 'The forest thins as the valley opens out at Ghoda Tabela. Yak pastures, water-driven prayer wheels and stone houses lead into the rebuilt Langtang village.'),
    (4, 'Kyanjin Gompa', 'Langtang Village to Kyanjin Gompa (3,870 m)', 'Short day · Monastery and yak cheese factory', '3–4 hrs', 3870, null, false, 'A short climb past long mani walls and chortens to Kyanjin Gompa. The afternoon is free to rest, visit the monastery and taste the local yak cheese.'),
    (5, 'Kyanjin Ri', 'Sunrise hike up Kyanjin Ri (4,773 m), or Tserko Ri (4,984 m)', 'The high point of the trek · Langtang Lirung up close', '5–7 hrs', 4773, 3870, true, 'An early start to Kyanjin Ri for sunrise on Langtang Lirung (7,227 m) and the glaciers that ring the valley. Strong walkers can choose Tserko Ri instead. Second night in Kyanjin.'),
    (6, 'Lama Hotel', 'Kyanjin Gompa to Lama Hotel (2,470 m)', 'Long descent down the valley', '6–7 hrs', 2470, null, false, 'Retrace the valley downhill with the peaks behind you, dropping back into the forest for the night at Lama Hotel.'),
    (7, 'Syabrubesi', 'Lama Hotel to Syabrubesi (1,503 m)', 'Last trekking day · Celebrate with your team', '5–6 hrs', 1503, null, false, 'The final descent through the gorge to Syabrubesi, where we celebrate the end of the trek with your guide and porters.'),
    (8, 'Kathmandu', 'Drive Syabrubesi to Kathmandu (1,400 m)', 'Free evening in Thamel', '7–8 hrs drive', 1400, null, false, 'Drive back to Kathmandu on the same scenic road. The evening is free for shopping and a farewell dinner.'),
    (9, 'Kathmandu', 'Departure, or extend your stay in Nepal', 'Airport transfer', '', 1400, null, false, 'Transfer to the airport for your flight home, or stay on for another adventure in Nepal. We are happy to help plan it.')
),
inserted as (
  insert into public.trek_days (trek_id, position, altitude_m, sleep_altitude_m, is_high_point)
  select k.id, s.position, s.altitude_m, s.sleep_altitude_m, s.is_high_point
  from seed s
  cross join (select id from public.treks where slug = 'langtang-valley') k
  returning id, position
)
insert into public.trek_day_translations (day_id, locale, place, title, subtitle, duration, description)
select i.id, 'en', s.place, s.title, s.subtitle, s.duration, s.description
from inserted i
join seed s on s.position = i.position;
