-- Faster planning for the travel guide and region pages. Both views looked up "is this trek published, and its
-- slug?" through web_treks, a large view Postgres expands in full every time (six times in a guide page): on a fresh
-- database connection, as a build opens many of, planning a guide page took seconds and hit the website's 3 s limit.
-- published_trek_slugs answers the same question with the same rule as web_treks (published, with its text and its
-- region's text in that language) from three tables. It is internal: only these views read it (as their owner).
-- Same columns as before in both views, so nothing on the website changes.

create view public.published_trek_slugs as
select tr.id, tr.slug, t.locale
from public.treks tr
join public.trek_translations t on t.trek_id = tr.id
join public.region_translations rt on rt.region_id = tr.region_id and rt.locale = t.locale
where tr.status = 'published';

revoke all on public.published_trek_slugs from public, anon, authenticated;

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
                    ELSE jsonb_build_object('cover_id', ap.id, 'cover_width', ap.width, 'cover_height', ap.height, 'cover_variant_widths', ap.variant_widths, 'cover_placeholder', ap.placeholder, 'cover_place', ap.place)
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
                    ELSE jsonb_build_object('cover_id', cp.id, 'cover_width', cp.width, 'cover_height', cp.height, 'cover_variant_widths', cp.variant_widths, 'cover_placeholder', cp.placeholder, 'cover_place', cp.place)
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
                            ELSE jsonb_build_object('cover_id', sp.id, 'cover_width', sp.width, 'cover_height', sp.height, 'cover_variant_widths', sp.variant_widths, 'cover_placeholder', sp.placeholder, 'cover_place', sp.place)
                        END) ORDER BY sgl."position") AS jsonb_agg
                   FROM article_section_guides sgl
                     JOIN trekking_guides sg ON sg.id = sgl.guide_id AND sg.photo_consent
                     LEFT JOIN trekking_guide_translations sgt ON sgt.guide_id = sg.id AND sgt.locale = g.locale
                     LEFT JOIN photos sp ON sp.id = sg.photo_id
                  WHERE sgl.section_id = s.id), '[]'::jsonb), 'photos', COALESCE(( SELECT jsonb_agg(jsonb_build_object('cover_id', ph.id, 'cover_width', ph.width, 'cover_height', ph.height, 'cover_variant_widths', ph.variant_widths, 'cover_placeholder', ph.placeholder, 'cover_place', ph.place) ORDER BY spl."position") AS jsonb_agg
                   FROM article_section_photos spl
                     JOIN photos ph ON ph.id = spl.photo_id
                  WHERE spl.section_id = s.id), '[]'::jsonb), 'days', COALESCE(
                CASE
                    WHEN s.type::text = 'altitude'::text THEN ( SELECT jsonb_agg(jsonb_build_object('place', dt.place, 'title', dt.title, 'subtitle', dt.subtitle, 'duration', dt.duration, 'altitude_m', d.altitude_m, 'sleep_altitude_m', d.sleep_altitude_m, 'is_high_point', d.is_high_point, 'day_number', d."position" + 1, 'description', dt.description) ORDER BY d."position") AS jsonb_agg
                       FROM trek_days d
                         JOIN trek_day_translations dt ON dt.day_id = d.id AND dt.locale = g.locale
                      WHERE d.trek_id = s.trek_id AND (EXISTS ( SELECT 1
                               FROM published_trek_slugs w
                              WHERE w.id = d.trek_id AND w.locale = g.locale)))
                    ELSE ( SELECT jsonb_agg(jsonb_build_object('place', dt.place, 'title', dt.title, 'subtitle', dt.subtitle, 'duration', dt.duration, 'altitude_m', d.altitude_m, 'sleep_altitude_m', d.sleep_altitude_m, 'is_high_point', d.is_high_point, 'day_number', d."position" + 1, 'description', dt.description) ORDER BY picked."position") AS jsonb_agg
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
    t.help_message
   FROM web_travel_guides g
     JOIN articles a ON a.id = g.id
     JOIN article_translations t ON t.article_id = a.id AND t.locale = g.locale
     LEFT JOIN photos p ON p.id = a.cover_photo_id
     LEFT JOIN photos sh ON sh.id = t.share_photo_id;

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
    sh.place AS share_place
   FROM regions r
     JOIN region_translations t ON t.region_id = r.id
     LEFT JOIN photos sh ON sh.id = t.share_photo_id
  WHERE rich_text_has_words(t.introduction);
