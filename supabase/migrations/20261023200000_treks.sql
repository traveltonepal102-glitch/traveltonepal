-- Treks, step 1 (design: Admin-treks and Admin-trek-editor; data shape: the website's trek page).
-- treks holds what every language shares (region, numbers, status, photos); trek_translations holds the text.
-- Each trek belongs to exactly one region. Admins read, add and edit through RLS; nothing is deleted here.

create type public.trek_status as enum ('draft', 'published', 'hidden');
create type public.trek_difficulty as enum ('easy', 'moderate', 'challenging', 'strenuous');
create type public.trek_season as enum ('spring', 'autumn', 'winter', 'monsoon');
create type public.trek_tag as enum ('classic', 'off-the-beaten-path');

create table public.treks (
  id uuid primary key default gen_random_uuid(),
  -- traveltonepal.com/treks/<slug>
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  region_id uuid not null references public.regions (id) on delete restrict,
  -- Only published treks will show on the website.
  status public.trek_status not null default 'draft',
  difficulty public.trek_difficulty not null default 'moderate',
  -- 1 (easiest) to 5, shown as "grade 3 of 5".
  grade smallint not null default 3 check (grade between 1 and 5),
  days smallint not null check (days between 1 and 60),
  max_altitude_m integer not null check (max_altitude_m between 500 and 9000),
  distance_km integer check (distance_km between 1 and 2000),
  -- Seasons the trek suits (the website's season filter) and its character (the "quiet trails" chips).
  seasons public.trek_season[] not null default '{}',
  tags public.trek_tag[] not null default '{}',
  is_popular boolean not null default false,
  -- "From" price per person in US dollars, until group prices are in the editor (they will set it).
  price_from_usd integer check (price_from_usd between 1 and 100000),
  cover_photo_id uuid references public.photos (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index treks_region_id_idx on public.treks (region_id);

create table public.trek_translations (
  trek_id uuid not null references public.treks (id) on delete cascade,
  locale text not null check (locale in ('en', 'de')),
  name text not null check (char_length(name) between 1 and 120),
  -- One line on the trek cards.
  summary text not null default '' check (char_length(summary) <= 200),
  -- Short label on the card photo, e.g. "Best value".
  card_badge text not null default '' check (char_length(card_badge) <= 30),
  -- Up to 3 selling points on the main photo: [{ "label", "icon", "tone" }].
  photo_badges jsonb not null default '[]' check (jsonb_typeof(photo_badges) = 'array' and jsonb_array_length(photo_badges) <= 3),
  -- Trip facts (the boxes under the photo on the trek page).
  start_finish text not null default '' check (char_length(start_finish) <= 80),
  daily_walking text not null default '' check (char_length(daily_walking) <= 80),
  guide_ratio text not null default '' check (char_length(guide_ratio) <= 80),
  season_label text not null default '' check (char_length(season_label) <= 80),
  accommodation text not null default '' check (char_length(accommodation) <= 80),
  transport text not null default '' check (char_length(transport) <= 80),
  updated_at timestamptz not null default now(),
  primary key (trek_id, locale)
);

create table public.trek_photos (
  trek_id uuid not null references public.treks (id) on delete cascade,
  photo_id uuid not null references public.photos (id) on delete restrict,
  position smallint not null check (position between 0 and 29),
  primary key (trek_id, photo_id)
);

create index trek_photos_photo_id_idx on public.trek_photos (photo_id);

-- Access: admins only (any admin may add a trek), no deleting.
alter table public.treks enable row level security;
alter table public.trek_translations enable row level security;
alter table public.trek_photos enable row level security;

grant select, insert, update on public.treks to authenticated;
grant select, insert, update on public.trek_translations to authenticated;
grant select, insert, update, delete on public.trek_photos to authenticated;

create policy "Admins read treks" on public.treks for select to authenticated using ((select public.is_admin()));
create policy "Admins add treks" on public.treks for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit treks" on public.treks
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins read trek text" on public.trek_translations for select to authenticated using ((select public.is_admin()));
create policy "Admins add trek text" on public.trek_translations for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit trek text" on public.trek_translations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins read trek photos" on public.trek_photos for select to authenticated using ((select public.is_admin()));
create policy "Admins add trek photos" on public.trek_photos for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit trek photos" on public.trek_photos
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove trek photos" on public.trek_photos for delete to authenticated using ((select public.is_admin()));

-- Save a trek, its text and its photos in one transaction (runs as the caller, so the policies apply).
-- p_trek_id null adds a trek. p_photos: { gallery: [photo ids in order], details: [{ id, place }] }.
-- Untagged photos get the trek's region.
create function public.save_trek(p_trek_id uuid, p_locale text, p_trek jsonb, p_text jsonb, p_photos jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
  region uuid := (p_trek ->> 'region_id')::uuid;
begin
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
    start_finish, daily_walking, guide_ratio, season_label, accommodation, transport
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'summary', p_text ->> 'card_badge', p_text -> 'photo_badges',
    p_text ->> 'start_finish', p_text ->> 'daily_walking', p_text ->> 'guide_ratio', p_text ->> 'season_label',
    p_text ->> 'accommodation', p_text ->> 'transport'
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

  return saved_id;
end;
$$;

revoke execute on function public.save_trek(uuid, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.save_trek(uuid, text, jsonb, jsonb, jsonb) to authenticated;

-- The 12 treks the website lists (apps/web/src/features/treks/treks.ts), all as drafts.
with seed (slug, region_slug, name, summary, days, max_m, difficulty, grade, price, season_label, seasons, tags, badge, popular) as (
  values
    ('everest-base-camp', 'everest', 'Everest Base Camp Trek',
     'The classic Khumbu trek to Everest Base Camp and sunrise on Kala Patthar.',
     14, 5545, 'challenging', 4, 1000, 'Mar–May, Oct–Nov', '{spring,autumn}', '{classic}', 'Most popular', true),
    ('gokyo-lakes', 'everest', 'Gokyo Lakes Trek',
     'Turquoise glacial lakes and Gokyo Ri, a quieter way into the Everest region.',
     12, 5357, 'challenging', 4, null, 'Mar–May, Oct–Nov', '{spring,autumn}', '{off-the-beaten-path}', '', false),
    ('annapurna-circuit', 'annapurna', 'Annapurna Circuit Trek',
     'From rice terraces to high desert over the Thorong La pass.',
     16, 5416, 'challenging', 4, 1150, 'Mar–May, Oct–Nov', '{spring,autumn}', '{classic}', '', true),
    ('annapurna-base-camp', 'annapurna', 'Annapurna Base Camp Trek',
     'Into the Annapurna Sanctuary, ringed by 7,000 m peaks.',
     11, 4130, 'moderate', 3, null, 'Mar–May, Oct–Nov', '{spring,autumn}', '{classic}', '', true),
    ('poon-hill', 'annapurna', 'Poon Hill Trek',
     'Rhododendron forest and a famous sunrise over Dhaulagiri and Annapurna.',
     5, 3210, 'easy', 2, null, 'All year except monsoon', '{spring,autumn,winter}', '{classic}', 'Short', false),
    ('manaslu-circuit', 'manaslu', 'Manaslu Circuit Trek',
     'A wild circuit around the eighth-highest mountain and the Larkya La.',
     15, 5106, 'challenging', 4, 1280, 'Mar–May, Oct–Nov', '{spring,autumn}', '{off-the-beaten-path}', '', false),
    ('langtang-valley', 'langtang', 'Langtang Valley Trek',
     'Glaciers, yak pastures and Tamang villages, close to Kathmandu with no flights.',
     10, 4773, 'moderate', 3, 890, 'Mar–May, Oct–Nov', '{spring,autumn}', '{classic}', 'Best value', true),
    ('tamang-heritage-trail', 'tamang-heritage-trail', 'Tamang Heritage Trail',
     'Village homestays, hot springs and Tamang culture near the Tibet border.',
     7, 3165, 'easy', 2, null, 'Mar–May, Oct–Dec', '{spring,autumn,winter}', '{off-the-beaten-path}', '', false),
    ('mardi-himal', 'mardi-himal', 'Mardi Himal Trek',
     'A short ridge trek to close views of Machapuchare above Pokhara.',
     7, 4500, 'moderate', 3, null, 'Mar–May, Oct–Nov', '{spring,autumn}', '{off-the-beaten-path}', 'Short', false),
    ('kanchenjunga-base-camp', 'kanchenjunga', 'Kanchenjunga Base Camp Trek',
     'A long, remote expedition to both base camps of the world''s third-highest peak.',
     22, 5143, 'strenuous', 5, null, 'Apr–May, Oct–Nov', '{spring,autumn}', '{off-the-beaten-path}', '', false),
    ('nar-phu-valley', 'nar-phu', 'Nar Phu Valley Trek',
     'Hidden medieval villages and the Kang La pass in a restricted area.',
     13, 5320, 'challenging', 4, null, 'Apr–Nov', '{spring,monsoon,autumn}', '{off-the-beaten-path}', '', false),
    ('pikey-peak', 'pikey-peak', 'Pikey Peak Trek',
     'A short Sherpa-country trek with a panorama from Everest to Kanchenjunga.',
     7, 4065, 'easy', 2, null, 'Mar–May, Oct–Dec', '{spring,autumn,winter}', '{off-the-beaten-path}', '', false)
),
inserted as (
  insert into public.treks (slug, region_id, difficulty, grade, days, max_altitude_m, seasons, tags, is_popular, price_from_usd)
  select s.slug, r.id, s.difficulty::public.trek_difficulty, s.grade, s.days, s.max_m,
         s.seasons::public.trek_season[], s.tags::public.trek_tag[], s.popular, s.price
  from seed s
  join public.regions r on r.slug = s.region_slug
  returning id, slug
)
insert into public.trek_translations (trek_id, locale, name, summary, card_badge, season_label)
select i.id, 'en', s.name, s.summary, s.badge, s.season_label
from inserted i
join seed s on s.slug = i.slug;

-- Langtang Valley's trip facts and photo badges (the one trek page the website has in full).
update public.treks set distance_km = 75 where slug = 'langtang-valley';
update public.trek_translations t
set start_finish = 'Kathmandu / Syabrubesi',
    daily_walking = '5 to 7 hours a day',
    guide_ratio = '1 : 4 + porters',
    accommodation = 'Teahouse and hotel',
    transport = 'Jeep to Syabrubesi',
    photo_badges = '[
      {"label": "No flights needed", "icon": "route", "tone": "brand"},
      {"label": "Local guide-led", "icon": "nordic_walking", "tone": "green"},
      {"label": "Gradual ascent", "icon": "health_and_safety", "tone": "brand"}
    ]'
from public.treks k
where k.id = t.trek_id and k.slug = 'langtang-valley' and t.locale = 'en';
