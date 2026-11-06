-- Each website reads its own content and has its own settings (decided 2026-11-05), so a region website can be built:
--
--   1. web_site_id(): the website asking, from the "x-site-id" header its database client sends. No header (or a direct
--      connection) means Travel To Nepal, so apps/web works unchanged and can't show another website's rows. A new
--      website can't forget a filter either: the web_ views apply it. They hold only published, public content.
--   2. Site settings per website: one row each, made with the website. A region website's starts blank.
--   3. Contact clicks per website. The admin's Dashboard (not in a region website's menu) counts Travel To Nepal's.
--   4. web_site: the website asking, with its main trek's address once that trek is published and has a page.
--
-- Regions, trekking guides and authors stay shared: their views are not filtered.

create function public.web_site_id()
returns text
language sql
stable
set search_path = ''
as $$
  select coalesce(nullif(nullif(current_setting('request.headers', true), '')::json ->> 'x-site-id', ''), 'ttn');
$$;

-- A view's user needs to be allowed to call the functions in it.
revoke execute on function public.web_site_id() from public;
grant execute on function public.web_site_id() to anon, authenticated, service_role;

-- Site settings per website ------------------------------------------------------------------------------------------

alter table public.site_settings add column site_id text not null default 'ttn' references public.sites (id) on delete cascade;
alter table public.site_settings drop column id;
alter table public.site_settings add primary key (site_id);

create function public.create_site_settings()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.site_settings (site_id) values (new.id) on conflict (site_id) do nothing;
  return new;
end;
$$;

revoke execute on function public.create_site_settings() from public, anon, authenticated;

create trigger sites_create_settings after insert on public.sites for each row execute function public.create_site_settings();

-- The region websites added before this migration get theirs now.
insert into public.site_settings (site_id) select s.id from public.sites s where s.kind = 'region' on conflict (site_id) do nothing;

drop function public.save_site_settings(jsonb);

CREATE FUNCTION public.save_site_settings(p_settings jsonb, p_site_id text DEFAULT 'ttn'::text)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
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
  where site_id = p_site_id;

  if not found then
    raise exception 'Not allowed to change the site settings' using errcode = '42501';
  end if;
end;
$function$;

revoke execute on function public.save_site_settings(jsonb, text) from public, anon;
grant execute on function public.save_site_settings(jsonb, text) to authenticated;

-- Contact clicks per website -----------------------------------------------------------------------------------------

alter table public.contact_clicks add column site_id text not null default 'ttn' references public.sites (id) on delete cascade;
alter table public.contact_clicks drop constraint contact_clicks_pkey;
alter table public.contact_clicks add primary key (site_id, day, channel, page_path);

