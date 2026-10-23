-- Photo library (shared: regions now, treks and travel guides later) and region photos.
-- Files live in storage (development: Supabase Storage; production: S3 + CloudFront); rows here describe them.
-- A photo's sized files are <public storage>/<photo id>/<width>.webp, one per width in variant_widths.

-- 1. Development storage. photo-files is private: raw uploads (may still have GPS data, deleted after
--    processing) and cleaned full-size masters. photos is public: the sized WebP files only.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('photo-files', 'photo-files', false, 20971520, array['image/jpeg', 'image/png', 'image/webp']),
  ('photos', 'photos', true, 5242880, array['image/webp']);

-- Admins upload, read and delete in both buckets (the admin server uses the admin's own session).
create policy "Admins manage photo storage" on storage.objects
  for all to authenticated
  using (bucket_id in ('photo-files', 'photos') and (select public.is_admin()))
  with check (bucket_id in ('photo-files', 'photos') and (select public.is_admin()));

-- 2. The library.
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  -- Where it was taken, to offer it first in that region's photo pickers. Null: not tied to a region.
  region_id uuid references public.regions (id) on delete set null,
  -- The cleaned full-size copy in private storage, to make new sizes later without a new upload.
  master_key text not null check (char_length(master_key) <= 200),
  variant_widths integer[] not null check (cardinality(variant_widths) between 1 and 8),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  -- A tiny blurred preview (data URL), shown while the photo loads.
  placeholder text not null default '' check (char_length(placeholder) <= 3000),
  -- Optional; the website falls back to "<Region> region" when empty.
  description text not null default '' check (char_length(description) <= 200),
  -- Optional "taken at", e.g. "Kyanjin Gompa".
  place text not null default '' check (char_length(place) <= 80),
  original_name text not null default '' check (char_length(original_name) <= 200),
  byte_size integer not null check (byte_size > 0),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null,
  updated_at timestamptz not null default now()
);

create index photos_region_id_idx on public.photos (region_id);

-- 3. A region's cover (its own slot) and gallery (in order). A photo in use can't be deleted.
alter table public.regions
  add column cover_photo_id uuid references public.photos (id) on delete restrict;

create table public.region_photos (
  region_id uuid not null references public.regions (id) on delete cascade,
  photo_id uuid not null references public.photos (id) on delete restrict,
  position smallint not null check (position between 0 and 29),
  primary key (region_id, photo_id)
);

create index region_photos_photo_id_idx on public.region_photos (photo_id);

-- 4. Access: admins only.
alter table public.photos enable row level security;
alter table public.region_photos enable row level security;

grant select, insert, update on public.photos to authenticated;
grant select, insert, update, delete on public.region_photos to authenticated;

create policy "Admins read photos" on public.photos
  for select to authenticated using ((select public.is_admin()));
create policy "Admins add photos" on public.photos
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit photos" on public.photos
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins read region photos" on public.region_photos
  for select to authenticated using ((select public.is_admin()));
create policy "Admins add region photos" on public.region_photos
  for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit region photos" on public.region_photos
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove region photos" on public.region_photos
  for delete to authenticated using ((select public.is_admin()));

-- 5. save_region also saves the photos section, in the same transaction:
--    p_region.cover_photo_id, p_photos.gallery (photo ids in order) and p_photos.details
--    ([{ id, description, place }] for the cover and gallery photos). Untagged photos get this region.
drop function public.save_region(uuid, text, jsonb, jsonb);

create function public.save_region(p_region_id uuid, p_locale text, p_region jsonb, p_text jsonb, p_photos jsonb)
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
begin
  if jsonb_array_length(p_photos -> 'gallery') > 30 then
    raise exception 'A region can have up to 30 gallery photos' using errcode = '22023';
  end if;

  if p_region_id is null then
    insert into public.regions (slug, district, latitude, longitude, month_ratings, cover_photo_id, updated_by)
    values (
      p_region ->> 'slug',
      p_region ->> 'district',
      (p_region ->> 'latitude')::numeric,
      (p_region ->> 'longitude')::numeric,
      ratings,
      cover_id,
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
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'pin_label', p_text ->> 'tagline', p_text -> 'introduction',
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

  update public.photos p
  set description = d.description,
      place = d.place,
      region_id = coalesce(p.region_id, saved_id),
      updated_at = now()
  from jsonb_to_recordset(p_photos -> 'details') as d (id uuid, description text, place text)
  where p.id = d.id;

  delete from public.region_photos where region_id = saved_id;
  insert into public.region_photos (region_id, photo_id, position)
  select saved_id, g.photo_id::uuid, (g.n - 1)::smallint
  from jsonb_array_elements_text(p_photos -> 'gallery') with ordinality as g (photo_id, n);

  return saved_id;
end;
$$;

revoke execute on function public.save_region(uuid, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.save_region(uuid, text, jsonb, jsonb, jsonb) to authenticated;
