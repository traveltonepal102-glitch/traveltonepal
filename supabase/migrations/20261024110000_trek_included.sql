-- Treks, step 2c: Included and meals (data shape: the website's trek page, inclusions and meals).
-- included / excluded / meal_trail_tips / meal_teahouse_notes: [{ "title", "text" }] in display order;
-- the title is the bold lead-in ("Permits"). Meals are not included: the page shows a daily food budget.

alter table public.treks
  add column meal_budget_min_usd integer check (meal_budget_min_usd between 1 and 1000),
  add column meal_budget_max_usd integer check (meal_budget_max_usd between 1 and 1000),
  add constraint treks_meal_budget_check check (
    (meal_budget_min_usd is null) = (meal_budget_max_usd is null) and
    (meal_budget_min_usd is null or meal_budget_min_usd <= meal_budget_max_usd)
  );

alter table public.trek_translations
  add column included jsonb not null default '[]'
    check (jsonb_typeof(included) = 'array' and jsonb_array_length(included) <= 20),
  add column excluded jsonb not null default '[]'
    check (jsonb_typeof(excluded) = 'array' and jsonb_array_length(excluded) <= 20),
  add column meal_trail_tips jsonb not null default '[]'
    check (jsonb_typeof(meal_trail_tips) = 'array' and jsonb_array_length(meal_trail_tips) <= 10),
  add column meal_teahouse_notes jsonb not null default '[]'
    check (jsonb_typeof(meal_teahouse_notes) = 'array' and jsonb_array_length(meal_teahouse_notes) <= 10);

-- save_trek also saves this section. Otherwise unchanged.
create or replace function public.save_trek(p_trek_id uuid, p_locale text, p_trek jsonb, p_text jsonb, p_photos jsonb, p_days jsonb)
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
      seasons, tags, is_popular, cover_photo_id, meal_budget_min_usd, meal_budget_max_usd, updated_by
    )
    values (
      p_trek ->> 'slug', region, (p_trek ->> 'status')::public.trek_status,
      (p_trek ->> 'difficulty')::public.trek_difficulty, (p_trek ->> 'grade')::smallint,
      (p_trek ->> 'days')::smallint, (p_trek ->> 'max_altitude_m')::integer, (p_trek ->> 'distance_km')::integer,
      array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
      array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
      (p_trek ->> 'is_popular')::boolean, nullif(p_trek ->> 'cover_photo_id', '')::uuid,
      (p_trek ->> 'meal_budget_min_usd')::integer, (p_trek ->> 'meal_budget_max_usd')::integer, auth.uid()
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
    included, excluded, meal_trail_tips, meal_teahouse_notes
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'summary', p_text ->> 'card_badge', p_text -> 'photo_badges',
    p_text ->> 'start_finish', p_text ->> 'daily_walking', p_text ->> 'guide_ratio', p_text ->> 'season_label',
    p_text ->> 'accommodation', p_text ->> 'transport',
    p_text -> 'introduction', p_text ->> 'highlights_heading', p_text -> 'highlights',
    p_text ->> 'suitability_intro', p_text -> 'suitability_points', p_text ->> 'itinerary_intro',
    p_text -> 'included', p_text -> 'excluded', p_text -> 'meal_trail_tips', p_text -> 'meal_teahouse_notes'
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

-- Langtang Valley, as on the website (apps/web/src/features/trek-detail/content/langtangValley.ts).
update public.treks set meal_budget_min_usd = 20, meal_budget_max_usd = 30 where slug = 'langtang-valley';
update public.trek_translations t
set included = '[
  {
    "title": "Ground transport",
    "text": "Kathmandu – Syabrubesi – Kathmandu by jeep or bus."
  },
  {
    "title": "Licensed guide and porters",
    "text": "first-aid trained, insured and fairly paid."
  },
  {
    "title": "Teahouse lodging",
    "text": "7 nights on the trek and 2 hotel nights in Kathmandu."
  },
  {
    "title": "Permits",
    "text": "Langtang National Park permit and TIMS card."
  },
  {
    "title": "Safety gear",
    "text": "pulse oximeter and first-aid kit."
  },
  {
    "title": "Airport transfers",
    "text": "arrival and departure in Kathmandu."
  }
]',
    excluded = '[
  {
    "title": "Meals on the trek",
    "text": "order freely from the menu (about $20–30 a day)."
  },
  {
    "title": "International airfare",
    "text": "flights to and from Kathmandu."
  },
  {
    "title": "Travel insurance",
    "text": "required, with helicopter rescue cover."
  },
  {
    "title": "Nepal tourist visa",
    "text": "on arrival at the airport."
  },
  {
    "title": "Lodge extras",
    "text": "hot showers, battery charging and Wi-Fi."
  }
]',
    meal_trail_tips = '[
  {
    "title": "“Dal bhat power”",
    "text": "unlimited refills of rice, lentils and vegetable curry. The best fuel at altitude."
  },
  {
    "title": "Go vegetarian higher up",
    "text": "meat is carried up without refrigeration, so we suggest vegetarian meals above Lama Hotel."
  },
  {
    "title": "Stay hydrated",
    "text": "drink 3–4 litres a day (ginger-lemon-honey tea, garlic soup, boiled water)."
  },
  {
    "title": "Cash is king",
    "text": "there are no ATMs on the trail. Bring enough Nepali rupees from Kathmandu."
  }
]',
    meal_teahouse_notes = '[
  {
    "title": "Teahouse rule",
    "text": "eat breakfast and dinner where you sleep. Lodges keep room prices low because of it."
  },
  {
    "title": "Order early",
    "text": "order dinner around 5 pm and choose your breakfast time the night before."
  },
  {
    "title": "Small extras",
    "text": "showers, charging and Wi-Fi cost a few dollars each higher up."
  }
]'
from public.treks k
where k.id = t.trek_id and k.slug = 'langtang-valley' and t.locale = 'en';