CREATE OR REPLACE FUNCTION public.record_contact_click(p_channel text, p_page_path text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  page text := coalesce(p_page_path, '');
  site text := public.web_site_id();
begin
  if p_channel is null or p_channel not in ('whatsapp', 'email') then
    return false;
  end if;
  if page <> '' and (page !~ '^/' or char_length(page) > 200) then
    return false;
  end if;
  if not exists (select 1 from public.sites s where s.id = site) then
    return false;
  end if;

  insert into public.contact_clicks (site_id, day, channel, page_path, clicks)
  values (site, (now() at time zone 'Asia/Kathmandu')::date, p_channel, page, 1)
  on conflict (site_id, day, channel, page_path) do update set clicks = public.contact_clicks.clicks + 1;
  return true;
end;
$function$;

CREATE OR REPLACE FUNCTION public.contact_click_totals(p_days integer DEFAULT 30)
 RETURNS TABLE(channel text, page_path text, clicks integer)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  select c.channel, c.page_path, sum(c.clicks)::integer
  from public.contact_clicks c
  where c.site_id = 'ttn' and c.day > (now() at time zone 'Asia/Kathmandu')::date - greatest(p_days, 1)
  group by c.channel, c.page_path
  order by 3 desc, 2;
$function$;

-- The website's views: the website asking, instead of always Travel To Nepal ------------------------------------------

create or replace view public.web_treks as
 SELECT tr.id,
    tr.slug,
    t.locale,
    t.name,
    t.summary,
    t.card_badge,
    t.season_label,
    tr.days,
    tr.difficulty,
    tr.max_altitude_m,
    tr.seasons,
    tr.tags,
    tr.is_popular,
    tr.has_fixed_dates,
    tr.price_from_usd,
    r.slug AS region_slug,
    rt.name AS region_name,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    tr.updated_at,
    (EXISTS ( SELECT 1
           FROM trek_days d
          WHERE d.trek_id = tr.id)) AS has_page,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('slug', o.slug, 'name', ot.name) ORDER BY x."position") AS jsonb_agg
           FROM ( SELECT tr.region_id,
                    0 AS "position"
                UNION ALL
                 SELECT rr.region_id,
                    rr."position"
                   FROM trek_regions rr
                  WHERE rr.trek_id = tr.id) x
             JOIN regions o ON o.id = x.region_id
             JOIN region_translations ot ON ot.region_id = o.id AND ot.locale = t.locale), '[]'::jsonb) AS route_regions,
    p.file_name AS cover_file_name,
    COALESCE(tr.published_at, tr.created_at) AS published_at
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
     JOIN regions r ON r.id = tr.region_id
     JOIN region_translations rt ON rt.region_id = r.id AND rt.locale = t.locale
     LEFT JOIN photos p ON p.id = tr.cover_photo_id
  WHERE tr.status = 'published'::trek_status AND tr.site_id = web_site_id();

