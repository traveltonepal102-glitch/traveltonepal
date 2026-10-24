-- Trekking guides: the fields of the reworked guide form (design: Admin-people, "Trekking guides").
-- - Photo consent: the guide agreed that we show their photo and name.
-- - Home village and home district as two fields (the card prints "Village, District").
-- - "Badge on the photo" is one of six fixed badges, each with its own icon (was free words plus an icon).
-- - "Training and certificates" is a checklist (was one first aid level); WFR and first aid have an end month.
--   The licence is not in the list: the card's "Govt. licence" and "Licensed" come from a valid licence number.

create type public.guide_badge as enum ('local', 'culture', 'solo', 'rescue', 'family', 'photo');

alter table public.trekking_guides
  add column photo_consent boolean not null default false,
  add column home_village text not null default '' check (char_length(home_village) <= 60),
  add column home_district text not null default '' check (char_length(home_district) <= 60),
  add column badge public.guide_badge not null default 'local',
  add column certificates text[] not null default '{}'
    check (certificates <@ array['nathm', 'wfr', 'first_aid', 'nma', 'language']::text[]),
  -- Stored as the month's first day, like licence_valid_until; only with the certificate ticked.
  add column wfr_valid_until date check (wfr_valid_until between date '2000-01-01' and date '2100-12-31'),
  add column first_aid_valid_until date check (first_aid_valid_until between date '2000-01-01' and date '2100-12-31'),
  add check (wfr_valid_until is null or 'wfr' = any (certificates)),
  add check (first_aid_valid_until is null or 'first_aid' = any (certificates));

-- "Briddim, Rasuwa" → village Briddim, district Rasuwa; a single word is taken as the district.
update public.trekking_guides
set home_village = case when home like '%,%' then btrim(split_part(home, ',', 1)) else '' end,
    home_district = case when home like '%,%' then btrim(substr(home, strpos(home, ',') + 1)) else btrim(home) end;

update public.trekking_guides
set badge = case specialty_icon
      when 'temple_buddhist' then 'culture'
      when 'person' then 'solo'
      when 'medical_services' then 'rescue'
      when 'groups' then 'family'
      else 'local'
    end::public.guide_badge,
    certificates = case first_aid when 'wfr' then array['wfr'] when 'basic' then array['first_aid'] else '{}' end;

alter table public.trekking_guides drop column home, drop column specialty_icon, drop column first_aid;
alter table public.trekking_guide_translations drop column specialty;

-- Same arguments; p_guide carries the new fields instead of home, specialty_icon and first_aid, p_text no specialty.
create or replace function public.save_trekking_guide(p_guide_id uuid, p_locale text, p_guide jsonb, p_text jsonb, p_region_ids jsonb)
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
      name, photo_id, photo_consent, home_village, home_district, age, years_guiding, badge, languages,
      licence_number, licence_valid_until, certificates, wfr_valid_until, first_aid_valid_until,
      show_on_about, can_lead_treks, can_fact_check, updated_by
    )
    values (
      p_guide ->> 'name', nullif(p_guide ->> 'photo_id', '')::uuid, (p_guide ->> 'photo_consent')::boolean,
      p_guide ->> 'home_village', p_guide ->> 'home_district',
      (p_guide ->> 'age')::smallint, (p_guide ->> 'years_guiding')::smallint, (p_guide ->> 'badge')::public.guide_badge,
      array(select jsonb_array_elements_text(p_guide -> 'languages')),
      p_guide ->> 'licence_number', nullif(p_guide ->> 'licence_valid_until', '')::date,
      array(select jsonb_array_elements_text(p_guide -> 'certificates')),
      nullif(p_guide ->> 'wfr_valid_until', '')::date, nullif(p_guide ->> 'first_aid_valid_until', '')::date,
      (p_guide ->> 'show_on_about')::boolean, (p_guide ->> 'can_lead_treks')::boolean, (p_guide ->> 'can_fact_check')::boolean,
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.trekking_guides
    set name = p_guide ->> 'name',
        photo_id = nullif(p_guide ->> 'photo_id', '')::uuid,
        photo_consent = (p_guide ->> 'photo_consent')::boolean,
        home_village = p_guide ->> 'home_village',
        home_district = p_guide ->> 'home_district',
        age = (p_guide ->> 'age')::smallint,
        years_guiding = (p_guide ->> 'years_guiding')::smallint,
        badge = (p_guide ->> 'badge')::public.guide_badge,
        languages = array(select jsonb_array_elements_text(p_guide -> 'languages')),
        licence_number = p_guide ->> 'licence_number',
        licence_valid_until = nullif(p_guide ->> 'licence_valid_until', '')::date,
        certificates = array(select jsonb_array_elements_text(p_guide -> 'certificates')),
        wfr_valid_until = nullif(p_guide ->> 'wfr_valid_until', '')::date,
        first_aid_valid_until = nullif(p_guide ->> 'first_aid_valid_until', '')::date,
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

  insert into public.trekking_guide_translations as t (guide_id, locale, role, bio, quote)
  values (saved_id, p_locale, p_text ->> 'role', p_text ->> 'bio', p_text ->> 'quote')
  on conflict (guide_id, locale) do update
  set role = excluded.role, bio = excluded.bio, quote = excluded.quote;

  delete from public.trekking_guide_regions where guide_id = saved_id;
  insert into public.trekking_guide_regions (guide_id, region_id)
  select distinct saved_id, r.region_id::uuid from jsonb_array_elements_text(p_region_ids) as r (region_id);

  return saved_id;
end;
$$;

drop type public.first_aid_level;
