-- Photo file names (SEO): a photo's sizes are named after the uploaded file, <photo id>/<file_name>-<width>.webp
-- (e.g. .../tilicho-lake-annapurna-circuit-trek-1200.webp), so the address says what the photo shows. The photo id
-- folder keeps every address unique, so two photos may share a name; a name never changes once its files exist
-- (they are cached for a year). Photos uploaded before keep <photo id>/<width>.webp until
-- apps/admin/scripts/name-photo-files.mjs copies their files to named ones and sets file_name.

alter table public.photos
  add column file_name text
  constraint photos_file_name_format check (file_name ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(file_name) <= 60);

-- Deleting a photo also returns its file name, to find its files (lib/photoFileKeys.ts publicPhotoKeys).
drop function public.delete_unused_photo(uuid);

create function public.delete_unused_photo(p_photo_id uuid)
returns table (master_key text, variant_widths integer[], file_name text)
language plpgsql
set search_path = ''
as $$
#variable_conflict use_column
begin
  if not (select public.is_super_admin()) then
    raise exception 'Only a Super admin can delete photos.' using errcode = '42501';
  end if;

  perform 1 from public.photos p where p.id = p_photo_id for update;
  if not found then
    return;
  end if;

  if exists (select 1 from public.photo_uses(p_photo_id)) then
    raise exception 'This photo is still used.' using errcode = 'P0001', hint = 'photo_in_use';
  end if;

  return query delete from public.photos p where p.id = p_photo_id returning p.master_key, p.variant_widths, p.file_name;
end;
$$;

revoke execute on function public.delete_unused_photo(uuid) from public, anon;
grant execute on function public.delete_unused_photo(uuid) to authenticated;

-- The website's views send each photo's file name beside its sizes: <prefix>_file_name after the columns they had,
-- and "cover_file_name" (or "file_name") inside their jsonb photo lists. Rebuilt from the live definitions.
create or replace view public.web_regions as
 SELECT r.id,
    r.slug,
    t.locale,
    t.name,
    t.short_name,
    t.tagline,
    t.summary,
    r.max_altitude_m,
    r.website_domain,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    r.district,
    r.latitude,
    r.longitude,
    r.difficulty,
    r.is_flight,
    r.month_ratings,
    t.trek_length,
    t.getting_there,
    t.getting_there_details,
    t.permits,
    t.best_for,
    rich_text_has_words(t.introduction) AS has_page,
    p.file_name AS cover_file_name
   FROM regions r
     JOIN region_translations t ON t.region_id = r.id
     LEFT JOIN photos p ON p.id = r.cover_photo_id;

create or replace view public.web_region_photos as
 SELECT r.slug AS region_slug,
    rp."position",
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name
   FROM region_photos rp
     JOIN regions r ON r.id = rp.region_id
     JOIN photos p ON p.id = rp.photo_id;

create or replace view public.web_region_guides as
 SELECT r.slug AS region_slug,
    gt.locale,
    g.id,
    g.name,
    gt.role,
    gt.quote,
    g.years_guiding,
    g.languages,
    g.badge,
    g.licence_number <> ''::text AND (g.licence_valid_until IS NULL OR g.licence_valid_until >= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date) AS is_licensed,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name
   FROM trekking_guide_regions gr
     JOIN regions r ON r.id = gr.region_id
     JOIN trekking_guides g ON g.id = gr.guide_id
     JOIN trekking_guide_translations gt ON gt.guide_id = g.id
     LEFT JOIN photos p ON p.id = g.photo_id
  WHERE g.can_lead_treks AND g.photo_consent AND NOT (EXISTS ( SELECT 1
           FROM region_hidden_guides h
          WHERE h.region_id = gr.region_id AND h.guide_id = g.id));