create or replace view public.web_trek_pages as
 SELECT tr.id,
    tr.slug,
    t.locale,
    t.headline,
    t.short_name,
    t.seo_title,
    t.seo_description,
    t.category,
    t.protected_area,
    t.current_season,
    t.days_note,
    tr.grade,
    t.high_point,
    t.optional_high_point,
    tr.optional_high_point_m,
    t.introduction,
    t.photo_badges,
    t.highlights_heading,
    t.highlights,
    t.suitability_intro,
    t.suitability_points,
    t.itinerary_intro,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('place', dt.place, 'high_place', dt.high_place, 'title', dt.title, 'subtitle', dt.subtitle, 'duration', dt.duration, 'altitude_m', d.altitude_m, 'sleep_altitude_m', d.sleep_altitude_m, 'is_high_point', d.is_high_point, 'description', dt.description, 'region_slug', dr.slug, 'photo',
                CASE
                    WHEN ph.id IS NULL THEN NULL::jsonb
                    ELSE jsonb_build_object('cover_id', ph.id, 'cover_width', ph.width, 'cover_height', ph.height, 'cover_variant_widths', ph.variant_widths, 'cover_file_name', ph.file_name, 'cover_placeholder', ph.placeholder, 'cover_place', ph.place)
                END) ORDER BY d."position") AS jsonb_agg
           FROM trek_days d
             JOIN trek_day_translations dt ON dt.day_id = d.id AND dt.locale = t.locale
             LEFT JOIN photos ph ON ph.id = d.photo_id
             LEFT JOIN regions dr ON dr.id = d.region_id
          WHERE d.trek_id = tr.id), '[]'::jsonb) AS days,
    t.guides_intro,
    t.included,
    t.excluded,
    tr.meal_budget_min_usd,
    tr.meal_budget_max_usd,
    t.meal_trail_tips,
    t.meal_teahouse_notes,
    t.start_finish,
    tr.distance_km,
    t.daily_walking,
    t.guide_ratio,
    t.accommodation,
    t.transport,
    t.trek_start,
    tr.map_place,
    tr.my_maps_id,
    t.packing_intro,
    t.packing_groups,
    t.know_heading,
    COALESCE(( SELECT jsonb_agg(topic.item || jsonb_build_object('photo',
                CASE
                    WHEN ph.id IS NULL THEN NULL::jsonb
                    ELSE jsonb_build_object('cover_id', ph.id, 'cover_width', ph.width, 'cover_height', ph.height, 'cover_variant_widths', ph.variant_widths, 'cover_file_name', ph.file_name, 'cover_placeholder', ph.placeholder, 'cover_place', ph.place)
                END) ORDER BY topic."position") AS jsonb_agg
           FROM jsonb_array_elements(
                CASE
                    WHEN jsonb_typeof(t.know_topics) = 'array'::text THEN t.know_topics
                    ELSE '[]'::jsonb
                END) WITH ORDINALITY topic(item, "position")
             LEFT JOIN photos ph ON ph.id =
                CASE
                    WHEN (topic.item ->> 'photoId'::text) ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'::text THEN (topic.item ->> 'photoId'::text)::uuid
                    ELSE NULL::uuid
                END), '[]'::jsonb) AS know_topics,
    t.faqs,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('label', pt.label, 'short_label', pt.short_label, 'price_usd', gp.price_usd, 'team', pt.team, 'is_default', gp.is_default) ORDER BY gp."position") AS jsonb_agg
           FROM trek_group_prices gp
             JOIN trek_group_price_translations pt ON pt.price_id = gp.id AND pt.locale = t.locale
          WHERE gp.trek_id = tr.id), '[]'::jsonb) AS group_prices,
    tr.has_fixed_dates,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('start_date', dep.start_date, 'status', dep.status, 'note', COALESCE(dn.note, ''::text)) ORDER BY dep.start_date) AS jsonb_agg
           FROM trek_departures dep
             LEFT JOIN trek_departure_translations dn ON dn.departure_id = dep.id AND dn.locale = t.locale
          WHERE dep.trek_id = tr.id AND dep.start_date >= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date), '[]'::jsonb) AS departures,
    ARRAY( SELECT w.slug
           FROM trek_similar s
             JOIN treks w ON w.id = s.similar_trek_id AND w.status = 'published'::trek_status
          WHERE s.trek_id = tr.id
          ORDER BY s."position") AS similar_slugs,
    tr.hidden_shared_sections,
    ( SELECT array_agg(m.rating ORDER BY m.month) AS array_agg
           FROM ( SELECT month.month,
                    max(r.month_ratings[month.month]) AS rating
                   FROM generate_series(1, 12) month(month)
                     CROSS JOIN ( SELECT tr.region_id
                        UNION ALL
                         SELECT rr.region_id
                           FROM trek_regions rr
                          WHERE rr.trek_id = tr.id) route
                     JOIN regions r ON r.id = route.region_id
                  GROUP BY month.month) m) AS region_month_ratings,
    tr.section_order,
    sh.id AS share_id,
    sh.variant_widths AS share_variant_widths,
    sh.place AS share_place,
    tr.pdf_map_path,
    t.intro_heading,
    t.overview_heading,
    t.regions_heading,
    t.suitability_heading,
    t.itinerary_heading,
    t.inclusions_heading,
    t.guides_heading,
    t.elevation_heading,
    t.route_map_heading,
    t.pricing_heading,
    t.pricing_intro,
    t.packing_heading,
    t.know_intro,
    t.faq_heading,
    t.similar_heading,
    t.similar_intro,
    sh.file_name AS share_file_name
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
     LEFT JOIN photos sh ON sh.id = t.share_photo_id
  WHERE tr.status = 'published'::trek_status AND tr.site_id = web_site_id() AND (EXISTS ( SELECT 1
           FROM trek_days d
          WHERE d.trek_id = tr.id));

create or replace view public.web_trek_photos as
 SELECT tr.slug AS trek_slug,
    tp."position",
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name
   FROM trek_photos tp
     JOIN treks tr ON tr.id = tp.trek_id AND tr.status = 'published'::trek_status AND tr.site_id = web_site_id()
     JOIN photos p ON p.id = tp.photo_id;

