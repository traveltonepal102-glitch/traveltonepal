-- The side bar's question box ("Not sure when to go?" above "Ask a local expert") is the same on every travel
-- guide, so the website keeps its words and the editor no longer asks for them.
-- save_article is the one from 20261024280000_article_sections.sql without question_title and question_text.

-- Adds (p_article_id null) or updates a guide, its text in p_locale, its regions, related guides and its
-- article body (p_sections, in order), in one transaction. Featured and a "Start here" number move to this guide from any other guide on the same website.
-- Rules it raises (errcode 22023, the message names the rule):
--   author_language: the author doesn't write in p_locale;
--   checker_not_allowed: the checker can't check travel guides, or hasn't agreed to be shown;
--   guest_needs_checker: a guest writer's guide published without a checker;
--   date_needed: "On a date I choose" without a date.
create or replace function public.save_article(
  p_article_id uuid, p_locale text, p_article jsonb, p_text jsonb, p_region_ids jsonb, p_related_ids jsonb, p_sections jsonb
)
returns uuid
language plpgsql
set search_path = ''
as $$
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
      author_id, checker_guide_id, main_trek_id, photo_trek_id, cover_photo_id, updated_by
    )
    values (
      site, (p_article ->> 'also_on_main_site')::boolean and site is not null, p_article ->> 'slug',
      (p_article ->> 'topic')::public.article_topic, new_status,
      -- "On a date I choose": that date; "As soon as I click Publish": today once it goes live.
      case when is_date_mode then chosen_date when new_status = 'published' then today end, null,
      (p_article ->> 'is_featured')::boolean, start_number, author, checker,
      nullif(p_article ->> 'main_trek_id', '')::uuid, nullif(p_article ->> 'photo_trek_id', '')::uuid,
      nullif(p_article ->> 'cover_photo_id', '')::uuid, auth.uid()
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
    seo_keyword, seo_title, seo_description
  )
  values (
    saved_id, p_locale, p_text ->> 'title', p_text ->> 'intro', p_text ->> 'card_text', p_text ->> 'cover_alt',
    p_text ->> 'highlight_tag', p_text ->> 'updated_line', p_text -> 'facts', p_text ->> 'seo_keyword',
    p_text ->> 'seo_title', p_text ->> 'seo_description'
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
      updated_at = now();

  delete from public.article_regions where article_id = saved_id;
  insert into public.article_regions (article_id, region_id)
  select distinct saved_id, r.region_id::uuid from jsonb_array_elements_text(p_region_ids) as r (region_id);

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

  insert into public.article_sections as k (id, article_id, position, type, trek_id)
  select i.id, saved_id, i.position, (i.section ->> 'type')::public.article_section_type, nullif(i.section ->> 'trek_id', '')::uuid
  from incoming_sections i
  on conflict (id) do update
  set position = excluded.position, type = excluded.type, trek_id = excluded.trek_id
  -- An id from another guide is never taken over.
  where k.article_id = saved_id;

  insert into public.article_section_translations as t (section_id, locale, content)
  select i.id, p_locale, i.section -> 'content'
  from incoming_sections i
  join public.article_sections k on k.id = i.id and k.article_id = saved_id
  on conflict (section_id, locale) do update set content = excluded.content;

  return saved_id;
end;
$$;

alter table public.article_translations drop column question_title, drop column question_text;
