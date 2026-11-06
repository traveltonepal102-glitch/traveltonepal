-- Travel guides and reviews belong to one website (decided 2026-11-04), like treks: everything so far stays on
-- Travel To Nepal ('ttn'), and a region website starts with none. A guide's web address and a review's link are unique
-- per website, and "featured" and "Start here" are per website. Photos stay one gallery for all websites.
--
-- articles.site_region_id and also_on_main_site (the old idea of a guide's website) are no longer written and are all
-- empty; they stay until the website stops reading them through web_travel_guides.
-- The website's views keep showing only Travel To Nepal's guides and reviews until the region websites read theirs.

-- Travel guides ----------------------------------------------------------------------------------------------------

alter table public.articles add column site_id text not null default 'ttn' references public.sites (id) on delete restrict;
alter table public.articles drop constraint articles_slug_key;
alter table public.articles add constraint articles_site_slug_key unique (site_id, slug);

drop index public.articles_featured_per_site_idx;
drop index public.articles_start_here_per_site_idx;
create unique index articles_featured_per_site_idx on public.articles (site_id) where is_featured;
create unique index articles_start_here_per_site_idx on public.articles (site_id, start_here_position) where start_here_position is not null;

CREATE OR REPLACE FUNCTION public.save_article(p_article_id uuid, p_locale text, p_article jsonb, p_text jsonb, p_region_ids jsonb, p_related_ids jsonb, p_sections jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
  -- A new guide goes to p_article.site_id; a saved one stays on its website.
  site text := coalesce(nullif(p_article ->> 'site_id', ''), 'ttn');
  author uuid := nullif(p_article ->> 'author_id', '')::uuid;
  checker uuid := nullif(p_article ->> 'checker_guide_id', '')::uuid;
  new_status public.article_status := (p_article ->> 'status')::public.article_status;
  today date := (now() at time zone 'Asia/Kathmandu')::date;
  is_date_mode boolean := p_article ->> 'publish_mode' = 'date';
  chosen_date date := nullif(p_article ->> 'published_on', '')::date;
  start_number smallint := (p_article ->> 'start_here_position')::smallint;
begin
  if p_article_id is not null then
    select a.site_id into site from public.articles a where a.id = p_article_id;
  end if;

  if jsonb_array_length(p_region_ids) > 20 or jsonb_array_length(p_related_ids) > 3 then
    raise exception 'Too many regions or related guides' using errcode = '22023';
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
    where a.is_featured and a.site_id = site
      and a.id is distinct from p_article_id;
  end if;
  if start_number is not null then
    update public.articles a set start_here_position = null
    where a.start_here_position = start_number and a.site_id = site
      and a.id is distinct from p_article_id;
  end if;

  if p_article_id is null then
    insert into public.articles (
      site_id, slug, topic, status, published_on, updated_on, is_featured, start_here_position,
      author_id, checker_guide_id, main_trek_id, photo_trek_id, cover_photo_id, month_ratings, show_sidebar, updated_by
    )
    values (
      site, p_article ->> 'slug',
      (p_article ->> 'topic')::public.article_topic, new_status,
      -- "On a date I choose": that date; "As soon as I click Publish": today once it goes live.
      case when is_date_mode then chosen_date when new_status = 'published' then today end, null,
      (p_article ->> 'is_featured')::boolean, start_number, author, checker,
      nullif(p_article ->> 'main_trek_id', '')::uuid, nullif(p_article ->> 'photo_trek_id', '')::uuid,
      nullif(p_article ->> 'cover_photo_id', '')::uuid,
      case when jsonb_array_length(coalesce(p_article -> 'month_ratings', '[]')) = 12
        then array(select jsonb_array_elements_text(p_article -> 'month_ratings')::public.month_rating) end,
      coalesce((p_article ->> 'show_sidebar')::boolean, true),
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.articles a
    set slug = p_article ->> 'slug',
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
        show_sidebar = coalesce((p_article ->> 'show_sidebar')::boolean, a.show_sidebar),
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
    seo_keyword, seo_title, seo_description, share_photo_id, canonical_path, hide_from_google, help_heading, help_text, help_message, month_notes
  )
  values (
    saved_id, p_locale, p_text ->> 'title', p_text ->> 'intro', p_text ->> 'card_text', p_text ->> 'cover_alt',
    p_text ->> 'highlight_tag', p_text ->> 'updated_line', p_text -> 'facts', p_text ->> 'seo_keyword',
    p_text ->> 'seo_title', p_text ->> 'seo_description', nullif(p_text ->> 'share_photo_id', '')::uuid, coalesce(p_text ->> 'canonical_path', ''), coalesce((p_text ->> 'hide_from_google')::boolean, false),
    coalesce(p_text ->> 'help_heading', ''), coalesce(p_text ->> 'help_text', ''), coalesce(p_text ->> 'help_message', ''),
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

-- Reviews ----------------------------------------------------------------------------------------------------------

alter table public.reviews add column site_id text not null default 'ttn' references public.sites (id) on delete restrict;
alter table public.reviews drop constraint reviews_url_key;
alter table public.reviews add constraint reviews_site_url_key unique (site_id, url);

alter table public.review_ratings add column site_id text not null default 'ttn' references public.sites (id) on delete cascade;
alter table public.review_ratings drop constraint review_ratings_pkey;
alter table public.review_ratings add primary key (site_id, source);

-- save_review: a new review goes to p_review.site_id; a saved one stays on its website.
CREATE OR REPLACE FUNCTION public.save_review(p_review_id uuid, p_review jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
begin
  if p_review_id is null then
    insert into public.reviews (site_id, source, url, reviewer_name, reviewer_country, rating, title, quote, reviewed_on, trek_id, is_shown, photo_id, updated_by)
    values (
      coalesce(nullif(p_review ->> 'site_id', ''), 'ttn'),
      (p_review ->> 'source')::public.review_source,
      p_review ->> 'url',
      p_review ->> 'reviewer_name',
      p_review ->> 'reviewer_country',
      (p_review ->> 'rating')::smallint,
      p_review ->> 'title',
      p_review ->> 'quote',
      (p_review ->> 'reviewed_on')::date,
      nullif(p_review ->> 'trek_id', '')::uuid,
      (p_review ->> 'is_shown')::boolean,
      nullif(p_review ->> 'photo_id', '')::uuid,
      auth.uid()
    )
    returning id into saved_id;
    return saved_id;
  end if;

  update public.reviews
  set source = (p_review ->> 'source')::public.review_source,
      url = p_review ->> 'url',
      reviewer_name = p_review ->> 'reviewer_name',
      reviewer_country = p_review ->> 'reviewer_country',
      rating = (p_review ->> 'rating')::smallint,
      title = p_review ->> 'title',
      quote = p_review ->> 'quote',
      reviewed_on = (p_review ->> 'reviewed_on')::date,
      trek_id = nullif(p_review ->> 'trek_id', '')::uuid,
      is_shown = (p_review ->> 'is_shown')::boolean,
      photo_id = nullif(p_review ->> 'photo_id', '')::uuid,
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_review_id
  returning id into saved_id;

  if saved_id is null then
    raise exception 'Review not found' using errcode = 'P0002';
  end if;
  return saved_id;
end;
$function$;

drop function public.save_review_ratings(jsonb);

create function public.save_review_ratings(p_ratings jsonb, p_site_id text default 'ttn')
returns void
language plpgsql
set search_path = ''
as $$
begin
  delete from public.review_ratings
  where site_id = p_site_id
    and source not in (select (item ->> 'source')::public.review_source from jsonb_array_elements(p_ratings) item);

  insert into public.review_ratings (site_id, source, rating, review_count, updated_by)
  select p_site_id, (item ->> 'source')::public.review_source, (item ->> 'rating')::numeric, (item ->> 'review_count')::integer, auth.uid()
  from jsonb_array_elements(p_ratings) item
  on conflict (site_id, source) do update
  set rating = excluded.rating,
      review_count = excluded.review_count,
      updated_at = now(),
      updated_by = excluded.updated_by;
end;
$$;

revoke execute on function public.save_review_ratings(jsonb, text) from public, anon;
grant execute on function public.save_review_ratings(jsonb, text) to authenticated;

-- The website's views: Travel To Nepal's guides and reviews only (as before) -------------------------------------------

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
  WHERE a.status = 'published'::article_status AND a.site_id = 'ttn'::text AND a.published_on <= (now() AT TIME ZONE 'Asia/Kathmandu'::text)::date;

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
     LEFT JOIN treks tr ON tr.id = r.trek_id AND tr.status = 'published'::trek_status AND tr.site_id = 'ttn'::text
     LEFT JOIN trek_translations t ON t.trek_id = tr.id AND t.locale = 'en'::text
     LEFT JOIN photos p ON p.id = r.photo_id
  WHERE r.is_shown AND r.site_id = 'ttn'::text;

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
     CROSS JOIN site_settings s
  WHERE rr.site_id = 'ttn'::text;