create or replace view public.web_region_pages as
 SELECT r.id,
    r.slug,
    t.locale,
    t.seo_title,
    t.seo_description,
    t.hero_highlight,
    t.overview_heading,
    t.introduction,
    t.why_points,
    t.from_kathmandu,
    t.nearest_airport,
    t.permits_details,
    t.where_you_sleep,
    t.season_spring,
    t.season_monsoon,
    t.season_autumn,
    t.season_winter,
    t.faqs,
    ( SELECT w.slug
           FROM published_trek_slugs w
          WHERE w.id = r.featured_trek_id AND w.locale = t.locale) AS featured_trek_slug,
    t.featured_trek_label,
    t.featured_trek_pitch,
    t.custom_route_pitch,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('slug', w.slug, 'label', COALESCE(nt.label, ''::text), 'note', COALESCE(nt.note, ''::text)) ORDER BY n."position") AS jsonb_agg
           FROM region_nearby_treks n
             JOIN published_trek_slugs w ON w.id = n.trek_id AND w.locale = t.locale
             LEFT JOIN region_nearby_trek_translations nt ON nt.region_id = n.region_id AND nt.trek_id = n.trek_id AND nt.locale = t.locale
          WHERE n.region_id = r.id), '[]'::jsonb) AS nearby_treks,
    ARRAY( SELECT o.slug
           FROM region_compare c
             JOIN regions o ON o.id = c.other_region_id
          WHERE c.region_id = r.id
          ORDER BY c."position") AS compare_slugs,
    ARRAY( SELECT g.slug
           FROM article_regions ar
             JOIN web_travel_guides g ON g.id = ar.article_id AND g.locale = t.locale
          WHERE ar.region_id = r.id
          ORDER BY ar.pin_position, g.published_on DESC, g.slug) AS travel_guide_slugs,
    sh.id AS share_id,
    sh.variant_widths AS share_variant_widths,
    sh.place AS share_place,
    sh.file_name AS share_file_name
   FROM regions r
     JOIN region_translations t ON t.region_id = r.id
     LEFT JOIN photos sh ON sh.id = t.share_photo_id
  WHERE rich_text_has_words(t.introduction);

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
    p.file_name AS cover_file_name
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
     JOIN regions r ON r.id = tr.region_id
     JOIN region_translations rt ON rt.region_id = r.id AND rt.locale = t.locale
     LEFT JOIN photos p ON p.id = tr.cover_photo_id
  WHERE tr.status = 'published'::trek_status;

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
     JOIN treks tr ON tr.id = tp.trek_id AND tr.status = 'published'::trek_status
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
     JOIN treks tr ON tr.id = tg.trek_id AND tr.status = 'published'::trek_status
     JOIN trekking_guides g ON g.id = tg.guide_id
     JOIN trekking_guide_translations gt ON gt.guide_id = g.id
     LEFT JOIN photos p ON p.id = g.photo_id
  WHERE g.can_lead_treks AND g.photo_consent;

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
  WHERE tr.status = 'published'::trek_status AND (EXISTS ( SELECT 1
           FROM trek_days d
          WHERE d.trek_id = tr.id));

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
  WHERE a.status = 'published'::article_status AND a.published_on <= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date;

