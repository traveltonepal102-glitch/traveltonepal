-- Site settings › Company and licences: the "Company registration" and "TAAN membership number" fields are gone from
-- the admin and the website (2026-11-02; TAAN stays possible as one of the memberships). save_site_settings no longer
-- writes company_registration or taan_number. The columns stay for now, as the deployed website still reads them from
-- web_site_settings: drop them from the view and the table in a later migration, once both apps run the new code.

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
      pan_number = p_settings ->> 'pan_number',
      memberships = array(select jsonb_array_elements_text(p_settings -> 'memberships')),
      staff_insurer = p_settings ->> 'staff_insurer',
      certificate_photo_id = nullif(p_settings ->> 'certificate_photo_id', '')::uuid,
      pan_certificate_photo_id = nullif(p_settings ->> 'pan_certificate_photo_id', '')::uuid,
      facebook_url = p_settings ->> 'facebook_url',
      instagram_url = p_settings ->> 'instagram_url',
      youtube_url = p_settings ->> 'youtube_url',
      tripadvisor_url = p_settings ->> 'tripadvisor_url',
      google_business_url = p_settings ->> 'google_business_url',
      linkedin_url = p_settings ->> 'linkedin_url',
      google_review_url = p_settings ->> 'google_review_url',
      google_maps_url = p_settings ->> 'google_maps_url',
      google_maps_embed_url = p_settings ->> 'google_maps_embed_url',
      share_photo_id = nullif(p_settings ->> 'share_photo_id', '')::uuid,
      updated_at = now(),
      updated_by = auth.uid()
  where id;

  if not found then
    raise exception 'Not allowed to change the site settings' using errcode = '42501';
  end if;
end;
$$;
