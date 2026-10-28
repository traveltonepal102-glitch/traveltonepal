-- About page redesign (decided 2026-10-29; design: About.dc.html): the page is built around four beliefs, so it holds
-- more photos, each in a fixed place. site_page_photos.position is now a numbered place on the page (About: 1 the
-- founder, 2 "flexible", 3–5 the three "open mind" villages); an empty place has no row. Site settings gains the PAN
-- registration certificate, shown next to the agency licence.

alter table public.site_page_photos drop constraint site_page_photos_position_check;
alter table public.site_page_photos add constraint site_page_photos_position_check check (position between 1 and 8);

-- p_photo_ids: the page's photo places in order, "" for an empty place (at most eight).
create or replace function public.save_site_page(p_slug text, p_page jsonb, p_photo_ids jsonb)
returns void
language plpgsql
set search_path = ''
as $$
declare
  founder uuid := nullif(p_page ->> 'founder_author_id', '')::uuid;
begin
  if founder is not null and not exists (select 1 from public.authors where id = founder and kind = 'office') then
    raise exception 'founder_kind' using errcode = '22023';
  end if;

  update public.site_pages
  set eyebrow = p_page ->> 'eyebrow',
      heading = p_page ->> 'heading',
      intro = p_page ->> 'intro',
      seo_title = p_page ->> 'seo_title',
      seo_description = p_page ->> 'seo_description',
      seo_keyword = p_page ->> 'seo_keyword',
      photo_id = nullif(p_page ->> 'photo_id', '')::uuid,
      founder_author_id = founder,
      content = p_page -> 'content',
      updated_at = now(),
      updated_by = auth.uid()
  where slug = p_slug;

  if not found then
    raise exception 'Not allowed to change this page' using errcode = '42501';
  end if;

  delete from public.site_page_photos where page_slug = p_slug;
  insert into public.site_page_photos (page_slug, position, photo_id)
  select p_slug, n, photo_id::uuid
  from jsonb_array_elements_text(p_photo_ids) with ordinality as p (photo_id, n)
  where n <= 8 and photo_id <> '';
end;
$$;

-- The page's photos now carry their place ("position").
create or replace view public.web_site_pages as
select
  s.slug,
  s.eyebrow,
  s.heading,
  s.intro,
  s.seo_title,
  s.seo_description,
  s.seo_keyword,
  s.content,
  s.updated_at,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place,
  fa.name as founder_name,
  ft.job_title as founder_role,
  case when fa.photo_consent then fp.id end as founder_photo_id,
  case when fa.photo_consent then fp.variant_widths end as founder_photo_variant_widths,
  case when fa.photo_consent then fp.placeholder end as founder_photo_placeholder,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', sp.id, 'width', sp.width, 'height', sp.height, 'variant_widths', sp.variant_widths,
          'placeholder', sp.placeholder, 'place', sp.place, 'position', pp.position
        )
        order by pp.position
      )
      from public.site_page_photos pp
      join public.photos sp on sp.id = pp.photo_id
      where pp.page_slug = s.slug
    ),
    '[]'::jsonb
  ) as story_photos
from public.site_pages s
left join public.photos p on p.id = s.photo_id
left join public.authors fa on fa.id = s.founder_author_id
left join public.author_translations ft on ft.author_id = fa.id and ft.locale = 'en'
left join public.photos fp on fp.id = fa.photo_id;

-- The PAN registration certificate (Inland Revenue Department), beside the agency licence on the About page.
alter table public.site_settings
  add column pan_certificate_photo_id uuid references public.photos (id) on delete set null;

create or replace function public.save_site_settings(p_settings jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  update public.site_settings
  set phone_country_code = p_settings ->> 'phone_country_code',
      phone_number = p_settings ->> 'phone_number',
      email = p_settings ->> 'email',
      office_address = p_settings ->> 'office_address',
      office_days = array(select jsonb_array_elements_text(p_settings -> 'office_days')::smallint),
      office_opens = (p_settings ->> 'office_opens')::time,
      office_closes = (p_settings ->> 'office_closes')::time,
      reply_languages = array(select jsonb_array_elements_text(p_settings -> 'reply_languages')),
      legal_name = p_settings ->> 'legal_name',
      legal_form = p_settings ->> 'legal_form',
      founded_year = (p_settings ->> 'founded_year')::smallint,
      tourism_registration = p_settings ->> 'tourism_registration',
      tourism_licence = p_settings ->> 'tourism_licence',
      company_registration = p_settings ->> 'company_registration',
      pan_number = p_settings ->> 'pan_number',
      taan_number = p_settings ->> 'taan_number',
      memberships = array(select jsonb_array_elements_text(p_settings -> 'memberships')),
      staff_insurer = p_settings ->> 'staff_insurer',
      payments_note = p_settings ->> 'payments_note',
      certificate_photo_id = nullif(p_settings ->> 'certificate_photo_id', '')::uuid,
      pan_certificate_photo_id = nullif(p_settings ->> 'pan_certificate_photo_id', '')::uuid,
      facebook_url = p_settings ->> 'facebook_url',
      instagram_url = p_settings ->> 'instagram_url',
      youtube_url = p_settings ->> 'youtube_url',
      tripadvisor_url = p_settings ->> 'tripadvisor_url',
      google_business_url = p_settings ->> 'google_business_url',
      linkedin_url = p_settings ->> 'linkedin_url',
      google_review_url = p_settings ->> 'google_review_url',
      share_photo_id = nullif(p_settings ->> 'share_photo_id', '')::uuid,
      updated_at = now(),
      updated_by = auth.uid()
  where id;

  if not found then
    raise exception 'Not allowed to change the site settings' using errcode = '42501';
  end if;
end;
$$;

create or replace view public.web_site_settings as
select
  s.phone_country_code,
  s.phone_number,
  s.email,
  s.office_address,
  s.office_days,
  to_char(s.office_opens, 'HH24:MI') as office_opens,
  to_char(s.office_closes, 'HH24:MI') as office_closes,
  s.reply_languages,
  s.legal_name,
  s.legal_form,
  s.founded_year,
  s.tourism_registration,
  s.tourism_licence,
  s.company_registration,
  s.pan_number,
  s.taan_number,
  s.memberships,
  s.staff_insurer,
  s.payments_note,
  s.facebook_url,
  s.instagram_url,
  s.youtube_url,
  s.tripadvisor_url,
  s.google_business_url,
  cp.id as certificate_id,
  cp.width as certificate_width,
  cp.height as certificate_height,
  cp.variant_widths as certificate_variant_widths,
  sp.id as share_id,
  sp.variant_widths as share_variant_widths,
  s.updated_at,
  -- Added later: a view only grows at the end.
  s.linkedin_url,
  s.google_review_url,
  pc.id as pan_certificate_id,
  pc.width as pan_certificate_width,
  pc.height as pan_certificate_height,
  pc.variant_widths as pan_certificate_variant_widths
from public.site_settings s
left join public.photos cp on cp.id = s.certificate_photo_id
left join public.photos sp on sp.id = s.share_photo_id
left join public.photos pc on pc.id = s.pan_certificate_photo_id;

-- The design's founding year (asked for on 2026-10-29); edited in Site settings from now on.
update public.site_settings set founded_year = 2025;