create or replace view public.web_travel_guide_pages as
 SELECT g.id,
    g.slug,
    g.locale,
    t.title,
    t.intro,
    t.highlight_tag,
    t.updated_line,
    t.facts,
    t.seo_title,
    t.seo_description,
    a.published_on,
    a.updated_on,
    a.topic,
    a.month_ratings,
    t.month_notes,
    t.cover_alt,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    ( SELECT w.slug
           FROM published_trek_slugs w
          WHERE w.id = a.main_trek_id AND w.locale = g.locale) AS main_trek_slug,
    ( SELECT w.slug
           FROM published_trek_slugs w
          WHERE w.id = a.photo_trek_id AND w.locale = g.locale) AS photo_trek_slug,
    ( SELECT jsonb_build_object('kind', au.kind, 'name', COALESCE(NULLIF(au.name, ''::text), ag.name, ''::text), 'job_title', COALESCE(aut.job_title, ''::text), 'bio', COALESCE(NULLIF(aut.bio, ''::text), agt.bio, ''::text), 'photo',
                CASE
                    WHEN ap.id IS NULL THEN NULL::jsonb
                    ELSE jsonb_build_object('cover_id', ap.id, 'cover_width', ap.width, 'cover_height', ap.height, 'cover_variant_widths', ap.variant_widths, 'cover_file_name', ap.file_name, 'cover_placeholder', ap.placeholder, 'cover_place', ap.place)
                END) AS jsonb_build_object
           FROM authors au
             LEFT JOIN author_translations aut ON aut.author_id = au.id AND aut.locale = g.locale
             LEFT JOIN trekking_guides ag ON ag.id = au.guide_id
             LEFT JOIN trekking_guide_translations agt ON agt.guide_id = ag.id AND agt.locale = g.locale
             LEFT JOIN photos ap ON ap.id =
                CASE
                    WHEN au.kind = 'guide'::author_kind THEN ag.photo_id
                    WHEN au.photo_consent THEN au.photo_id
                    ELSE NULL::uuid
                END
          WHERE au.id = a.author_id) AS author,
    ( SELECT jsonb_build_object('name', cg.name, 'role', COALESCE(cgt.role, ''::text), 'photo',
                CASE
                    WHEN cp.id IS NULL THEN NULL::jsonb
                    ELSE jsonb_build_object('cover_id', cp.id, 'cover_width', cp.width, 'cover_height', cp.height, 'cover_variant_widths', cp.variant_widths, 'cover_file_name', cp.file_name, 'cover_placeholder', cp.placeholder, 'cover_place', cp.place)
                END) AS jsonb_build_object
           FROM trekking_guides cg
             LEFT JOIN trekking_guide_translations cgt ON cgt.guide_id = cg.id AND cgt.locale = g.locale
             LEFT JOIN photos cp ON cp.id = cg.photo_id
          WHERE cg.id = a.checker_guide_id AND cg.can_fact_check AND cg.photo_consent) AS checker,
    ARRAY( SELECT rg.slug
           FROM article_related rel
             JOIN web_travel_guides rg ON rg.id = rel.related_article_id AND rg.locale = g.locale
          WHERE rel.article_id = a.id
          ORDER BY rel."position") AS related_slugs,
    g.region_slugs,
    g.read_minutes,
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('type', s.type, 'settings', s.settings, 'content', COALESCE(st.content, '{}'::jsonb), 'trek_slug', ( SELECT w.slug
                   FROM published_trek_slugs w
                  WHERE w.id = s.trek_id AND w.locale = g.locale), 'trek_slugs', COALESCE(( SELECT jsonb_agg(w.slug ORDER BY picked."position") AS jsonb_agg
                   FROM jsonb_array_elements_text(
                        CASE
                            WHEN jsonb_typeof(s.settings -> 'trekIds'::text) = 'array'::text THEN s.settings -> 'trekIds'::text
                            ELSE '[]'::jsonb
                        END) WITH ORDINALITY picked(trek_id, "position")
                     JOIN published_trek_slugs w ON w.id::text = picked.trek_id AND w.locale = g.locale), '[]'::jsonb), 'guides', COALESCE(( SELECT jsonb_agg(jsonb_build_object('name', sg.name, 'role', COALESCE(sgt.role, ''::text), 'quote', COALESCE(sgt.quote, ''::text), 'photo',
                        CASE
                            WHEN sp.id IS NULL THEN NULL::jsonb
                            ELSE jsonb_build_object('cover_id', sp.id, 'cover_width', sp.width, 'cover_height', sp.height, 'cover_variant_widths', sp.variant_widths, 'cover_file_name', sp.file_name, 'cover_placeholder', sp.placeholder, 'cover_place', sp.place)
                        END) ORDER BY sgl."position") AS jsonb_agg
                   FROM article_section_guides sgl
                     JOIN trekking_guides sg ON sg.id = sgl.guide_id AND sg.photo_consent
                     LEFT JOIN trekking_guide_translations sgt ON sgt.guide_id = sg.id AND sgt.locale = g.locale
                     LEFT JOIN photos sp ON sp.id = sg.photo_id
                  WHERE sgl.section_id = s.id), '[]'::jsonb), 'photos', COALESCE(( SELECT jsonb_agg(jsonb_build_object('cover_id', ph.id, 'cover_width', ph.width, 'cover_height', ph.height, 'cover_variant_widths', ph.variant_widths, 'cover_file_name', ph.file_name, 'cover_placeholder', ph.placeholder, 'cover_place', ph.place) ORDER BY spl."position") AS jsonb_agg
                   FROM article_section_photos spl
                     JOIN photos ph ON ph.id = spl.photo_id
                  WHERE spl.section_id = s.id), '[]'::jsonb), 'days', COALESCE(
                CASE
                    WHEN s.type::text = 'altitude'::text THEN ( SELECT jsonb_agg(jsonb_build_object('place', dt.place, 'high_place', dt.high_place, 'title', dt.title, 'subtitle', dt.subtitle, 'duration', dt.duration, 'altitude_m', d.altitude_m, 'sleep_altitude_m', d.sleep_altitude_m, 'is_high_point', d.is_high_point, 'day_number', d."position" + 1, 'description', dt.description) ORDER BY d."position") AS jsonb_agg
                       FROM trek_days d
                         JOIN trek_day_translations dt ON dt.day_id = d.id AND dt.locale = g.locale
                      WHERE d.trek_id = s.trek_id AND (EXISTS ( SELECT 1
                               FROM published_trek_slugs w
                              WHERE w.id = d.trek_id AND w.locale = g.locale)))
                    ELSE ( SELECT jsonb_agg(jsonb_build_object('place', dt.place, 'high_place', dt.high_place, 'title', dt.title, 'subtitle', dt.subtitle, 'duration', dt.duration, 'altitude_m', d.altitude_m, 'sleep_altitude_m', d.sleep_altitude_m, 'is_high_point', d.is_high_point, 'day_number', d."position" + 1, 'description', dt.description) ORDER BY picked."position") AS jsonb_agg
                       FROM jsonb_array_elements_text(
                            CASE
                                WHEN jsonb_typeof(s.settings -> 'dayIds'::text) = 'array'::text THEN s.settings -> 'dayIds'::text
                                ELSE '[]'::jsonb
                            END) WITH ORDINALITY picked(day_id, "position")
                         JOIN trek_days d ON d.id::text = picked.day_id
                         JOIN trek_day_translations dt ON dt.day_id = d.id AND dt.locale = g.locale
                      WHERE (EXISTS ( SELECT 1
                               FROM published_trek_slugs w
                              WHERE w.id = d.trek_id AND w.locale = g.locale)))
                END, '[]'::jsonb)) ORDER BY s."position") AS jsonb_agg
           FROM article_sections s
             LEFT JOIN article_section_translations st ON st.section_id = s.id AND st.locale = g.locale
          WHERE s.article_id = a.id), '[]'::jsonb) AS sections,
    sh.id AS share_id,
    sh.variant_widths AS share_variant_widths,
    sh.place AS share_place,
    t.help_heading,
    t.help_text,
    t.help_message,
    p.file_name AS cover_file_name,
    sh.file_name AS share_file_name
   FROM web_travel_guides g
     JOIN articles a ON a.id = g.id
     JOIN article_translations t ON t.article_id = a.id AND t.locale = g.locale
     LEFT JOIN photos p ON p.id = a.cover_photo_id
     LEFT JOIN photos sh ON sh.id = t.share_photo_id;

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
     LEFT JOIN photos pc ON pc.id = s.pan_certificate_photo_id;

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
          WHERE pp.page_slug = s.slug), '[]'::jsonb) AS story_photos,
    sh.id AS share_id,
    sh.variant_widths AS share_variant_widths,
    sh.place AS share_place,
    p.file_name AS cover_file_name,
    CASE WHEN fa.photo_consent THEN fp.file_name ELSE NULL::text END AS founder_photo_file_name,
    sh.file_name AS share_file_name
   FROM site_pages s
     LEFT JOIN photos p ON p.id = s.photo_id
     LEFT JOIN authors fa ON fa.id = s.founder_author_id
     LEFT JOIN author_translations ft ON ft.author_id = fa.id AND ft.locale = 'en'::text
     LEFT JOIN photos fp ON fp.id = fa.photo_id
     LEFT JOIN photos sh ON sh.id = s.share_photo_id;