create or replace view public.web_trek_guides as
 SELECT tr.slug AS trek_slug,
    tg."position",
    gt.locale,
    g.id,
    g.name,
    gt.role,
    gt.quote,
    g.home_village,
    g.home_district,
    g.years_guiding,
    g.languages,
    g.badge,
    g.licence_number <> ''::text AND (g.licence_valid_until IS NULL OR g.licence_valid_until >= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date) AS is_licensed,
    ('wfr'::text = ANY (g.certificates)) AND (g.wfr_valid_until IS NULL OR g.wfr_valid_until >= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date) AS has_wfr,
    ('first_aid'::text = ANY (g.certificates)) AND (g.first_aid_valid_until IS NULL OR g.first_aid_valid_until >= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date) AS has_first_aid,
    ARRAY( SELECT c.c
           FROM unnest(g.certificates) c(c)
          WHERE c.c = ANY (ARRAY['nathm'::text, 'nma'::text, 'language'::text])) AS other_certificates,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name
   FROM trek_guides tg
     JOIN treks tr ON tr.id = tg.trek_id AND tr.status = 'published'::trek_status AND tr.site_id = web_site_id()
     JOIN trekking_guides g ON g.id = tg.guide_id
     JOIN trekking_guide_translations gt ON gt.guide_id = g.id
     LEFT JOIN photos p ON p.id = g.photo_id
  WHERE g.can_lead_treks AND g.photo_consent;

create or replace view public.web_reviews as
 SELECT r.id,
    r.source,
    r.url,
    r.reviewer_name,
    r.reviewer_country,
    r.rating,
    r.title,
    r.quote,
    r.reviewed_on,
    tr.slug AS trek_slug,
    t.name AS trek_name,
    p.id AS photo_id,
    p.variant_widths AS photo_variant_widths,
    p.placeholder AS photo_placeholder,
    p.file_name AS photo_file_name
   FROM reviews r
     LEFT JOIN treks tr ON tr.id = r.trek_id AND tr.status = 'published'::trek_status AND tr.site_id = web_site_id()
     LEFT JOIN trek_translations t ON t.trek_id = tr.id AND t.locale = 'en'::text
     LEFT JOIN photos p ON p.id = r.photo_id
  WHERE r.is_shown AND r.site_id = web_site_id();

create or replace view public.published_trek_slugs as
 SELECT tr.id,
    tr.slug,
    t.locale
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
     JOIN region_translations rt ON rt.region_id = tr.region_id AND rt.locale = t.locale
  WHERE tr.status = 'published'::trek_status AND tr.site_id = web_site_id();

