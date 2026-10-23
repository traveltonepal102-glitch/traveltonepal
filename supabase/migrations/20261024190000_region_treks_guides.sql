-- Regions: the Treks and Guides sections (design: Admin-region-editor; data shape: the website's region page).
-- Treks: a region's treks are the treks whose region it is (nothing to store). The region picks one of them as
-- its featured trek (with a label and a pitch), suggests nearby treks from other regions (each with a label and
-- a note), and has a line inviting a custom route.
-- Guides: every trekking guide who has this region in their regions is shown automatically; the region only
-- stores the guides switched off for its page, so a new guide appears without anyone forgetting to add them.

alter table public.regions
  add column featured_trek_id uuid references public.treks (id) on delete set null;

alter table public.region_translations
  -- e.g. "Our signature Langtang trek"
  add column featured_trek_label text not null default '' check (char_length(featured_trek_label) <= 60),
  add column featured_trek_pitch text not null default '' check (char_length(featured_trek_pitch) <= 300),
  -- "Want your own route?" e.g. "Langtang + Tamang Heritage, a shorter version, or Tserko Ri."
  add column custom_route_pitch text not null default '' check (char_length(custom_route_pitch) <= 300);

create table public.region_nearby_treks (
  region_id uuid not null references public.regions (id) on delete cascade,
  trek_id uuid not null references public.treks (id) on delete cascade,
  position smallint not null check (position between 0 and 5),
  primary key (region_id, trek_id)
);

create index region_nearby_treks_trek_id_idx on public.region_nearby_treks (trek_id);

create table public.region_nearby_trek_translations (
  region_id uuid not null,
  trek_id uuid not null,
  locale text not null check (locale in ('en', 'de')),
  -- e.g. "Nearby · same trailhead"
  label text not null default '' check (char_length(label) <= 40),
  note text not null default '' check (char_length(note) <= 160),
  primary key (region_id, trek_id, locale),
  foreign key (region_id, trek_id) references public.region_nearby_treks (region_id, trek_id) on delete cascade
);

create table public.region_hidden_guides (
  region_id uuid not null references public.regions (id) on delete cascade,
  guide_id uuid not null references public.trekking_guides (id) on delete cascade,
  primary key (region_id, guide_id)
);

create index region_hidden_guides_guide_id_idx on public.region_hidden_guides (guide_id);

alter table public.region_nearby_treks enable row level security;
alter table public.region_nearby_trek_translations enable row level security;
alter table public.region_hidden_guides enable row level security;

grant select, insert, update, delete on public.region_nearby_treks, public.region_nearby_trek_translations, public.region_hidden_guides to authenticated;

create policy "Admins read nearby treks" on public.region_nearby_treks for select to authenticated using ((select public.is_admin()));
create policy "Admins add nearby treks" on public.region_nearby_treks for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit nearby treks" on public.region_nearby_treks
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove nearby treks" on public.region_nearby_treks for delete to authenticated using ((select public.is_admin()));

create policy "Admins read nearby trek text" on public.region_nearby_trek_translations for select to authenticated using ((select public.is_admin()));
create policy "Admins add nearby trek text" on public.region_nearby_trek_translations for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit nearby trek text" on public.region_nearby_trek_translations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove nearby trek text" on public.region_nearby_trek_translations for delete to authenticated using ((select public.is_admin()));

create policy "Admins read hidden region guides" on public.region_hidden_guides for select to authenticated using ((select public.is_admin()));
create policy "Admins add hidden region guides" on public.region_hidden_guides for insert to authenticated with check ((select public.is_admin()));
create policy "Admins remove hidden region guides" on public.region_hidden_guides for delete to authenticated using ((select public.is_admin()));

-- save_region also saves the featured trek, nearby treks and hidden guides (p_region: featured_trek_id,
-- nearby_treks [{ trek_id, label, note }] in order, hidden_guide_ids) and the three lines (p_text).
-- Same arguments, so the grants stay as they are.

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
  if jsonb_array_length(coalesce(p_region -> 'nearby_treks', '[]')) > 6 then
    raise exception 'A region can suggest up to 6 nearby treks' using errcode = '22023';
  end if;

  if jsonb_array_length(p_photos -> 'gallery') > 30 then
    raise exception 'A region can have up to 30 gallery photos' using errcode = '22023';
  end if;

  if p_region_id is null then
    insert into public.regions (slug, district, latitude, longitude, month_ratings, cover_photo_id, featured_trek_id, updated_by)
    values (
      p_region ->> 'slug',
      p_region ->> 'district',
      (p_region ->> 'latitude')::numeric,
      (p_region ->> 'longitude')::numeric,
      ratings,
      cover_id,
      featured_id,
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
    seo_keyword, seo_title, seo_description, featured_trek_label, featured_trek_pitch, custom_route_pitch
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'pin_label', p_text ->> 'tagline', p_text -> 'introduction',
    array(select jsonb_array_elements_text(p_text -> 'best_for')),
    p_text ->> 'highest_point', p_text ->> 'trek_length', p_text ->> 'difficulty', p_text ->> 'getting_there',
    p_text ->> 'getting_there_details', p_text ->> 'permits',
    p_text ->> 'season_spring', p_text ->> 'season_monsoon', p_text ->> 'season_autumn', p_text ->> 'season_winter',
    p_text -> 'faqs', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description',
    p_text ->> 'featured_trek_label', p_text ->> 'featured_trek_pitch', p_text ->> 'custom_route_pitch'
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
      featured_trek_label = excluded.featured_trek_label,
      featured_trek_pitch = excluded.featured_trek_pitch,
      custom_route_pitch = excluded.custom_route_pitch,
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

  return saved_id;
end;
$$;


-- Langtang's treks, as on the website.
update public.regions r set featured_trek_id = k.id
from public.treks k where r.slug = 'langtang' and k.slug = 'langtang-valley' and k.region_id = r.id;

update public.region_translations t
set featured_trek_label = 'Our signature Langtang trek',
    featured_trek_pitch = 'From the river gorge at Syabrubesi to Kyanjin Gompa and a sunrise on Kyanjin Ri (4,773 m). Gradual climb, teahouse stays, local Tamang guides.',
    custom_route_pitch = 'Langtang + Tamang Heritage, a shorter version, or Tserko Ri. We plan it around your days.'
from public.regions r
where t.region_id = r.id and r.slug = 'langtang' and t.locale = 'en';

with nearby as (
  insert into public.region_nearby_treks (region_id, trek_id, position)
  select r.id, k.id, 0 from public.regions r, public.treks k where r.slug = 'langtang' and k.slug = 'tamang-heritage-trail'
  returning region_id, trek_id
)
insert into public.region_nearby_trek_translations (region_id, trek_id, locale, label, note)
select region_id, trek_id, 'en', 'Nearby · same trailhead', 'Village homestays and hot springs. Easy to combine with Langtang.' from nearby;
