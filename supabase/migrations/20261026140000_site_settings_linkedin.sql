-- Site settings › Social and sharing: the company's LinkedIn page, beside the other profiles (footer icons and
-- Google's "sameAs").

alter table public.site_settings
  add column linkedin_url text not null default '' check (linkedin_url = '' or linkedin_url ~ '^https://');

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
      facebook_url = p_settings ->> 'facebook_url',
      instagram_url = p_settings ->> 'instagram_url',
      youtube_url = p_settings ->> 'youtube_url',
      tripadvisor_url = p_settings ->> 'tripadvisor_url',
      google_business_url = p_settings ->> 'google_business_url',
      linkedin_url = p_settings ->> 'linkedin_url',
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
  s.linkedin_url
from public.site_settings s
left join public.photos cp on cp.id = s.certificate_photo_id
left join public.photos sp on sp.id = s.share_photo_id;