create or replace view public.web_travel_guides as
 SELECT a.id,
    a.slug,
    t.locale,
    t.title,
    t.card_text,
    a.topic,
    r.slug AS site_region_slug,
    a.also_on_main_site,
    a.is_featured,
    a.start_here_position,
    a.published_on,
    a.updated_on,
    t.cover_alt,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    COALESCE(NULLIF(au.name, ''::text), ag.name, ''::text) AS author_name,
    ARRAY( SELECT ar_r.slug
           FROM article_regions ar
             JOIN regions ar_r ON ar_r.id = ar.region_id
          WHERE ar.article_id = a.id
          ORDER BY ar_r.slug) AS region_slugs,
    GREATEST(1::numeric, ceil((( SELECT count(*) AS count
           FROM ( SELECT regexp_split_to_table(text_value.value #>> '{}'::text[], '\s+'::text) AS word
                   FROM article_sections s
                     JOIN article_section_translations st ON st.section_id = s.id AND st.locale = t.locale
                     CROSS JOIN LATERAL jsonb_path_query(st.content, 'strict $.**'::jsonpath) text_value(value)
                  WHERE s.article_id = a.id AND jsonb_typeof(text_value.value) = 'string'::text AND ((text_value.value #>> '{}'::text[]) <> ALL (ARRAY['doc'::text, 'paragraph'::text, 'text'::text, 'heading'::text, 'bulletList'::text, 'orderedList'::text, 'listItem'::text, 'bold'::text, 'italic'::text, 'link'::text, 'hardBreak'::text])) AND (text_value.value #>> '{}'::text[]) !~ '^(/|https?:|mailto:)'::text
                UNION ALL
                 SELECT regexp_split_to_table(t.intro, '\s+'::text) AS regexp_split_to_table) words
          WHERE words.word <> ''::text))::numeric / 200.0))::integer AS read_minutes,
    p.file_name AS cover_file_name
   FROM articles a
     JOIN article_translations t ON t.article_id = a.id
     LEFT JOIN regions r ON r.id = a.site_region_id
     LEFT JOIN photos p ON p.id = a.cover_photo_id
     LEFT JOIN authors au ON au.id = a.author_id
     LEFT JOIN trekking_guides ag ON ag.id = au.guide_id
  WHERE a.status = 'published'::article_status AND a.site_id = web_site_id() AND a.published_on <= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date;

create or replace view public.web_site_pages as
 SELECT s.slug,
    s.eyebrow,
    s.heading,
    s.intro,
    s.seo_title,
    s.seo_description,
    s.seo_keyword,
    s.content,
    s.updated_at,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    fa.name AS founder_name,
    ft.job_title AS founder_role,
        CASE
            WHEN fa.photo_consent THEN fp.id
            ELSE NULL::uuid
        END AS founder_photo_id,
        CASE
            WHEN fa.photo_consent THEN fp.variant_widths
            ELSE NULL::integer[]
        END AS founder_photo_variant_widths,
        CASE
            WHEN fa.photo_consent THEN fp.placeholder
            ELSE NULL::text
        END AS founder_photo_placeholder,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', sp.id, 'width', sp.width, 'height', sp.height, 'variant_widths', sp.variant_widths, 'file_name', sp.file_name, 'placeholder', sp.placeholder, 'place', sp.place, 'position', pp."position") ORDER BY pp."position") AS jsonb_agg
           FROM site_page_photos pp
             JOIN photos sp ON sp.id = pp.photo_id
          WHERE pp.site_id = s.site_id AND pp.page_slug = s.slug), '[]'::jsonb) AS story_photos,
    sh.id AS share_id,
    sh.variant_widths AS share_variant_widths,
    sh.place AS share_place,
    p.file_name AS cover_file_name,
        CASE
            WHEN fa.photo_consent THEN fp.file_name
            ELSE NULL::text
        END AS founder_photo_file_name,
    sh.file_name AS share_file_name,
    s.created_at AS published_at
   FROM site_pages s
     LEFT JOIN photos p ON p.id = s.photo_id
     LEFT JOIN authors fa ON fa.id = s.founder_author_id
     LEFT JOIN author_translations ft ON ft.author_id = fa.id AND ft.locale = 'en'::text
     LEFT JOIN photos fp ON fp.id = fa.photo_id
     LEFT JOIN photos sh ON sh.id = s.share_photo_id
  WHERE s.site_id = web_site_id();

create or replace view public.web_page_seo_overrides as
 SELECT 'page'::text AS page_kind,
    s.slug AS page_slug,
    'en'::text AS locale,
    s.canonical_path,
    s.hide_from_google
   FROM site_pages s
  WHERE s.site_id = web_site_id() AND (s.canonical_path <> ''::text OR s.hide_from_google)
UNION ALL
 SELECT 'trek'::text AS page_kind,
    w.slug AS page_slug,
    w.locale,
    t.canonical_path,
    t.hide_from_google
   FROM trek_translations t
     JOIN web_trek_pages w ON w.id = t.trek_id AND w.locale = t.locale
  WHERE t.canonical_path <> ''::text OR t.hide_from_google
UNION ALL
 SELECT 'region'::text AS page_kind,
    w.slug AS page_slug,
    w.locale,
    t.canonical_path,
    t.hide_from_google
   FROM region_translations t
     JOIN web_region_pages w ON w.id = t.region_id AND w.locale = t.locale
  WHERE t.canonical_path <> ''::text OR t.hide_from_google
UNION ALL
 SELECT 'guide'::text AS page_kind,
    w.slug AS page_slug,
    w.locale,
    t.canonical_path,
    t.hide_from_google
   FROM article_translations t
     JOIN web_travel_guide_pages w ON w.id = t.article_id AND w.locale = t.locale
  WHERE t.canonical_path <> ''::text OR t.hide_from_google;

create or replace view public.web_page_schemas as
 SELECT 'page'::text AS page_kind,
    s.site_page_slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
  WHERE s.is_shown AND s.site_page_slug IS NOT NULL AND s.site_id = web_site_id()
UNION ALL
 SELECT 'trek'::text AS page_kind,
    t.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN treks t ON t.id = s.trek_id
  WHERE s.is_shown AND (EXISTS ( SELECT 1
           FROM web_trek_pages w
          WHERE w.id = t.id))
UNION ALL
 SELECT 'region'::text AS page_kind,
    r.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN regions r ON r.id = s.region_id
  WHERE s.is_shown AND (EXISTS ( SELECT 1
           FROM web_region_pages w
          WHERE w.id = r.id))
UNION ALL
 SELECT 'guide'::text AS page_kind,
    a.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN articles a ON a.id = s.article_id
  WHERE s.is_shown AND (EXISTS ( SELECT 1
           FROM web_travel_guide_pages w
          WHERE w.id = a.id));

create or replace view public.web_review_ratings as
 SELECT rr.source,
    rr.rating,
    rr.review_count,
        CASE rr.source
            WHEN 'google'::review_source THEN s.google_business_url
            WHEN 'tripadvisor'::review_source THEN s.tripadvisor_url
            ELSE NULL::text
        END AS profile_url
   FROM review_ratings rr
     JOIN site_settings s ON s.site_id = rr.site_id
  WHERE rr.site_id = web_site_id();

create or replace view public.web_site_settings as
 SELECT s.phone_country_code,
    s.phone_number,
    s.email,
    s.office_address,
    s.office_days,
    to_char(s.office_opens::interval, 'HH24:MI'::text) AS office_opens,
    to_char(s.office_closes::interval, 'HH24:MI'::text) AS office_closes,
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
    cp.id AS certificate_id,
    cp.width AS certificate_width,
    cp.height AS certificate_height,
    cp.variant_widths AS certificate_variant_widths,
    sp.id AS share_id,
    sp.variant_widths AS share_variant_widths,
    s.updated_at,
    s.linkedin_url,
    s.google_review_url,
    pc.id AS pan_certificate_id,
    pc.width AS pan_certificate_width,
    pc.height AS pan_certificate_height,
    pc.variant_widths AS pan_certificate_variant_widths,
    s.google_maps_url,
    s.google_maps_embed_url,
    cp.file_name AS certificate_file_name,
    sp.file_name AS share_file_name,
    pc.file_name AS pan_certificate_file_name
   FROM site_settings s
     LEFT JOIN photos cp ON cp.id = s.certificate_photo_id
     LEFT JOIN photos sp ON sp.id = s.share_photo_id
     LEFT JOIN photos pc ON pc.id = s.pan_certificate_photo_id
  WHERE s.site_id = web_site_id();

create or replace view public.web_redirects as
 SELECT DISTINCT 'trek'::text AS kind,
    s.old_slug AS from_slug,
    w.slug AS to_slug
   FROM slug_redirects s
     JOIN web_treks w ON w.id = s.target_id AND w.has_page
  WHERE s.kind = 'trek'::text AND s.site_id = web_site_id()
UNION
 SELECT DISTINCT 'region'::text AS kind,
    s.old_slug AS from_slug,
    w.slug AS to_slug
   FROM slug_redirects s
     JOIN web_regions w ON w.id = s.target_id AND w.has_page
  WHERE s.kind = 'region'::text AND s.site_id = web_site_id()
UNION
 SELECT DISTINCT 'guide'::text AS kind,
    s.old_slug AS from_slug,
    w.slug AS to_slug
   FROM slug_redirects s
     JOIN web_travel_guides w ON w.id = s.target_id
  WHERE s.kind = 'guide'::text AND s.site_id = web_site_id();
-- The website asking ---------------------------------------------------------------------------------------------------

create view public.web_site as
select
  s.id,
  s.kind,
  s.name,
  s.url,
  s.is_live,
  r.slug as region_slug,
  t.slug as home_trek_slug
from public.sites s
left join public.regions r on r.id = s.region_id
left join public.treks t on t.id = s.home_trek_id and t.status = 'published' and exists (select 1 from public.trek_days d where d.trek_id = t.id)
where s.id = public.web_site_id();

grant select on public.web_site to anon;
