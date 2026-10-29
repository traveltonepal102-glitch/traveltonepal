-- The help box beside a travel guide (the navy "Not sure when to go?" box with its WhatsApp button): each guide can
-- word it for its own topic, per language. Empty: the website's default wording (@ttn/config/guideHelpBox, same limits).

alter table public.article_translations
  add column help_heading text not null default '' check (char_length(help_heading) <= 60),
  add column help_text text not null default '' check (char_length(help_text) <= 200),
  add column help_button text not null default '' check (char_length(help_button) <= 30),
  add column help_message text not null default '' check (char_length(help_message) <= 200);

-- save_article also saves the help box (p_text: help_heading, help_text, help_button, help_message). Rebuilt from
-- the live definition.
CREATE OR REPLACE FUNCTION public.save_article(p_article_id uuid, p_locale text, p_article jsonb, p_text jsonb, p_region_ids jsonb, p_related_ids jsonb, p_sections jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
  site uuid := nullif(p_article ->> 'site_region_id', '')::uuid;
  site_key uuid := coalesce(nullif(p_article ->> 'site_region_id', '')::uuid, '00000000-0000-0000-0000-000000000000'::uuid);
  author uuid := nullif(p_article ->> 'author_id', '')::uuid;
  checker uuid := nullif(p_article ->> 'checker_guide_id', '')::uuid;
  new_status public.article_status := (p_article ->> 'status')::public.article_status;
  today date := (now() at time zone 'Asia/Kathmandu')::date;
  is_date_mode boolean := p_article ->> 'publish_mode' = 'date';
  chosen_date date := nullif(p_article ->> 'published_on', '')::date;
  start_number smallint := (p_article ->> 'start_here_position')::smallint;
begin
  if jsonb_array_length(p_region_ids) > 20 or jsonb_array_length(p_related_ids) > 3 or jsonb_array_length(p_sections) > 60 then
    raise exception 'Too many regions, related guides or sections' using errcode = '22023';
  end if;

  if author is not null and not exists (select 1 from public.authors a where a.id = author and p_locale = any (a.writes_in)) then
    raise exception 'author_language' using errcode = '22023';
  end if;

  if checker is not null and not exists (
    select 1 from public.trekking_guides g where g.id = checker and g.can_fact_check and g.photo_consent
  ) then
    raise exception 'checker_not_allowed' using errcode = '22023';
  end if;

  if new_status = 'published' and checker is null and exists (select 1 from public.authors a where a.id = author and a.kind = 'guest') then
    raise exception 'guest_needs_checker' using errcode = '22023';
  end if;

  -- A guide shown in the article (tip, quote, meet the guides) shows with photo and name: they must have agreed.
  if exists (
    select 1
    from jsonb_array_elements(p_sections) as s (section)
    cross join lateral jsonb_array_elements_text(coalesce(s.section -> 'guide_ids', '[]')) as g (guide_id)
    where not exists (select 1 from public.trekking_guides t where t.id = g.guide_id::uuid and t.photo_consent)
  ) then
    raise exception 'section_guide_not_agreed' using errcode = '22023';
  end if;

  -- Featured and "Start here" numbers are one per website: take them from the guide that has them.
  if is_date_mode and chosen_date is null then
    raise exception 'date_needed' using errcode = '22023';
  end if;

  if (p_article ->> 'is_featured')::boolean then
    update public.articles a set is_featured = false
    where a.is_featured and coalesce(a.site_region_id, '00000000-0000-0000-0000-000000000000'::uuid) = site_key
      and a.id is distinct from p_article_id;
  end if;
  if start_number is not null then
    update public.articles a set start_here_position = null
    where a.start_here_position = start_number and coalesce(a.site_region_id, '00000000-0000-0000-0000-000000000000'::uuid) = site_key
      and a.id is distinct from p_article_id;
  end if;

  if p_article_id is null then
    insert into public.articles (
      site_region_id, also_on_main_site, slug, topic, status, published_on, updated_on, is_featured, start_here_position,
      author_id, checker_guide_id, main_trek_id, photo_trek_id, cover_photo_id, month_ratings, updated_by
    )
    values (
      site, (p_article ->> 'also_on_main_site')::boolean and site is not null, p_article ->> 'slug',
      (p_article ->> 'topic')::public.article_topic, new_status,
      -- "On a date I choose": that date; "As soon as I click Publish": today once it goes live.
      case when is_date_mode then chosen_date when new_status = 'published' then today end, null,
      (p_article ->> 'is_featured')::boolean, start_number, author, checker,
      nullif(p_article ->> 'main_trek_id', '')::uuid, nullif(p_article ->> 'photo_trek_id', '')::uuid,
      nullif(p_article ->> 'cover_photo_id', '')::uuid,
      case when jsonb_array_length(coalesce(p_article -> 'month_ratings', '[]')) = 12
        then array(select jsonb_array_elements_text(p_article -> 'month_ratings')::public.month_rating) end,
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.articles a
    set site_region_id = site,
        also_on_main_site = (p_article ->> 'also_on_main_site')::boolean and site is not null,
        slug = p_article ->> 'slug',
        topic = (p_article ->> 'topic')::public.article_topic,
        status = new_status,
        -- "On a date I choose": that date. "As soon as I click Publish": a date already passed is kept (the day it
        -- first went live); otherwise today once it goes live, or none while it isn't.
        published_on = case
          when is_date_mode then chosen_date
          when a.published_on <= today then a.published_on
          when new_status = 'published' then today
        end,
        updated_on = case when (p_article ->> 'is_big_update')::boolean and new_status = 'published' then today else a.updated_on end,
        is_featured = (p_article ->> 'is_featured')::boolean,
        start_here_position = start_number,
        author_id = author,
        checker_guide_id = checker,
        main_trek_id = nullif(p_article ->> 'main_trek_id', '')::uuid,
        photo_trek_id = nullif(p_article ->> 'photo_trek_id', '')::uuid,
        cover_photo_id = nullif(p_article ->> 'cover_photo_id', '')::uuid,
        month_ratings = case when jsonb_array_length(coalesce(p_article -> 'month_ratings', '[]')) = 12
          then array(select jsonb_array_elements_text(p_article -> 'month_ratings')::public.month_rating) end,
        updated_at = now(),
        updated_by = auth.uid()
    where a.id = p_article_id
    returning a.id into saved_id;

    if saved_id is null then
      raise exception 'Travel guide not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.article_translations as t (
    article_id, locale, title, intro, card_text, cover_alt, highlight_tag, updated_line, facts,
    seo_keyword, seo_title, seo_description, share_photo_id, canonical_path, hide_from_google, help_heading, help_text, help_button, help_message, month_notes
  )
  values (
    saved_id, p_locale, p_text ->> 'title', p_text ->> 'intro', p_text ->> 'card_text', p_text ->> 'cover_alt',
    p_text ->> 'highlight_tag', p_text ->> 'updated_line', p_text -> 'facts', p_text ->> 'seo_keyword',
    p_text ->> 'seo_title', p_text ->> 'seo_description', nullif(p_text ->> 'share_photo_id', '')::uuid, coalesce(p_text ->> 'canonical_path', ''), coalesce((p_text ->> 'hide_from_google')::boolean, false),
    coalesce(p_text ->> 'help_heading', ''), coalesce(p_text ->> 'help_text', ''), coalesce(p_text ->> 'help_button', ''), coalesce(p_text ->> 'help_message', ''),
    coalesce(p_text -> 'month_notes', '[]')
  )
  on conflict (article_id, locale) do update
  set title = excluded.title,
      intro = excluded.intro,
      card_text = excluded.card_text,
      cover_alt = excluded.cover_alt,
      highlight_tag = excluded.highlight_tag,
      updated_line = excluded.updated_line,
      facts = excluded.facts,
      seo_keyword = excluded.seo_keyword,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      share_photo_id = excluded.share_photo_id,
      canonical_path = excluded.canonical_path,
      hide_from_google = excluded.hide_from_google,
      help_heading = excluded.help_heading,
      help_text = excluded.help_text,
      help_button = excluded.help_button,
      help_message = excluded.help_message,
      month_notes = excluded.month_notes,
      updated_at = now();

  -- Only the regions unticked are removed and only new ones added: a kept region keeps its pin (save_region).
  delete from public.article_regions
  where article_id = saved_id and region_id::text not in (select jsonb_array_elements_text(p_region_ids));
  insert into public.article_regions (article_id, region_id)
  select distinct saved_id, r.region_id::uuid from jsonb_array_elements_text(p_region_ids) as r (region_id)
  on conflict (article_id, region_id) do nothing;

  delete from public.article_related where article_id = saved_id;
  insert into public.article_related (article_id, related_article_id, position)
  select saved_id, r.related_id::uuid, (r.n - 1)::smallint
  from jsonb_array_elements_text(p_related_ids) with ordinality as r (related_id, n);

  -- Sections: keep the ids the editor sends (so other languages stay attached), add new ones, drop removed ones.
  drop table if exists pg_temp.incoming_sections;
  create temporary table incoming_sections on commit drop as
  select coalesce(nullif(s.section ->> 'id', '')::uuid, gen_random_uuid()) as id, (s.n - 1)::smallint as position, s.section
  from jsonb_array_elements(p_sections) with ordinality as s (section, n);

  delete from public.article_sections where article_id = saved_id and id not in (select id from incoming_sections);

  insert into public.article_sections as k (id, article_id, position, type, trek_id, settings)
  select i.id, saved_id, i.position, (i.section ->> 'type')::public.article_section_type, nullif(i.section ->> 'trek_id', '')::uuid,
         coalesce(i.section -> 'settings', '{}')
  from incoming_sections i
  on conflict (id) do update
  set position = excluded.position, type = excluded.type, trek_id = excluded.trek_id, settings = excluded.settings
  -- An id from another guide is never taken over.
  where k.article_id = saved_id;

  insert into public.article_section_translations as t (section_id, locale, content)
  select i.id, p_locale, i.section -> 'content'
  from incoming_sections i
  join public.article_sections k on k.id = i.id and k.article_id = saved_id
  on conflict (section_id, locale) do update set content = excluded.content;

  -- The guides and photos a section shows, in order (they can't be removed while a section shows them).
  delete from public.article_section_guides g using public.article_sections k where g.section_id = k.id and k.article_id = saved_id;
  insert into public.article_section_guides (section_id, guide_id, position)
  select i.id, g.guide_id::uuid, (g.n - 1)::smallint
  from incoming_sections i
  join public.article_sections k on k.id = i.id and k.article_id = saved_id
  cross join lateral jsonb_array_elements_text(coalesce(i.section -> 'guide_ids', '[]')) with ordinality as g (guide_id, n);

  delete from public.article_section_photos p using public.article_sections k where p.section_id = k.id and k.article_id = saved_id;
  insert into public.article_section_photos (section_id, photo_id, position)
  select i.id, p.photo_id::uuid, (p.n - 1)::smallint
  from incoming_sections i
  join public.article_sections k on k.id = i.id and k.article_id = saved_id
  cross join lateral jsonb_array_elements_text(coalesce(i.section -> 'photo_ids', '[]')) with ordinality as p (photo_id, n);

  return saved_id;
end;
$function$;

-- web_travel_guide_pages ends with the help box (rebuilt from the live definition; same columns before them).
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
           FROM web_treks w
          WHERE w.id = a.main_trek_id AND w.locale = g.locale) AS main_trek_slug,
    ( SELECT w.slug
           FROM web_treks w
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
                   FROM web_treks w
                  WHERE w.id = s.trek_id AND w.locale = g.locale), 'trek_slugs', COALESCE(( SELECT jsonb_agg(w.slug ORDER BY picked."position") AS jsonb_agg
                   FROM jsonb_array_elements_text(
                        CASE
                            WHEN jsonb_typeof(s.settings -> 'trekIds'::text) = 'array'::text THEN s.settings -> 'trekIds'::text
                            ELSE '[]'::jsonb
                        END) WITH ORDINALITY picked(trek_id, "position")
                     JOIN web_treks w ON w.id::text = picked.trek_id AND w.locale = g.locale), '[]'::jsonb), 'guides', COALESCE(( SELECT jsonb_agg(jsonb_build_object('name', sg.name, 'role', COALESCE(sgt.role, ''::text), 'quote', COALESCE(sgt.quote, ''::text), 'photo',
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
                               FROM web_treks w
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
                               FROM web_treks w
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
    t.help_button,
    t.help_message
   FROM web_travel_guides g
     JOIN articles a ON a.id = g.id
     JOIN article_translations t ON t.article_id = a.id AND t.locale = g.locale
     LEFT JOIN photos p ON p.id = a.cover_photo_id
     LEFT JOIN photos sh ON sh.id = t.share_photo_id;
