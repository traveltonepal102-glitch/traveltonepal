-- Trekking guides (design: Admin-people, tab "Trekking guides"; data shape: the website's TrekGuide).
-- Each guide is added once and picked from a list on treks, regions and the About page.
-- trekking_guides holds what every language shares; trekking_guide_translations the text shown on the site.
-- Admins add and edit; only a Super admin removes a guide (it also leaves every trek it was on).

create type public.first_aid_level as enum ('wfr', 'basic', 'none');

create table public.trekking_guides (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 80),
  photo_id uuid references public.photos (id) on delete restrict,
  -- Home village and district, e.g. "Briddim, Rasuwa".
  home text not null default '' check (char_length(home) <= 80),
  age smallint check (age between 18 and 90),
  years_guiding smallint check (years_guiding between 0 and 60),
  -- Icon of the specialty shown on the photo (its words are in the translations).
  specialty_icon text not null default 'mountain_flag'
    check (specialty_icon in ('mountain_flag', 'temple_buddhist', 'person', 'medical_services', 'hiking', 'groups', 'landscape')),
  languages text[] not null default '{}' check (cardinality(languages) <= 10),
  -- Admin only: never shown on the website. The site shows "Licensed" while it is valid.
  licence_number text not null default '' check (char_length(licence_number) <= 40),
  licence_valid_until date check (licence_valid_until between date '2000-01-01' and date '2100-12-31'),
  first_aid public.first_aid_level not null default 'none',
  -- Where the guide appears.
  show_on_about boolean not null default true,
  can_lead_treks boolean not null default true,
  can_fact_check boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index trekking_guides_photo_id_idx on public.trekking_guides (photo_id);

create table public.trekking_guide_translations (
  guide_id uuid not null references public.trekking_guides (id) on delete cascade,
  locale text not null check (locale in ('en', 'de')),
  role text not null check (char_length(role) between 1 and 80),
  -- On the photo, e.g. "Langtang local".
  specialty text not null default '' check (char_length(specialty) <= 30),
  bio text not null default '' check (char_length(bio) <= 300),
  -- A line in the guide's own words.
  quote text not null default '' check (char_length(quote) <= 200),
  primary key (guide_id, locale)
);

-- The regions a guide leads treks in (suggests them on those treks, and the website's region filter).
create table public.trekking_guide_regions (
  guide_id uuid not null references public.trekking_guides (id) on delete cascade,
  region_id uuid not null references public.regions (id) on delete cascade,
  primary key (guide_id, region_id)
);

create index trekking_guide_regions_region_id_idx on public.trekking_guide_regions (region_id);

alter table public.trekking_guides enable row level security;
alter table public.trekking_guide_translations enable row level security;
alter table public.trekking_guide_regions enable row level security;

grant select, insert, update, delete on public.trekking_guides, public.trekking_guide_translations, public.trekking_guide_regions to authenticated;

create policy "Admins read guides" on public.trekking_guides for select to authenticated using ((select public.is_admin()));
create policy "Admins add guides" on public.trekking_guides for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit guides" on public.trekking_guides
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Super admins remove guides" on public.trekking_guides for delete to authenticated using ((select public.is_super_admin()));

create policy "Admins read guide text" on public.trekking_guide_translations for select to authenticated using ((select public.is_admin()));
create policy "Admins add guide text" on public.trekking_guide_translations for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit guide text" on public.trekking_guide_translations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove guide text" on public.trekking_guide_translations for delete to authenticated using ((select public.is_admin()));

create policy "Admins read guide regions" on public.trekking_guide_regions for select to authenticated using ((select public.is_admin()));
create policy "Admins add guide regions" on public.trekking_guide_regions for insert to authenticated with check ((select public.is_admin()));
create policy "Admins remove guide regions" on public.trekking_guide_regions for delete to authenticated using ((select public.is_admin()));

-- Adds (p_guide_id null) or updates a guide, its text in p_locale and its regions, in one transaction.
create function public.save_trekking_guide(p_guide_id uuid, p_locale text, p_guide jsonb, p_text jsonb, p_region_ids jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
begin
  if jsonb_array_length(p_region_ids) > 20 then
    raise exception 'Too many regions' using errcode = '22023';
  end if;

  if p_guide_id is null then
    insert into public.trekking_guides (
      name, photo_id, home, age, years_guiding, specialty_icon, languages, licence_number, licence_valid_until,
      first_aid, show_on_about, can_lead_treks, can_fact_check, updated_by
    )
    values (
      p_guide ->> 'name', nullif(p_guide ->> 'photo_id', '')::uuid, p_guide ->> 'home',
      (p_guide ->> 'age')::smallint, (p_guide ->> 'years_guiding')::smallint, p_guide ->> 'specialty_icon',
      array(select jsonb_array_elements_text(p_guide -> 'languages')), p_guide ->> 'licence_number',
      nullif(p_guide ->> 'licence_valid_until', '')::date, (p_guide ->> 'first_aid')::public.first_aid_level,
      (p_guide ->> 'show_on_about')::boolean, (p_guide ->> 'can_lead_treks')::boolean, (p_guide ->> 'can_fact_check')::boolean,
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.trekking_guides
    set name = p_guide ->> 'name',
        photo_id = nullif(p_guide ->> 'photo_id', '')::uuid,
        home = p_guide ->> 'home',
        age = (p_guide ->> 'age')::smallint,
        years_guiding = (p_guide ->> 'years_guiding')::smallint,
        specialty_icon = p_guide ->> 'specialty_icon',
        languages = array(select jsonb_array_elements_text(p_guide -> 'languages')),
        licence_number = p_guide ->> 'licence_number',
        licence_valid_until = nullif(p_guide ->> 'licence_valid_until', '')::date,
        first_aid = (p_guide ->> 'first_aid')::public.first_aid_level,
        show_on_about = (p_guide ->> 'show_on_about')::boolean,
        can_lead_treks = (p_guide ->> 'can_lead_treks')::boolean,
        can_fact_check = (p_guide ->> 'can_fact_check')::boolean,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_guide_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Guide not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.trekking_guide_translations as t (guide_id, locale, role, specialty, bio, quote)
  values (saved_id, p_locale, p_text ->> 'role', p_text ->> 'specialty', p_text ->> 'bio', p_text ->> 'quote')
  on conflict (guide_id, locale) do update
  set role = excluded.role, specialty = excluded.specialty, bio = excluded.bio, quote = excluded.quote;

  delete from public.trekking_guide_regions where guide_id = saved_id;
  insert into public.trekking_guide_regions (guide_id, region_id)
  select distinct saved_id, r.region_id::uuid from jsonb_array_elements_text(p_region_ids) as r (region_id);

  return saved_id;
end;
$$;

revoke execute on function public.save_trekking_guide(uuid, text, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.save_trekking_guide(uuid, text, jsonb, jsonb, jsonb) to authenticated;
