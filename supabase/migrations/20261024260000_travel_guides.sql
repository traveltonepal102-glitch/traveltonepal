-- Travel guides, step 1 (design: Admin-article-editor): the guide itself, "Top of the page" and the settings
-- column. The article body (its sections) comes in the next step.
-- articles holds what every language shares (website, topic, address, dates, people, treks, photo);
-- article_translations the words, one row per language ('en' now, 'de' later).
-- Admins add and edit; only a Super admin removes a guide.

create type public.article_topic as enum ('best-time', 'planning', 'health', 'gear');
create type public.article_status as enum ('draft', 'published', 'hidden');

create table public.articles (
  id uuid primary key default gen_random_uuid(),
  -- The website it belongs to: a region's site, or null for the main site (traveltonepal.com).
  site_region_id uuid references public.regions (id) on delete restrict,
  -- A region site's guide also listed on the main site (which then points Google to the region site's copy).
  also_on_main_site boolean not null default false,
  -- <site>/guides/<slug>
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 100),
  topic public.article_topic not null,
  status public.article_status not null default 'draft',
  -- The date shown as "published" (a Nepal date); a future one means it goes live that day.
  published_on date check (published_on between date '2020-01-01' and date '2100-12-31'),
  -- "Last big update": changes the date Google sees.
  updated_on date check (updated_on between date '2020-01-01' and date '2100-12-31'),
  -- The big card at the top of the Travel guides page: one per website.
  is_featured boolean not null default false,
  -- "Start here" list for first-time trekkers: 1–6, each once per website.
  start_here_position smallint check (start_here_position between 1 and 6),
  author_id uuid references public.authors (id) on delete restrict,
  -- "Checked by a local guide": needed before a guest writer's guide is published.
  checker_guide_id uuid references public.trekking_guides (id) on delete restrict,
  -- "Plan this trek" box and "Max … m" on the photo.
  main_trek_id uuid references public.treks (id) on delete set null,
  -- The orange trek tag on the photo.
  photo_trek_id uuid references public.treks (id) on delete set null,
  cover_photo_id uuid references public.photos (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  check (not also_on_main_site or site_region_id is not null)
);

-- One featured guide and one guide per "Start here" number on each website (null = the main site).
create unique index articles_featured_per_site_idx
  on public.articles (coalesce(site_region_id, '00000000-0000-0000-0000-000000000000'::uuid)) where is_featured;
create unique index articles_start_here_per_site_idx
  on public.articles (coalesce(site_region_id, '00000000-0000-0000-0000-000000000000'::uuid), start_here_position)
  where start_here_position is not null;
create index articles_author_id_idx on public.articles (author_id);
create index articles_checker_guide_id_idx on public.articles (checker_guide_id);
create index articles_main_trek_id_idx on public.articles (main_trek_id);
create index articles_photo_trek_id_idx on public.articles (photo_trek_id);
create index articles_cover_photo_id_idx on public.articles (cover_photo_id);

create table public.article_translations (
  article_id uuid not null references public.articles (id) on delete cascade,
  locale text not null check (locale in ('en', 'de')),
  title text not null check (char_length(title) between 1 and 120),
  intro text not null default '' check (char_length(intro) <= 300),
  -- One short line on the Travel guides page and in "Related guides" cards.
  card_text text not null default '' check (char_length(card_text) <= 120),
  cover_alt text not null default '' check (char_length(cover_alt) <= 160),
  -- Green tag on the photo, e.g. "Best: Oct–Nov & Mar–May".
  highlight_tag text not null default '' check (char_length(highlight_tag) <= 40),
  -- Next to the read time, e.g. "Updated for the 2026 season".
  updated_line text not null default '' check (char_length(updated_line) <= 60),
  -- Key facts under the photo: [{ "icon", "label", "value" }], up to 4.
  facts jsonb not null default '[]' check (jsonb_typeof(facts) = 'array' and jsonb_array_length(facts) <= 4),
  -- The question box in the side bar, above "Ask a local expert".
  question_title text not null default '' check (char_length(question_title) <= 60),
  question_text text not null default '' check (char_length(question_text) <= 200),
  seo_keyword text not null default '' check (char_length(seo_keyword) <= 80),
  seo_title text not null default '' check (char_length(seo_title) <= 120),
  seo_description text not null default '' check (char_length(seo_description) <= 300),
  updated_at timestamptz not null default now(),
  primary key (article_id, locale)
);

