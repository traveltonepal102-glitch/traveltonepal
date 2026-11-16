-- Content in its website's language, prices in its website's currency (decided 2026-11-15, see
-- 20261115100000_site_language_and_currency.sql).
--
-- 1. Every text row of a website's treks, travel guides, authors and trekking guides is in that website's language
--    (a trigger refuses anything else), and the views that always read English now read the website's language.
-- 2. Regions belong to Travel To Nepal and are written in English: a German trek shows the region's German name when
--    one exists, else the English one (before, a German trek without a German region text vanished from the lists).
-- 3. Amounts are in the website's currency. The table columns keep their old names (price_usd, price_from_usd,
--    meal_budget_*_usd) for now, because the live websites read them; the views add the new names price_from,
--    price, meal_budget_min/max and currency at the end. Once every website and the admin run the new code, a
--    cleanup migration renames the columns and drops the old view names.

comment on column public.trek_group_prices.price_usd is 'Price per person in the website''s currency (sites.currency); the name is from when every price was in US dollars.';
comment on column public.treks.price_from_usd is 'The "From" price in the website''s currency (sites.currency).';
comment on column public.treks.meal_budget_min_usd is 'Meal budget a day in the website''s currency (sites.currency).';
comment on column public.treks.meal_budget_max_usd is 'Meal budget a day in the website''s currency (sites.currency).';

-- ---------------------------------------------------------------------------------------------------------------
-- Text in the website's language

create function public.check_content_locale()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_site text;
begin
  -- One branch per table: PL/pgSQL resolves new.<column> only in the branch that runs.
  if tg_table_name = 'trek_translations' then
    select t.site_id into owner_site from public.treks t where t.id = new.trek_id;
  elsif tg_table_name = 'article_translations' then
    select a.site_id into owner_site from public.articles a where a.id = new.article_id;
  elsif tg_table_name = 'author_translations' then
    select a.site_id into owner_site from public.authors a where a.id = new.author_id;
  elsif tg_table_name = 'trekking_guide_translations' then
    select g.site_id into owner_site from public.trekking_guides g where g.id = new.guide_id;
  end if;
  if owner_site is not null and new.locale <> public.site_language(owner_site) then
    raise exception 'Text for % must be in its website''s language (%)', owner_site, public.site_language(owner_site)
      using errcode = '23514';
  end if;
  return new;
end;
$$;

revoke execute on function public.check_content_locale() from public;

create trigger trek_translations_site_language before insert or update of locale on public.trek_translations
  for each row execute function public.check_content_locale();
create trigger article_translations_site_language before insert or update of locale on public.article_translations
  for each row execute function public.check_content_locale();
create trigger author_translations_site_language before insert or update of locale on public.author_translations
  for each row execute function public.check_content_locale();
create trigger trekking_guide_translations_site_language before insert or update of locale on public.trekking_guide_translations
  for each row execute function public.check_content_locale();

-- ---------------------------------------------------------------------------------------------------------------
-- Views (create or replace: same columns in the same order, new ones only at the end, grants kept)

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
             CROSS JOIN LATERAL ( SELECT rtx.name
                   FROM region_translations rtx
                  WHERE rtx.region_id = o.id AND (rtx.locale = t.locale OR rtx.locale = 'en'::text)
                  ORDER BY (rtx.locale = t.locale) DESC
                 LIMIT 1) ot), '[]'::jsonb) AS route_regions,
    p.file_name AS cover_file_name,
    COALESCE(tr.published_at, tr.created_at) AS published_at,
    p.alt_text AS cover_alt_text,
    p.description AS cover_caption,
    tr.price_from_usd AS price_from,
    site_currency(tr.site_id) AS currency
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
     JOIN regions r ON r.id = tr.region_id
     CROSS JOIN LATERAL ( SELECT rtx.name
           FROM region_translations rtx
          WHERE rtx.region_id = r.id AND (rtx.locale = t.locale OR rtx.locale = 'en'::text)
          ORDER BY (rtx.locale = t.locale) DESC
         LIMIT 1) rt
     LEFT JOIN photos p ON p.id = tr.cover_photo_id
  WHERE tr.status = 'published'::trek_status AND tr.site_id = web_site_id();

