-- Site settings (decided 2026-10-26): contact details, company details and licences, and social links, edited in the
-- admin's Site settings instead of code (this replaces the TRD rule "contact constants in code"). One row; every page
-- of every site reads it, so a fact is typed in one place only.

create table public.site_settings (
  -- Exactly one row.
  id boolean primary key default true check (id),

  -- Contact details
  phone_country_code text not null default '977' check (phone_country_code ~ '^[0-9]{1,4}$'),
  -- Local number, digits only; WhatsApp uses the same number.
  phone_number text not null default '' check (phone_number ~ '^[0-9]{0,15}$'),
  email text not null default '' check (char_length(email) <= 120),
  office_address text not null default '' check (char_length(office_address) <= 200),
  -- 0 = Sunday … 6 = Saturday, Nepal time.
  office_days smallint[] not null default '{0,1,2,3,4,5}' check (office_days <@ '{0,1,2,3,4,5,6}'::smallint[]),
  office_opens time not null default '09:00',
  office_closes time not null default '18:00',
  reply_languages text[] not null default '{}' check (cardinality(reply_languages) <= 10),

  -- Company and licences (empty until the owner's documents are typed in: the website then leaves the line out)
  legal_name text not null default '' check (char_length(legal_name) <= 120),
  legal_form text not null default '' check (char_length(legal_form) <= 80),
  founded_year smallint check (founded_year between 1950 and 2100),
  tourism_registration text not null default '' check (char_length(tourism_registration) <= 60),
  tourism_licence text not null default '' check (char_length(tourism_licence) <= 60),
  company_registration text not null default '' check (char_length(company_registration) <= 60),
  pan_number text not null default '' check (char_length(pan_number) <= 40),
  taan_number text not null default '' check (char_length(taan_number) <= 40),
  memberships text[] not null default '{}' check (cardinality(memberships) <= 10),
  staff_insurer text not null default '' check (char_length(staff_insurer) <= 120),
  payments_note text not null default '' check (char_length(payments_note) <= 160),
  certificate_photo_id uuid references public.photos (id) on delete set null,

  -- Social and sharing
  facebook_url text not null default '' check (facebook_url = '' or facebook_url ~ '^https://'),
  instagram_url text not null default '' check (instagram_url = '' or instagram_url ~ '^https://'),
  youtube_url text not null default '' check (youtube_url = '' or youtube_url ~ '^https://'),
  tripadvisor_url text not null default '' check (tripadvisor_url = '' or tripadvisor_url ~ '^https://'),
  google_business_url text not null default '' check (google_business_url = '' or google_business_url ~ '^https://'),
  share_photo_id uuid references public.photos (id) on delete set null,

  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

-- Today's details from packages/config/src/contact.ts. The registration and TAAN numbers there were placeholders
-- (123456 / 2345), so they start empty rather than showing a made-up number.
insert into public.site_settings (phone_country_code, phone_number, email, office_address)
values ('977', '9843197197', 'traveltonepal102@gmail.com', 'Kathmandu, Nepal');

alter table public.site_settings enable row level security;

create policy "Admins read site settings" on public.site_settings
  for select to authenticated using ((select public.is_admin()));

create policy "Super admins edit site settings" on public.site_settings
  for update to authenticated using ((select public.is_super_admin())) with check ((select public.is_super_admin()));

grant select, update on public.site_settings to authenticated;

-- Saves the Site settings form in one statement (as the admin, Row Level Security on: only a Super admin may).
create function public.save_site_settings(p_settings jsonb)
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
      share_photo_id = nullif(p_settings ->> 'share_photo_id', '')::uuid,
      updated_at = now(),
      updated_by = auth.uid()
  where id;

  if not found then
    raise exception 'Not allowed to change the site settings' using errcode = '42501';
  end if;
end;
$$;

revoke all on function public.save_site_settings(jsonb) from public, anon;
grant execute on function public.save_site_settings(jsonb) to authenticated;

-- What the website shows: everything here is public by nature (it is printed on the site), with the photos joined.
create view public.web_site_settings as
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
  s.updated_at
from public.site_settings s
left join public.photos cp on cp.id = s.certificate_photo_id
left join public.photos sp on sp.id = s.share_photo_id;

revoke all on public.web_site_settings from public, authenticated;
grant select on public.web_site_settings to anon;