create or replace view public.web_about_team as
 SELECT 'office'::text AS team_group,
    a.id,
    a.name,
    t.job_title AS role,
    'Kathmandu office'::text AS place,
    '{}'::text[] AS languages,
    0 AS sort_group,
    0 AS years_guiding,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name
   FROM authors a
     JOIN author_translations t ON t.author_id = a.id AND t.locale = 'en'::text
     LEFT JOIN photos p ON p.id = a.photo_id
  WHERE a.kind = 'office'::author_kind AND a.show_on_about AND a.photo_consent
UNION ALL
 SELECT 'guides'::text AS team_group,
    g.id,
    g.name,
    gt.role,
    concat_ws(', '::text, NULLIF(g.home_village, ''::text), NULLIF(g.home_district, ''::text)) AS place,
    g.languages,
    1 AS sort_group,
    COALESCE(g.years_guiding::integer, 0) AS years_guiding,
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name
   FROM trekking_guides g
     JOIN trekking_guide_translations gt ON gt.guide_id = g.id AND gt.locale = 'en'::text
     LEFT JOIN photos p ON p.id = g.photo_id
  WHERE g.show_on_about AND g.photo_consent;

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
     LEFT JOIN treks tr ON tr.id = r.trek_id AND tr.status = 'published'::trek_status
     LEFT JOIN trek_translations t ON t.trek_id = tr.id AND t.locale = 'en'::text
     LEFT JOIN photos p ON p.id = r.photo_id
  WHERE r.is_shown;

create or replace view public.web_adventures as
 SELECT a.id,
    a.title,
    a.tag,
    a.summary,
    a.photo_alt,
    a."position",
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name
   FROM adventures a
     JOIN photos p ON p.id = a.photo_id
  WHERE a.is_shown;

