-- Regions (design: Admin-regions and Admin-region-editor).
-- regions holds what every language shares (web address, map pin, months); region_translations holds the
-- text, one row per language ('en' now, 'de' for the German version later).
-- Admins read and edit through RLS; only a Super admin adds a region. Nothing is deleted from the admin.

-- 1. Who may do what. current_admin() already checks the session (signed in, not revoked, under 7 days).
create function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (select 1 from public.current_admin());
$$;

create function public.is_super_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select exists (select 1 from public.current_admin() a where a.role = 'super_admin');
$$;

revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.is_super_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_super_admin() to authenticated;

-- 2. Tables.
create type public.month_rating as enum ('best', 'possible', 'avoid');

create table public.regions (
  id uuid primary key default gen_random_uuid(),
  -- traveltonepal.com/regions/<slug>
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  district text not null default '' check (char_length(district) <= 80),
  -- The region's own website. Set by the developer (SQL), read-only in the admin.
  website_domain text,
  latitude numeric(7, 4) check (latitude between 26 and 31),
  longitude numeric(7, 4) check (longitude between 80 and 89),
  -- Jan–Dec.
  month_ratings public.month_rating[] not null default array_fill('avoid'::public.month_rating, array[12])
    check (cardinality(month_ratings) = 12),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  check ((latitude is null) = (longitude is null))
);

create table public.region_translations (
  region_id uuid not null references public.regions (id) on delete cascade,
  locale text not null check (locale in ('en', 'de')),
  name text not null check (char_length(name) between 1 and 80),
  pin_label text not null default '' check (char_length(pin_label) <= 40),
  tagline text not null default '' check (char_length(tagline) <= 140),
  introduction text not null default '' check (char_length(introduction) <= 4000),
  best_for text[] not null default '{}' check (cardinality(best_for) <= 3),
  highest_point text not null default '' check (char_length(highest_point) <= 80),
  trek_length text not null default '' check (char_length(trek_length) <= 80),
  difficulty text not null default '' check (char_length(difficulty) <= 80),
  getting_there text not null default '' check (char_length(getting_there) <= 80),
  getting_there_details text not null default '' check (char_length(getting_there_details) <= 200),
  permits text not null default '' check (char_length(permits) <= 80),
  season_spring text not null default '' check (char_length(season_spring) <= 400),
  season_monsoon text not null default '' check (char_length(season_monsoon) <= 400),
  season_autumn text not null default '' check (char_length(season_autumn) <= 400),
  season_winter text not null default '' check (char_length(season_winter) <= 400),
  -- [{ "question": "…", "answer": "…" }], in display order.
  faqs jsonb not null default '[]' check (jsonb_typeof(faqs) = 'array' and jsonb_array_length(faqs) <= 20),
  seo_keyword text not null default '' check (char_length(seo_keyword) <= 80),
  seo_title text not null default '' check (char_length(seo_title) <= 70),
  seo_description text not null default '' check (char_length(seo_description) <= 200),
  updated_at timestamptz not null default now(),
  primary key (region_id, locale)
);

-- 3. Access: admins only, no deleting.
alter table public.regions enable row level security;
alter table public.region_translations enable row level security;

grant select, insert, update on public.regions to authenticated;
grant select, insert, update on public.region_translations to authenticated;

create policy "Admins read regions" on public.regions
  for select to authenticated using ((select public.is_admin()));
create policy "Super admins add regions" on public.regions
  for insert to authenticated with check ((select public.is_super_admin()));
create policy "Admins edit regions" on public.regions
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins read region text" on public.region_translations
  for select to authenticated using ((select public.is_admin()));
create policy "Admins add region text" on public.region_translations
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit region text" on public.region_translations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