create or replace view public.published_trek_slugs as
 SELECT tr.id,
    tr.slug,
    t.locale
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
  WHERE (EXISTS ( SELECT 1
           FROM region_translations rt
          WHERE rt.region_id = tr.region_id AND (rt.locale = t.locale OR rt.locale = 'en'::text))) AND tr.status = 'published'::trek_status AND tr.site_id = web_site_id();

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
                    ELSE jsonb_build_object('cover_id', ph.id, 'cover_width', ph.width, 'cover_height', ph.height, 'cover_variant_widths', ph.variant_widths, 'cover_file_name', ph.file_name, 'cover_placeholder', ph.placeholder, 'cover_place', ph.place, 'cover_alt_text', ph.alt_text, 'cover_caption', ph.description)
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
                    ELSE jsonb_build_object('cover_id', ph.id, 'cover_width', ph.width, 'cover_height', ph.height, 'cover_variant_widths', ph.variant_widths, 'cover_file_name', ph.file_name, 'cover_placeholder', ph.placeholder, 'cover_place', ph.place, 'cover_alt_text', ph.alt_text, 'cover_caption', ph.description)
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
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('label', pt.label, 'short_label', pt.short_label, 'price_usd', gp.price_usd, 'price', gp.price_usd, 'team', pt.team, 'is_default', gp.is_default) ORDER BY gp."position") AS jsonb_agg
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
    sh.file_name AS share_file_name,
    sh.alt_text AS share_alt_text,
    sh.description AS share_caption,
    t.packing_line,
    t.route_map_line,
    t.months_line,
    ( SELECT a.slug
           FROM articles a
          WHERE a.id = tr.featured_article_id AND a.status = 'published'::article_status AND a.published_on <= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date) AS featured_guide_slug,
    tr.gpx_track_path,
    COALESCE(( SELECT array_agg(a.slug ORDER BY ta."position") AS array_agg
           FROM trek_articles ta
             JOIN articles a ON a.id = ta.article_id
          WHERE ta.trek_id = tr.id AND a.status = 'published'::article_status AND a.published_on <= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date), '{}'::text[]) AS guide_slugs,
    tr.meal_budget_min_usd AS meal_budget_min,
    tr.meal_budget_max_usd AS meal_budget_max,
    site_currency(tr.site_id) AS currency
   FROM treks tr
     JOIN trek_translations t ON t.trek_id = tr.id
     LEFT JOIN photos sh ON sh.id = t.share_photo_id
  WHERE tr.status = 'published'::trek_status AND tr.site_id = web_site_id() AND (EXISTS ( SELECT 1
           FROM trek_days d
          WHERE d.trek_id = tr.id));

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
     LEFT JOIN trek_translations t ON t.trek_id = tr.id AND t.locale = site_language(web_site_id())
     LEFT JOIN photos p ON p.id = r.photo_id
  WHERE r.is_shown AND r.site_id = web_site_id();

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
    COALESCE(( SELECT jsonb_agg(jsonb_build_object('id', sp.id, 'width', sp.width, 'height', sp.height, 'variant_widths', sp.variant_widths, 'file_name', sp.file_name, 'placeholder', sp.placeholder, 'place', sp.place, 'alt_text', sp.alt_text, 'caption', sp.description, 'position', pp."position") ORDER BY pp."position") AS jsonb_agg
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
    s.created_at AS published_at,
    p.alt_text AS cover_alt_text,
    p.description AS cover_caption,
    sh.alt_text AS share_alt_text,
    sh.description AS share_caption
   FROM site_pages s
     LEFT JOIN photos p ON p.id = s.photo_id
     LEFT JOIN authors fa ON fa.id = s.founder_author_id
     LEFT JOIN author_translations ft ON ft.author_id = fa.id AND ft.locale = site_language(web_site_id())
     LEFT JOIN photos fp ON fp.id = fa.photo_id
     LEFT JOIN photos sh ON sh.id = s.share_photo_id
  WHERE s.site_id = web_site_id();

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
    p.file_name AS cover_file_name,
    p.alt_text AS cover_alt_text,
    p.description AS cover_caption
   FROM authors a
     JOIN author_translations t ON t.author_id = a.id AND t.locale = site_language(web_site_id())
     LEFT JOIN photos p ON p.id = a.photo_id
  WHERE a.kind = 'office'::author_kind AND a.show_on_about AND a.photo_consent AND a.site_id = web_site_id()
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
    p.file_name AS cover_file_name,
    p.alt_text AS cover_alt_text,
    p.description AS cover_caption
   FROM trekking_guides g
     JOIN trekking_guide_translations gt ON gt.guide_id = g.id AND gt.locale = site_language(web_site_id())
     LEFT JOIN photos p ON p.id = g.photo_id
  WHERE g.show_on_about AND g.photo_consent AND g.site_id = web_site_id();

create or replace view public.web_page_seo_overrides as
 SELECT 'page'::text AS page_kind,
    s.slug AS page_slug,
    site_language(s.site_id) AS locale,
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

-- ---------------------------------------------------------------------------------------------------------------
-- Functions

create or replace function public.save_trek(p_trek_id uuid, p_locale text, p_trek jsonb, p_text jsonb, p_photos jsonb, p_days jsonb, p_prices jsonb, p_departures jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
  region uuid := (p_trek ->> 'region_id')::uuid;
begin
  if jsonb_array_length(p_prices) > 10 or jsonb_array_length(p_departures) > 100 then
    raise exception 'Too many group prices or departure dates' using errcode = '22023';
  end if;

  if jsonb_array_length(coalesce(p_trek -> 'similar_trek_ids', '[]')) > 4 then
    raise exception 'A trek can suggest up to 4 similar treks' using errcode = '22023';
  end if;

  if jsonb_array_length(coalesce(p_trek -> 'article_ids', '[]')) > 5 then
    raise exception 'A trek can show up to 5 blog posts' using errcode = '22023';
  end if;

  if jsonb_array_length(coalesce(p_trek -> 'guide_ids', '[]')) > 10 then
    raise exception 'A trek can show up to 10 guides' using errcode = '22023';
  end if;

  if jsonb_array_length(coalesce(p_trek -> 'route_region_ids', '[]')) > 4 then
    raise exception 'A trek can pass through up to 4 more regions' using errcode = '22023';
  end if;

  if jsonb_array_length(p_days) > 60 then
    raise exception 'A trek can have up to 60 days' using errcode = '22023';
  end if;

  -- A day that goes higher than where you sleep names its highest point (the altitude chart shows both). Only
  -- checked when the admin sends high_place, so an admin deployed before this migration can still save.
  if exists (
    select 1 from jsonb_array_elements(p_days) as d (day)
    where d.day ? 'high_place'
      and (d.day ->> 'sleep_altitude_m')::integer < (d.day ->> 'altitude_m')::integer
      and coalesce(btrim(d.day ->> 'high_place'), '') = ''
  ) then
    raise exception 'Name the highest point of every day that goes higher than where you sleep' using errcode = '22023';
  end if;

  if jsonb_array_length(p_photos -> 'gallery') > 30 then
    raise exception 'A trek can have up to 30 gallery photos' using errcode = '22023';
  end if;

  if p_trek_id is null then
    insert into public.treks (
      site_id, slug, region_id, status, difficulty, grade, days, max_altitude_m, distance_km,
      seasons, tags, is_popular, cover_photo_id, meal_budget_min_usd, meal_budget_max_usd, has_fixed_dates, map_place, my_maps_id, hidden_shared_sections,
      section_order, optional_high_point_m, pdf_map_path, gpx_track_path, featured_article_id, updated_by
    )
    values (
      coalesce(nullif(p_trek ->> 'site_id', ''), 'ttn'), p_trek ->> 'slug', region, (p_trek ->> 'status')::public.trek_status,
      (p_trek ->> 'difficulty')::public.trek_difficulty, (p_trek ->> 'grade')::smallint,
      (p_trek ->> 'days')::smallint, (p_trek ->> 'max_altitude_m')::integer, (p_trek ->> 'distance_km')::integer,
      array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
      array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
      (p_trek ->> 'is_popular')::boolean, nullif(p_trek ->> 'cover_photo_id', '')::uuid,
      (p_trek ->> 'meal_budget_min_usd')::integer, (p_trek ->> 'meal_budget_max_usd')::integer,
      coalesce((p_trek ->> 'has_fixed_dates')::boolean, false), p_trek ->> 'map_place', nullif(p_trek ->> 'my_maps_id', ''),
      array(select jsonb_array_elements_text(coalesce(p_trek -> 'hidden_shared_sections', '[]'))),
      array(select jsonb_array_elements_text(coalesce(p_trek -> 'section_order', '[]'))),
      (p_trek ->> 'optional_high_point_m')::integer, nullif(p_trek ->> 'pdf_map_path', ''), nullif(p_trek ->> 'gpx_track_path', ''),
      nullif(p_trek ->> 'featured_article_id', '')::uuid, auth.uid()
    )
    returning id into saved_id;
  else
    update public.treks
    set slug = p_trek ->> 'slug',
        region_id = region,
        status = (p_trek ->> 'status')::public.trek_status,
        difficulty = (p_trek ->> 'difficulty')::public.trek_difficulty,
        grade = (p_trek ->> 'grade')::smallint,
        days = (p_trek ->> 'days')::smallint,
        max_altitude_m = (p_trek ->> 'max_altitude_m')::integer,
        distance_km = (p_trek ->> 'distance_km')::integer,
        seasons = array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
        tags = array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
        is_popular = (p_trek ->> 'is_popular')::boolean,
        cover_photo_id = nullif(p_trek ->> 'cover_photo_id', '')::uuid,
        meal_budget_min_usd = (p_trek ->> 'meal_budget_min_usd')::integer,
        meal_budget_max_usd = (p_trek ->> 'meal_budget_max_usd')::integer,
        has_fixed_dates = coalesce((p_trek ->> 'has_fixed_dates')::boolean, has_fixed_dates),
        map_place = p_trek ->> 'map_place',
        my_maps_id = nullif(p_trek ->> 'my_maps_id', ''),
        hidden_shared_sections = array(select jsonb_array_elements_text(coalesce(p_trek -> 'hidden_shared_sections', '[]'))),
        section_order = array(select jsonb_array_elements_text(coalesce(p_trek -> 'section_order', '[]'))),
        optional_high_point_m = (p_trek ->> 'optional_high_point_m')::integer,
        pdf_map_path = nullif(p_trek ->> 'pdf_map_path', ''),
        gpx_track_path = nullif(p_trek ->> 'gpx_track_path', ''),
        featured_article_id = nullif(p_trek ->> 'featured_article_id', '')::uuid,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_trek_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Trek not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.trek_translations as t (
    trek_id, locale, name, summary, card_badge, photo_badges,
    start_finish, daily_walking, guide_ratio, season_label, accommodation, transport,
    introduction, highlights_heading, highlights, suitability_intro, suitability_points, itinerary_intro,
    included, excluded, meal_trail_tips, meal_teahouse_notes, packing_intro, packing_groups, faqs,
    headline, short_name, seo_keyword, seo_title, seo_description, share_photo_id, canonical_path, hide_from_google, guides_intro,
    current_season, category, protected_area, days_note, high_point, optional_high_point, activity, suitability_heading, itinerary_heading, route_line, inclusions_heading, guides_heading, elevation_heading, elevation_note, route_map_heading, trek_start, trek_end, pricing_heading, pricing_intro, packing_heading, know_heading, know_intro, faq_heading, similar_heading, similar_intro,
    know_topics, videos, intro_heading, overview_heading, regions_heading, packing_line, route_map_line, months_line
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'summary', p_text ->> 'card_badge', p_text -> 'photo_badges',
    p_text ->> 'start_finish', p_text ->> 'daily_walking', p_text ->> 'guide_ratio', p_text ->> 'season_label',
    p_text ->> 'accommodation', p_text ->> 'transport',
    p_text -> 'introduction', p_text ->> 'highlights_heading', p_text -> 'highlights',
    p_text ->> 'suitability_intro', p_text -> 'suitability_points', p_text -> 'itinerary_intro',
    p_text -> 'included', p_text -> 'excluded', p_text -> 'meal_trail_tips', p_text -> 'meal_teahouse_notes',
    coalesce(p_text ->> 'packing_intro', ''), p_text -> 'packing_groups', p_text -> 'faqs',
    p_text ->> 'headline', p_text ->> 'short_name', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description', nullif(p_text ->> 'share_photo_id', '')::uuid, coalesce(p_text ->> 'canonical_path', ''), coalesce((p_text ->> 'hide_from_google')::boolean, false), p_text ->> 'guides_intro',
    p_text ->> 'current_season', p_text ->> 'category', p_text ->> 'protected_area', p_text ->> 'days_note', p_text ->> 'high_point', p_text ->> 'optional_high_point', p_text ->> 'activity', p_text ->> 'suitability_heading', p_text ->> 'itinerary_heading', p_text ->> 'route_line', p_text ->> 'inclusions_heading', p_text ->> 'guides_heading', p_text ->> 'elevation_heading', p_text ->> 'elevation_note', p_text ->> 'route_map_heading', p_text ->> 'trek_start', p_text ->> 'trek_end', p_text ->> 'pricing_heading', p_text ->> 'pricing_intro', p_text ->> 'packing_heading', p_text ->> 'know_heading', p_text ->> 'know_intro', p_text ->> 'faq_heading', p_text ->> 'similar_heading', p_text ->> 'similar_intro',
    p_text -> 'know_topics', p_text -> 'videos', coalesce(p_text ->> 'intro_heading', ''), coalesce(p_text ->> 'overview_heading', ''), coalesce(p_text ->> 'regions_heading', ''),
    coalesce(p_text -> 'packing_line', '{"type": "doc", "content": [{"type": "paragraph"}]}'::jsonb), coalesce(p_text -> 'route_map_line', '{"type": "doc", "content": [{"type": "paragraph"}]}'::jsonb), coalesce(p_text -> 'months_line', '{"type": "doc", "content": [{"type": "paragraph"}]}'::jsonb)
  )
  on conflict (trek_id, locale) do update
  set name = excluded.name,
      summary = excluded.summary,
      card_badge = excluded.card_badge,
      photo_badges = excluded.photo_badges,
      start_finish = excluded.start_finish,
      daily_walking = excluded.daily_walking,
      guide_ratio = excluded.guide_ratio,
      season_label = excluded.season_label,
      accommodation = excluded.accommodation,
      transport = excluded.transport,
      introduction = excluded.introduction,
      highlights_heading = excluded.highlights_heading,
      highlights = excluded.highlights,
      suitability_intro = excluded.suitability_intro,
      suitability_points = excluded.suitability_points,
      itinerary_intro = excluded.itinerary_intro,
      included = excluded.included,
      excluded = excluded.excluded,
      meal_trail_tips = excluded.meal_trail_tips,
      meal_teahouse_notes = excluded.meal_teahouse_notes,
      -- Retired for packing_line (20261112100000): kept as it was unless an older admin still sends it.
      packing_intro = coalesce(p_text ->> 'packing_intro', t.packing_intro),
      packing_groups = excluded.packing_groups,
      faqs = excluded.faqs,
      headline = excluded.headline,
      short_name = excluded.short_name,
      seo_keyword = excluded.seo_keyword,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      share_photo_id = excluded.share_photo_id,
      canonical_path = excluded.canonical_path,
      hide_from_google = excluded.hide_from_google,
      guides_intro = excluded.guides_intro,
      current_season = excluded.current_season,
      category = excluded.category,
      protected_area = excluded.protected_area,
      days_note = excluded.days_note,
      high_point = excluded.high_point,
      optional_high_point = excluded.optional_high_point,
      activity = excluded.activity,
      suitability_heading = excluded.suitability_heading,
      itinerary_heading = excluded.itinerary_heading,
      route_line = excluded.route_line,
      inclusions_heading = excluded.inclusions_heading,
      guides_heading = excluded.guides_heading,
      elevation_heading = excluded.elevation_heading,
      elevation_note = excluded.elevation_note,
      route_map_heading = excluded.route_map_heading,
      trek_start = excluded.trek_start,
      trek_end = excluded.trek_end,
      pricing_heading = excluded.pricing_heading,
      pricing_intro = excluded.pricing_intro,
      packing_heading = excluded.packing_heading,
      know_heading = excluded.know_heading,
      know_intro = excluded.know_intro,
      faq_heading = excluded.faq_heading,
      similar_heading = excluded.similar_heading,
      similar_intro = excluded.similar_intro,
      know_topics = excluded.know_topics,
      videos = excluded.videos,
      intro_heading = excluded.intro_heading,
      overview_heading = excluded.overview_heading,
      regions_heading = excluded.regions_heading,
      packing_line = coalesce(p_text -> 'packing_line', t.packing_line),
      route_map_line = coalesce(p_text -> 'route_map_line', t.route_map_line),
      months_line = coalesce(p_text -> 'months_line', t.months_line),
      updated_at = now();

  update public.photos p
  set place = d.place,
      region_id = coalesce(p.region_id, region),
      updated_at = now()
  from jsonb_to_recordset(p_photos -> 'details') as d (id uuid, place text)
  where p.id = d.id;

  delete from public.trek_photos where trek_id = saved_id;
  insert into public.trek_photos (trek_id, photo_id, position)
  select saved_id, g.photo_id::uuid, (g.n - 1)::smallint
  from jsonb_array_elements_text(p_photos -> 'gallery') with ordinality as g (photo_id, n);

  -- Days: keep the ids the editor sends (so other languages stay attached), add new ones, drop removed ones.
  create temporary table incoming_days on commit drop as
  select coalesce(nullif(d.day ->> 'id', '')::uuid, gen_random_uuid()) as id, (d.n - 1)::smallint as position, d.day
  from jsonb_array_elements(p_days) with ordinality as d (day, n);

  delete from public.trek_days where trek_id = saved_id and id not in (select id from incoming_days);
  -- Cleared first, so moving the highlight to another day never briefly makes two (one per trek is enforced).
  update public.trek_days set is_high_point = false where trek_id = saved_id and is_high_point;

  insert into public.trek_days as k (id, trek_id, position, altitude_m, sleep_altitude_m, is_high_point, photo_id, meals, region_id)
  select i.id, saved_id, i.position, (i.day ->> 'altitude_m')::integer, (i.day ->> 'sleep_altitude_m')::integer,
         (i.day ->> 'is_high_point')::boolean, nullif(i.day ->> 'photo_id', '')::uuid,
         array(select jsonb_array_elements_text(coalesce(i.day -> 'meals', '[]'))),
         -- Only a region on this save's route (the main one or one after it); anything else stays empty.
         case
           when i.day ->> 'region_id' = region::text
             or i.day ->> 'region_id' in (select jsonb_array_elements_text(coalesce(p_trek -> 'route_region_ids', '[]')))
           then (i.day ->> 'region_id')::uuid
         end
  from incoming_days i
  on conflict (id) do update
  set position = excluded.position,
      altitude_m = excluded.altitude_m,
      sleep_altitude_m = excluded.sleep_altitude_m,
      is_high_point = excluded.is_high_point,
      photo_id = excluded.photo_id,
      meals = excluded.meals,
      region_id = excluded.region_id
  -- An id from another trek is never taken over.
  where k.trek_id = saved_id;

  insert into public.trek_day_translations as t (day_id, locale, place, high_place, title, subtitle, duration, description)
  select i.id, p_locale, i.day ->> 'place', coalesce(i.day ->> 'high_place', ''), i.day ->> 'title', i.day ->> 'subtitle', i.day ->> 'duration', i.day -> 'description'
  from incoming_days i
  join public.trek_days k on k.id = i.id and k.trek_id = saved_id
  on conflict (day_id, locale) do update
  set place = excluded.place,
      high_place = excluded.high_place,
      title = excluded.title,
      subtitle = excluded.subtitle,
      duration = excluded.duration,
      description = excluded.description;

  -- Group prices: same pattern as days (ids kept so other languages stay attached; one "Most popular").
  create temporary table incoming_prices on commit drop as
  select coalesce(nullif(p.price ->> 'id', '')::uuid, gen_random_uuid()) as id, (p.n - 1)::smallint as position, p.price
  from jsonb_array_elements(p_prices) with ordinality as p (price, n);

  delete from public.trek_group_prices where trek_id = saved_id and id not in (select id from incoming_prices);
  update public.trek_group_prices set is_default = false where trek_id = saved_id and is_default;

  insert into public.trek_group_prices as g (id, trek_id, position, price_usd, is_default)
  select i.id, saved_id, i.position, coalesce(i.price ->> 'price', i.price ->> 'price_usd')::integer, (i.price ->> 'is_default')::boolean
  from incoming_prices i
  on conflict (id) do update
  set position = excluded.position, price_usd = excluded.price_usd, is_default = excluded.is_default
  where g.trek_id = saved_id;

  insert into public.trek_group_price_translations as t (price_id, locale, label, short_label, team)
  select i.id, p_locale, i.price ->> 'label', i.price ->> 'short_label', i.price ->> 'team'
  from incoming_prices i
  join public.trek_group_prices g on g.id = i.id and g.trek_id = saved_id
  on conflict (price_id, locale) do update
  set label = excluded.label, short_label = excluded.short_label, team = excluded.team;

  -- The "From" price on cards and lists is the Most popular group's price.
  update public.treks
  set price_from_usd = (select price_usd from public.trek_group_prices where trek_id = saved_id and is_default)
  where id = saved_id;

  -- Departure dates: left as they are when none are sent (null), as the admin no longer edits them.
  if p_departures is not null then
    -- Departure dates: one per day per trek; past dates stay here and are hidden on the website.
    create temporary table incoming_departures on commit drop as
    select coalesce(nullif(d.departure ->> 'id', '')::uuid, gen_random_uuid()) as id, d.departure
    from jsonb_array_elements(p_departures) as d (departure);

    delete from public.trek_departures where trek_id = saved_id and id not in (select id from incoming_departures);

    -- The special price and team note are edited on the Departure dates screen, so an update keeps them.
    insert into public.trek_departures as k (id, trek_id, start_date, status)
    select i.id, saved_id, (i.departure ->> 'start_date')::date, (i.departure ->> 'status')::public.departure_status
    from incoming_departures i
    on conflict (id) do update
    set start_date = excluded.start_date, status = excluded.status
    where k.trek_id = saved_id;

    insert into public.trek_departure_translations as t (departure_id, locale, note)
    select i.id, p_locale, i.departure ->> 'note'
    from incoming_departures i
    join public.trek_departures k on k.id = i.id and k.trek_id = saved_id
    on conflict (departure_id, locale) do update set note = excluded.note;
  end if;

  -- Similar treks in order (never the trek itself). An id that isn't a trek fails the foreign key.
  delete from public.trek_similar where trek_id = saved_id;
  insert into public.trek_similar (trek_id, similar_trek_id, position)
  select saved_id, s.similar_id::uuid, (s.n - 1)::smallint
  from jsonb_array_elements_text(coalesce(p_trek -> 'similar_trek_ids', '[]')) with ordinality as s (similar_id, n)
  where s.similar_id::uuid <> saved_id;

  -- Guides in page order. An id that isn't a guide fails the foreign key.
  delete from public.trek_guides where trek_id = saved_id;
  insert into public.trek_guides (trek_id, guide_id, position)
  select saved_id, g.guide_id::uuid, (g.n - 1)::smallint
  from jsonb_array_elements_text(coalesce(p_trek -> 'guide_ids', '[]')) with ordinality as g (guide_id, n);

  -- Blog posts in page order, each once. One of another website's fails the foreign key. Only when the admin sends
  -- article_ids, so an admin deployed before this migration can still save.
  if p_trek ? 'article_ids' then
    delete from public.trek_articles where trek_id = saved_id;
    insert into public.trek_articles (trek_id, article_id, site_id, position)
    select saved_id, a.article_id::uuid, (select t.site_id from public.treks t where t.id = saved_id), (min(a.n) - 1)::smallint
    from jsonb_array_elements_text(p_trek -> 'article_ids') with ordinality as a (article_id, n)
    group by a.article_id;
  end if;

  delete from public.trek_regions where trek_id = saved_id;
  insert into public.trek_regions (trek_id, region_id, position)
  select saved_id, r.region_id::uuid, r.n::smallint
  from jsonb_array_elements_text(coalesce(p_trek -> 'route_region_ids', '[]')) with ordinality as r (region_id, n)
  where r.region_id::uuid <> region;

  return saved_id;
end;
$function$;

create or replace function public.copy_trek(p_trek_id uuid, p_site_id text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  source public.treks%rowtype;
  new_id uuid := gen_random_uuid();
  new_slug text;
  n integer := 1;
  -- Old id → new id of the days and the group prices, so their texts follow them.
  day_ids jsonb;
  price_ids jsonb;
  -- The copy is written in the region website's language: an English trek copied to a German website is the German
  -- draft to translate. Prices keep their numbers, also when the currencies differ (the admin says so).
  source_locale text := public.site_language('ttn');
  new_locale text := public.site_language(p_site_id);
begin
  select * into source from public.treks where id = p_trek_id and site_id = 'ttn';
  if not found then
    raise exception 'No such trek on Travel To Nepal' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.kind = 'region') then
    raise exception 'Treks are copied to a region website' using errcode = '22023';
  end if;

  new_slug := source.slug;
  while exists (select 1 from public.treks t where t.site_id = p_site_id and t.slug = new_slug) loop
    n := n + 1;
    new_slug := left(source.slug, 76) || '-' || n;
  end loop;

  -- Every column as it is (new columns too), but these. Runs as the admin: Row Level Security applies. The photos are
  -- Travel To Nepal's, so they stay behind (20261111110000_photos_per_site.sql): the region website adds its own.
  insert into public.treks
  select (jsonb_populate_record(null::public.treks, to_jsonb(source) || jsonb_build_object(
    'id', new_id, 'site_id', p_site_id, 'slug', new_slug, 'status', 'draft', 'published_at', null, 'pdf_map_path', null, 'gpx_track_path', null,
    'featured_article_id', null,
    'cover_photo_id', null, 'created_at', now(), 'updated_at', now(), 'updated_by', auth.uid()
  ))).*;

  insert into public.trek_translations
  select (jsonb_populate_record(null::public.trek_translations, public.without_photos(to_jsonb(t)) || jsonb_build_object(
    'trek_id', new_id, 'locale', new_locale, 'canonical_path', '', 'hide_from_google', false, 'share_photo_id', null, 'updated_at', now()
  ))).*
  from public.trek_translations t where t.trek_id = p_trek_id and t.locale = source_locale;

  -- Days and group prices get new ids; their texts follow them.
  select coalesce(jsonb_object_agg(d.id, gen_random_uuid()), '{}') into day_ids from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_days
  select (jsonb_populate_record(null::public.trek_days, to_jsonb(d) || jsonb_build_object('id', day_ids -> d.id::text, 'trek_id', new_id, 'photo_id', null))).*
  from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_day_translations
  select (jsonb_populate_record(null::public.trek_day_translations, public.without_photos(to_jsonb(dt)) || jsonb_build_object('day_id', day_ids -> dt.day_id::text, 'locale', new_locale))).*
  from public.trek_day_translations dt where day_ids ? dt.day_id::text and dt.locale = source_locale;

  select coalesce(jsonb_object_agg(p.id, gen_random_uuid()), '{}') into price_ids from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_prices
  select (jsonb_populate_record(null::public.trek_group_prices, to_jsonb(p) || jsonb_build_object('id', price_ids -> p.id::text, 'trek_id', new_id))).*
  from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_price_translations
  select (jsonb_populate_record(null::public.trek_group_price_translations, to_jsonb(pt) || jsonb_build_object('price_id', price_ids -> pt.price_id::text, 'locale', new_locale))).*
  from public.trek_group_price_translations pt where price_ids ? pt.price_id::text and pt.locale = source_locale;

  insert into public.trek_regions (trek_id, region_id, position) select new_id, region_id, position from public.trek_regions where trek_id = p_trek_id;
  -- The trek's guides and photos stay behind: they belong to Travel To Nepal.

  return new_id;
end;
$function$;

create or replace function public.photo_uses(p_photo_id uuid DEFAULT NULL::uuid)
 RETURNS TABLE(photo_id uuid, kind text, item_id text, item_label text, detail text)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  with
    trek_names as (
      select t.id, coalesce(nullif(tt.name, ''), t.slug) as name
      from public.treks t left join public.trek_translations tt on tt.trek_id = t.id and tt.locale = public.site_language(t.site_id)
    ),
    region_names as (
      select r.id, coalesce(nullif(rt.name, ''), r.slug) as name
      from public.regions r left join public.region_translations rt on rt.region_id = r.id and rt.locale = public.site_language('ttn')
    ),
    guide_names as (
      select a.id, coalesce(nullif(at.title, ''), a.slug) as name
      from public.articles a left join public.article_translations at on at.article_id = a.id and at.locale = public.site_language(a.site_id)
    ),
    uses (photo_id, kind, item_id, item_label, detail) as (
      -- Treks
      select t.cover_photo_id, 'trek', t.id::text, n.name, 'Cover'
      from public.treks t join trek_names n on n.id = t.id where t.cover_photo_id is not null
      union all
      select tp.photo_id, 'trek', tp.trek_id::text, n.name, 'Gallery'
      from public.trek_photos tp join trek_names n on n.id = tp.trek_id
      union all
      select d.photo_id, 'trek', d.trek_id::text, n.name, 'Day ' || (d.position + 1)
      from public.trek_days d join trek_names n on n.id = d.trek_id where d.photo_id is not null
      union all
      select ids.id, 'trek', tt.trek_id::text, n.name, 'In the text'
      from public.trek_translations tt join trek_names n on n.id = tt.trek_id
      cross join lateral public.photo_ids_in(to_jsonb(tt)) as ids (id)
      union all
      select ids.id, 'trek', d.trek_id::text, n.name, 'Day ' || (d.position + 1) || ' text'
      from public.trek_day_translations dt
      join public.trek_days d on d.id = dt.day_id
      join trek_names n on n.id = d.trek_id
      cross join lateral public.photo_ids_in(to_jsonb(dt)) as ids (id)
      union all
      select tt.share_photo_id, 'trek', tt.trek_id::text, n.name, 'Share photo'
      from public.trek_translations tt join trek_names n on n.id = tt.trek_id where tt.share_photo_id is not null

      -- Regions
      union all
      select r.cover_photo_id, 'region', r.id::text, n.name, 'Cover'
      from public.regions r join region_names n on n.id = r.id where r.cover_photo_id is not null
      union all
      select rp.photo_id, 'region', rp.region_id::text, n.name, 'Gallery'
      from public.region_photos rp join region_names n on n.id = rp.region_id
      union all
      select ids.id, 'region', rt.region_id::text, n.name, 'In the text'
      from public.region_translations rt join region_names n on n.id = rt.region_id
      cross join lateral public.photo_ids_in(to_jsonb(rt)) as ids (id)
      union all
      select rt.share_photo_id, 'region', rt.region_id::text, n.name, 'Share photo'
      from public.region_translations rt join region_names n on n.id = rt.region_id where rt.share_photo_id is not null

      -- Travel guides
      union all
      select a.cover_photo_id, 'guide', a.id::text, n.name, 'Cover'
      from public.articles a join guide_names n on n.id = a.id where a.cover_photo_id is not null
      union all
      select sp.photo_id, 'guide', s.article_id::text, n.name, 'Section ' || (s.position + 1)
      from public.article_section_photos sp
      join public.article_sections s on s.id = sp.section_id
      join guide_names n on n.id = s.article_id
      union all
      select ids.id, 'guide', s.article_id::text, n.name, 'Section ' || (s.position + 1) || ' text'
      from public.article_sections s
      left join public.article_section_translations st on st.section_id = s.id
      join guide_names n on n.id = s.article_id
      cross join lateral public.photo_ids_in(jsonb_build_array(s.settings, st.content)) as ids (id)
      union all
      select ids.id, 'guide', at.article_id::text, n.name, 'In the text'
      from public.article_translations at join guide_names n on n.id = at.article_id
      cross join lateral public.photo_ids_in(to_jsonb(at)) as ids (id)
      union all
      select at.share_photo_id, 'guide', at.article_id::text, n.name, 'Share photo'
      from public.article_translations at join guide_names n on n.id = at.article_id where at.share_photo_id is not null

      -- Fixed pages
      union all
      select p.photo_id, 'page', p.slug, p.slug, 'Top photo'
      from public.site_pages p where p.photo_id is not null
      union all
      select pp.photo_id, 'page', pp.page_slug, pp.page_slug, 'Photo ' || pp.position
      from public.site_page_photos pp
      union all
      select ids.id, 'page', p.slug, p.slug, 'In the text'
      from public.site_pages p cross join lateral public.photo_ids_in(p.content) as ids (id)
      union all
      select p.share_photo_id, 'page', p.slug, p.slug, 'Share photo'
      from public.site_pages p where p.share_photo_id is not null

      -- Adventures
      union all
      select a.photo_id, 'adventure', a.id::text, a.title, 'Card photo'
      from public.adventures a where a.photo_id is not null
      union all
      select ids.id, 'adventure', 'section', 'Section text', 'In the text'
      from public.adventure_section s cross join lateral public.photo_ids_in(s.steps) as ids (id)

      -- People
      union all
      select a.photo_id, 'author', a.id::text, a.name, 'Author photo'
      from public.authors a where a.photo_id is not null
      union all
      select g.photo_id, 'trekking_guide', g.id::text, g.name, 'Guide photo'
      from public.trekking_guides g where g.photo_id is not null
      union all
      select r.photo_id, 'review', r.id::text, r.reviewer_name, 'Reviewer photo'
      from public.reviews r where r.photo_id is not null

      -- Company (Site settings)
      union all
      select s.certificate_photo_id, 'settings', 'settings', 'Site settings', 'Licence scan'
      from public.site_settings s where s.certificate_photo_id is not null
      union all
      select s.pan_certificate_photo_id, 'settings', 'settings', 'Site settings', 'PAN certificate scan'
      from public.site_settings s where s.pan_certificate_photo_id is not null
      union all
      select s.share_photo_id, 'settings', 'settings', 'Site settings', 'Share image'
      from public.site_settings s where s.share_photo_id is not null
    )
  select distinct u.photo_id, u.kind, u.item_id, u.item_label, u.detail
  from uses u
  where p_photo_id is null or u.photo_id = p_photo_id;
$function$;

create or replace function public.video_uses(p_youtube_id text DEFAULT NULL::text)
 RETURNS TABLE(youtube_id text, kind text, item_id text, item_label text, detail text)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  with
    trek_names as (
      select t.id, coalesce(nullif(tt.name, ''), t.slug) as name
      from public.treks t left join public.trek_translations tt on tt.trek_id = t.id and tt.locale = public.site_language(t.site_id)
    ),
    guide_names as (
      select a.id, coalesce(nullif(at.title, ''), a.slug) as name
      from public.articles a left join public.article_translations at on at.article_id = a.id and at.locale = public.site_language(a.site_id)
    ),
    uses (youtube_id, kind, item_id, item_label, detail) as (
      select v ->> 'youtubeId', 'trek', tt.trek_id::text, n.name, 'Videos'
      from public.trek_translations tt
      join trek_names n on n.id = tt.trek_id
      cross join lateral jsonb_array_elements(tt.videos) as v
      union all
      select topic ->> 'videoId', 'trek', tt.trek_id::text, n.name, 'Trek guide: ' || coalesce(nullif(topic ->> 'title', ''), 'a topic')
      from public.trek_translations tt
      join trek_names n on n.id = tt.trek_id
      cross join lateral jsonb_array_elements(tt.know_topics) as topic
      where topic ->> 'videoId' is not null
      union all
      select s.settings ->> 'youtubeId', 'guide', s.article_id::text, n.name, 'Section ' || (s.position + 1)
      from public.article_sections s
      join guide_names n on n.id = s.article_id
      where s.type = 'video'
    )
  select distinct u.youtube_id, u.kind, u.item_id, u.item_label, u.detail
  from uses u
  where u.youtube_id is not null and (p_youtube_id is null or u.youtube_id = p_youtube_id);
$function$;

create or replace function public.trek_usage(p_trek_id uuid, p_locale text DEFAULT 'en'::text)
 RETURNS TABLE(kind text, id text, name text)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  select 'website', s.id, s.name
  from public.sites s
  where s.home_trek_id = p_trek_id
  union all
  select 'region', r.id::text, coalesce(rt.name, r.slug)
  from public.regions r
  left join public.region_translations rt on rt.region_id = r.id and rt.locale = public.site_language('ttn')
  where r.featured_trek_id = p_trek_id
  union all
  select 'travel_guide', a.id::text, coalesce(art.title, a.slug)
  from public.articles a
  left join public.article_translations art on art.article_id = a.id and art.locale = public.site_language(a.site_id)
  where a.main_trek_id = p_trek_id
     or exists (
       select 1 from public.article_sections s
       where s.article_id = a.id
         and (s.trek_id = p_trek_id or coalesce(s.settings -> 'trekIds', '[]'::jsonb) ? p_trek_id::text)
     )
  order by 1, 3;
$function$;