-- The region pages the guide shows on ("Before you go").
create table public.article_regions (
  article_id uuid not null references public.articles (id) on delete cascade,
  region_id uuid not null references public.regions (id) on delete cascade,
  primary key (article_id, region_id)
);

create index article_regions_region_id_idx on public.article_regions (region_id);

-- "Keep reading": up to 3 guides picked by hand (without any, the website picks).
create table public.article_related (
  article_id uuid not null references public.articles (id) on delete cascade,
  related_article_id uuid not null references public.articles (id) on delete cascade,
  position smallint not null check (position between 0 and 2),
  primary key (article_id, related_article_id),
  unique (article_id, position),
  check (article_id <> related_article_id)
);

create index article_related_related_article_id_idx on public.article_related (related_article_id);

alter table public.articles enable row level security;
alter table public.article_translations enable row level security;
alter table public.article_regions enable row level security;
alter table public.article_related enable row level security;

grant select, insert, update, delete on public.articles, public.article_translations, public.article_regions, public.article_related to authenticated;

create policy "Admins read articles" on public.articles for select to authenticated using ((select public.is_admin()));
create policy "Admins add articles" on public.articles for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit articles" on public.articles
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Super admins remove articles" on public.articles for delete to authenticated using ((select public.is_super_admin()));

create policy "Admins read article text" on public.article_translations for select to authenticated using ((select public.is_admin()));
create policy "Admins add article text" on public.article_translations for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit article text" on public.article_translations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove article text" on public.article_translations for delete to authenticated using ((select public.is_admin()));

create policy "Admins read article regions" on public.article_regions for select to authenticated using ((select public.is_admin()));
create policy "Admins add article regions" on public.article_regions for insert to authenticated with check ((select public.is_admin()));
create policy "Admins remove article regions" on public.article_regions for delete to authenticated using ((select public.is_admin()));

create policy "Admins read related articles" on public.article_related for select to authenticated using ((select public.is_admin()));
create policy "Admins add related articles" on public.article_related for insert to authenticated with check ((select public.is_admin()));
create policy "Admins remove related articles" on public.article_related for delete to authenticated using ((select public.is_admin()));

-- Adds (p_article_id null) or updates a guide, its text in p_locale, its regions and related guides, in one
-- transaction. Featured and a "Start here" number move to this guide from any other guide on the same website.
-- Rules it raises (errcode 22023, the message names the rule):
--   author_language: the author doesn't write in p_locale;
--   checker_not_allowed: the checker can't check travel guides, or hasn't agreed to be shown;
--   guest_needs_checker: a guest writer's guide published without a checker.
create function public.save_article(p_article_id uuid, p_locale text, p_article jsonb, p_text jsonb, p_region_ids jsonb, p_related_ids jsonb)
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
  chosen_date date := nullif(p_article ->> 'published_on', '')::date;
  start_number smallint := (p_article ->> 'start_here_position')::smallint;
begin
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

  -- Featured and "Start here" numbers are one per website: take them from the guide that has them.
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
      -- "As soon as I click Publish": today when it goes live; "On a date I choose": that date.
      coalesce(chosen_date, case when new_status = 'published' then today end), null,
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
        -- A chosen date wins; otherwise the first time it goes live sets today and later saves keep it.
        published_on = coalesce(chosen_date, a.published_on, case when new_status = 'published' then today end),
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
    question_title, question_text, seo_keyword, seo_title, seo_description
  )
  values (
    saved_id, p_locale, p_text ->> 'title', p_text ->> 'intro', p_text ->> 'card_text', p_text ->> 'cover_alt',
    p_text ->> 'highlight_tag', p_text ->> 'updated_line', p_text -> 'facts', p_text ->> 'question_title',
    p_text ->> 'question_text', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description'
  )
  on conflict (article_id, locale) do update
  set title = excluded.title,
      intro = excluded.intro,
      card_text = excluded.card_text,
      cover_alt = excluded.cover_alt,
      highlight_tag = excluded.highlight_tag,
      updated_line = excluded.updated_line,
      facts = excluded.facts,
      question_title = excluded.question_title,
      question_text = excluded.question_text,
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

  return saved_id;
end;
$$;

revoke execute on function public.save_article(uuid, text, jsonb, jsonb, jsonb, jsonb) from public, anon;
grant execute on function public.save_article(uuid, text, jsonb, jsonb, jsonb, jsonb) to authenticated;