-- 4. Save a region and its text in one transaction (runs as the caller, so the policies above apply).
-- p_region_id null adds a region. Returns the region id.
create function public.save_region(p_region_id uuid, p_locale text, p_region jsonb, p_text jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
  ratings public.month_rating[] := array(
    select jsonb_array_elements_text(p_region -> 'month_ratings')::public.month_rating
  );
begin
  if p_region_id is null then
    insert into public.regions (slug, district, latitude, longitude, month_ratings, updated_by)
    values (
      p_region ->> 'slug',
      p_region ->> 'district',
      (p_region ->> 'latitude')::numeric,
      (p_region ->> 'longitude')::numeric,
      ratings,
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
    highest_point, trek_length, difficulty, getting_there, getting_there_details, permits,
    season_spring, season_monsoon, season_autumn, season_winter, faqs,
    seo_keyword, seo_title, seo_description
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'pin_label', p_text ->> 'tagline', p_text ->> 'introduction',
    array(select jsonb_array_elements_text(p_text -> 'best_for')),
    p_text ->> 'highest_point', p_text ->> 'trek_length', p_text ->> 'difficulty', p_text ->> 'getting_there',
    p_text ->> 'getting_there_details', p_text ->> 'permits',
    p_text ->> 'season_spring', p_text ->> 'season_monsoon', p_text ->> 'season_autumn', p_text ->> 'season_winter',
    p_text -> 'faqs', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description'
  )
  on conflict (region_id, locale) do update
  set name = excluded.name,
      pin_label = excluded.pin_label,
      tagline = excluded.tagline,
      introduction = excluded.introduction,
      best_for = excluded.best_for,
      highest_point = excluded.highest_point,
      trek_length = excluded.trek_length,
      difficulty = excluded.difficulty,
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
      updated_at = now();

  return saved_id;
end;
$$;

revoke execute on function public.save_region(uuid, text, jsonb, jsonb) from public, anon;
grant execute on function public.save_region(uuid, text, jsonb, jsonb) to authenticated;

-- 5. The 9 regions the website already shows (apps/web/src/features/regions), west to east.
with seed (slug, name, district, latitude, longitude, months, tagline, best_for, highest_point, trek_length,
           difficulty, getting_there, getting_there_details, permits) as (
  values
    ('annapurna', 'Annapurna', 'Gandaki', 28.62, 83.9, 'ooggg xxx oggo',
     'The most varied region: rice terraces, rhododendron forest, the Annapurna Sanctuary and the high desert beyond Thorong La.',
     'Variety', '5,416 m', '5–21 days', 'Easy–challenging', 'Pokhara', 'Drive or fly to Pokhara', 'ACAP + TIMS'),
    ('mardi-himal', 'Mardi Himal', 'Gandaki', 28.42, 83.85, 'ooggg xxx oggo',
     'A quiet ridge walk straight up towards Machapuchare, ideal when you only have a week.',
     'Short trek', '4,500 m', '5–8 days', 'Moderate', 'Pokhara', 'Short drive from Pokhara', 'ACAP + TIMS'),
    ('nar-phu', 'Nar Phu', 'Manang', 28.78, 84.2, 'xxogg ooo gggx',
     'Medieval stone villages and Tibetan culture in a hidden valley north of Annapurna, over the Kang La.',
     'Hidden villages', '5,320 m', '10–14 days', 'Challenging', 'Drive', 'Drive to Koto via Besisahar', 'Restricted area + ACAP'),
    ('manaslu', 'Manaslu', 'Gorkha', 28.55, 84.58, 'xxggo xxx oggo',
     'A wild circuit around the world''s eighth-highest mountain, crossing the Larkya La, with far fewer trekkers.',
     'Remote circuit', '5,106 m', '14–18 days', 'Challenging', 'Drive', 'Drive to Soti Khola or Machha Khola',
     'Restricted area + MCAP + ACAP'),
    ('tamang-heritage-trail', 'Tamang Heritage Trail', 'Rasuwa', 28.18, 85.25, 'ooggo xxx oggg',
     'Village homestays, hot springs and Tamang traditions near the Tibet border. Gentle and cultural.',
     'Culture', '3,165 m', '6–8 days', 'Easy', 'Drive', 'Drive to Syabrubesi', 'Langtang NP + TIMS'),
    ('langtang', 'Langtang', 'Rasuwa', 28.21, 85.56, 'ooggg xxx oggo',
     'Glaciers, yak pastures and the monastery at Kyanjin Gompa, the closest big-mountain valley to Kathmandu.',
     'Close to Kathmandu', '4,984 m', '7–12 days', 'Moderate', 'Drive', 'Drive to Syabrubesi (7–8 hrs)', 'Langtang NP + TIMS'),
    ('pikey-peak', 'Pikey Peak', 'Solukhumbu', 27.56, 86.58, 'ooggg xxx oggg',
     'A short trek in Sherpa country with one of the widest Himalayan panoramas, from Everest to Kanchenjunga.',
     'Everest views', '4,065 m', '5–8 days', 'Easy–moderate', 'Drive', 'Drive towards Dhap / Phaplu', ''),
    ('everest', 'Everest', 'Khumbu', 27.98, 86.85, 'ooggg xxx oggo',
     'Sherpa villages, monasteries and the classic walk to Everest Base Camp and Kala Patthar.',
     'Iconic peaks', '5,545 m', '12–16 days', 'Challenging', 'Fly to Lukla', 'Flight to Lukla', 'Sagarmatha NP + Khumbu local permit'),
    ('kanchenjunga', 'Kanchenjunga', 'Taplejung', 27.7, 87.95, 'xxogg xxx oggx',
     'A long expedition-style trek in the far east to the base camps of the world''s third-highest mountain.',
     'True wilderness', '5,143 m', '20–25 days', 'Strenuous', 'Fly + drive', 'Fly to Bhadrapur, drive to Taplejung',
     'Restricted area + KCAP')
),
inserted as (
  insert into public.regions (slug, district, latitude, longitude, month_ratings)
  select
    s.slug, s.district, s.latitude, s.longitude,
    array(
      select case letter when 'g' then 'best' when 'o' then 'possible' else 'avoid' end::public.month_rating
      from unnest(string_to_array(replace(s.months, ' ', ''), null)) with ordinality as m (letter, n)
      order by n
    )
  from seed s
  returning id, slug
)
insert into public.region_translations (
  region_id, locale, name, pin_label, tagline, best_for, highest_point, trek_length, difficulty,
  getting_there, getting_there_details, permits
)
select i.id, 'en', s.name, s.name, s.tagline, array[s.best_for], s.highest_point, s.trek_length, s.difficulty,
       s.getting_there, s.getting_there_details, s.permits
from inserted i
join seed s on s.slug = i.slug;
