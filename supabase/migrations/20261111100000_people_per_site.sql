-- Trekking guides and authors per website (decided 2026-11-11): each website has its own guides and authors, like its
-- treks, so Travel To Nepal shows Sandip as its founder and team, and Manaslu Trek Dipesh and its own team. Structured
-- data is per website too, so a region website gets its own (admin › Structured data, in every website's menu).
--
--   1. trekking_guides.site_id and authors.site_id. A trek's guides, a travel guide's author, checker and guide sections,
--      the About page's founder and a guide-author's guide must belong to the same website (foreign keys on
--      (id, site_id), and a trigger for the two lists without a site column). A person working for two websites is
--      added on each.
--   2. Existing people: a person used only by one region website moves to it; one used by Travel To Nepal and a region
--      website (or by none) stays on Travel To Nepal, and each region website using them gets its own copy (with
--      "Show on the About page" off, so a copy never joins that website's team by itself).
--   3. The website views filter people by the website asking (the About team, a region's guides), and page_schemas
--      belong to the website of their page; save_page_schemas takes the website.
--   4. copy_trek leaves the trek's guides behind (they are Travel To Nepal's).

-- 1. Columns ---------------------------------------------------------------------------------------------------------

alter table public.trekking_guides add column site_id text not null default 'ttn' references public.sites (id) on delete restrict;
alter table public.authors add column site_id text not null default 'ttn' references public.sites (id) on delete restrict;
-- Lets other tables require "a guide (an author) of this website" with a foreign key on (id, site_id).
alter table public.trekking_guides add constraint trekking_guides_id_site_key unique (id, site_id);
alter table public.authors add constraint authors_id_site_key unique (id, site_id);
create index trekking_guides_site_id_idx on public.trekking_guides (site_id);
create index authors_site_id_idx on public.authors (site_id);

-- 2. Existing people -------------------------------------------------------------------------------------------------

-- The websites each author is used on (a byline, an About page's founder); an unused author stays on Travel To Nepal.
create temporary table people_author_sites on commit drop as
with uses as (
  select a.author_id as id, a.site_id from public.articles a where a.author_id is not null
  union
  select s.founder_author_id, s.site_id from public.site_pages s where s.founder_author_id is not null
)
select distinct au.id as author_id, coalesce(u.site_id, 'ttn') as site_id
from public.authors au
left join uses u on u.id = au.id;

-- The websites each guide is used on (a trek, a travel guide's checker or guide section, an author's guide).
create temporary table people_guide_sites on commit drop as
with uses as (
  select tg.guide_id as id, t.site_id from public.trek_guides tg join public.treks t on t.id = tg.trek_id
  union
  select a.checker_guide_id, a.site_id from public.articles a where a.checker_guide_id is not null
  union
  select sg.guide_id, a.site_id
  from public.article_section_guides sg
  join public.article_sections x on x.id = sg.section_id
  join public.articles a on a.id = x.article_id
  union
  select au.guide_id, s.site_id from public.authors au join people_author_sites s on s.author_id = au.id where au.guide_id is not null
)
select distinct g.id as guide_id, coalesce(u.site_id, 'ttn') as site_id
from public.trekking_guides g
left join uses u on u.id = g.id;

-- Each region website's guide: the guide itself when only that website uses it (it moves), otherwise a new copy.
create temporary table people_guide_map on commit drop as
select gs.guide_id as old_id, gs.site_id,
  case when (select count(*) from people_guide_sites o where o.guide_id = gs.guide_id) = 1 then gs.guide_id else gen_random_uuid() end as new_id
from people_guide_sites gs
where gs.site_id <> 'ttn';

create temporary table people_author_map on commit drop as
select s.author_id as old_id, s.site_id,
  case when (select count(*) from people_author_sites o where o.author_id = s.author_id) = 1 then s.author_id else gen_random_uuid() end as new_id
from people_author_sites s
where s.site_id <> 'ttn';

update public.trekking_guides g set site_id = m.site_id from people_guide_map m where m.new_id = m.old_id and g.id = m.old_id;

insert into public.trekking_guides
select (jsonb_populate_record(null::public.trekking_guides, to_jsonb(g) || jsonb_build_object(
  'id', m.new_id, 'site_id', m.site_id, 'show_on_about', false, 'created_at', now(), 'updated_at', now()
))).*
from people_guide_map m
join public.trekking_guides g on g.id = m.old_id
where m.new_id <> m.old_id;

insert into public.trekking_guide_translations
select (jsonb_populate_record(null::public.trekking_guide_translations, to_jsonb(t) || jsonb_build_object('guide_id', m.new_id))).*
from people_guide_map m
join public.trekking_guide_translations t on t.guide_id = m.old_id
where m.new_id <> m.old_id;

insert into public.trekking_guide_regions (guide_id, region_id)
select m.new_id, r.region_id
from people_guide_map m
join public.trekking_guide_regions r on r.guide_id = m.old_id
where m.new_id <> m.old_id;

-- An author's guide on that website: the guide's copy there, or the guide itself when it moved.
update public.authors au
set site_id = m.site_id,
    guide_id = coalesce((select gm.new_id from people_guide_map gm where gm.old_id = au.guide_id and gm.site_id = m.site_id), au.guide_id)
from people_author_map m
where m.new_id = m.old_id and au.id = m.old_id;

insert into public.authors
select (jsonb_populate_record(null::public.authors, to_jsonb(au) || jsonb_build_object(
  'id', m.new_id, 'site_id', m.site_id, 'show_on_about', false, 'created_at', now(), 'updated_at', now(),
  'guide_id', (select gm.new_id from people_guide_map gm where gm.old_id = au.guide_id and gm.site_id = m.site_id)
))).*
from people_author_map m
join public.authors au on au.id = m.old_id
where m.new_id <> m.old_id;

insert into public.author_translations
select (jsonb_populate_record(null::public.author_translations, to_jsonb(t) || jsonb_build_object('author_id', m.new_id))).*
from people_author_map m
join public.author_translations t on t.author_id = m.old_id
where m.new_id <> m.old_id;

-- Each region website's content now points to its own copies.
update public.trek_guides tg
set guide_id = m.new_id
from public.treks t, people_guide_map m
where t.id = tg.trek_id and m.old_id = tg.guide_id and m.site_id = t.site_id and m.new_id <> m.old_id;

update public.articles a
set checker_guide_id = m.new_id
from people_guide_map m
where m.old_id = a.checker_guide_id and m.site_id = a.site_id and m.new_id <> m.old_id;

update public.articles a
set author_id = m.new_id
from people_author_map m
where m.old_id = a.author_id and m.site_id = a.site_id and m.new_id <> m.old_id;

update public.article_section_guides sg
set guide_id = m.new_id
from public.article_sections x, public.articles a, people_guide_map m
where x.id = sg.section_id and a.id = x.article_id and m.old_id = sg.guide_id and m.site_id = a.site_id and m.new_id <> m.old_id;

update public.site_pages s
set founder_author_id = m.new_id
from people_author_map m
where m.old_id = s.founder_author_id and m.site_id = s.site_id and m.new_id <> m.old_id;

-- 1 (cont.). Same-website rules, now that the data follows them ------------------------------------------------------

alter table public.authors
  add constraint authors_guide_site_fkey foreign key (guide_id, site_id) references public.trekking_guides (id, site_id) on delete restrict;
alter table public.articles
  add constraint articles_author_site_fkey foreign key (author_id, site_id) references public.authors (id, site_id) on delete restrict,
  add constraint articles_checker_site_fkey foreign key (checker_guide_id, site_id) references public.trekking_guides (id, site_id) on delete restrict;
alter table public.site_pages
  add constraint site_pages_founder_site_fkey foreign key (founder_author_id, site_id) references public.authors (id, site_id) on delete restrict;

-- A trek's guides and a travel guide's guide sections: guides of the trek's (the travel guide's) website. 23503 like a
-- foreign key, so the saves report it as a link that no longer exists.
create function public.check_guide_website()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner text;
begin
  if tg_table_name = 'trek_guides' then
    select t.site_id into owner from public.treks t where t.id = new.trek_id;
  else
    select a.site_id into owner
    from public.article_sections x
    join public.articles a on a.id = x.article_id
    where x.id = new.section_id;
  end if;

  if owner is not null and not exists (select 1 from public.trekking_guides g where g.id = new.guide_id and g.site_id = owner) then
    raise exception 'This trekking guide belongs to another website' using errcode = '23503';
  end if;
  return new;
end;
$$;

revoke execute on function public.check_guide_website() from public, anon, authenticated;

create trigger trek_guides_same_website before insert or update of trek_id, guide_id on public.trek_guides
  for each row execute function public.check_guide_website();
create trigger article_section_guides_same_website before insert or update of section_id, guide_id on public.article_section_guides
  for each row execute function public.check_guide_website();

-- Saves: a new guide (author) goes to p_guide.site_id (p_author.site_id); a saved one stays on its website.
CREATE OR REPLACE FUNCTION public.save_trekking_guide(p_guide_id uuid, p_locale text, p_guide jsonb, p_text jsonb, p_region_ids jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
begin
  if jsonb_array_length(p_region_ids) > 20 then
    raise exception 'Too many regions' using errcode = '22023';
  end if;

  if p_guide_id is null then
    insert into public.trekking_guides (
      site_id, name, photo_id, photo_consent, home_village, home_district, age, years_guiding, badge, languages,
      licence_number, licence_valid_until, certificates, wfr_valid_until, first_aid_valid_until,
      show_on_about, can_lead_treks, can_fact_check, updated_by
    )
    values (
      coalesce(nullif(p_guide ->> 'site_id', ''), 'ttn'),
      p_guide ->> 'name', nullif(p_guide ->> 'photo_id', '')::uuid, (p_guide ->> 'photo_consent')::boolean,
      p_guide ->> 'home_village', p_guide ->> 'home_district',
      (p_guide ->> 'age')::smallint, (p_guide ->> 'years_guiding')::smallint, (p_guide ->> 'badge')::public.guide_badge,
      array(select jsonb_array_elements_text(p_guide -> 'languages')),
      p_guide ->> 'licence_number', nullif(p_guide ->> 'licence_valid_until', '')::date,
      array(select jsonb_array_elements_text(p_guide -> 'certificates')),
      nullif(p_guide ->> 'wfr_valid_until', '')::date, nullif(p_guide ->> 'first_aid_valid_until', '')::date,
      (p_guide ->> 'show_on_about')::boolean, (p_guide ->> 'can_lead_treks')::boolean, (p_guide ->> 'can_fact_check')::boolean,
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.trekking_guides
    set name = p_guide ->> 'name',
        photo_id = nullif(p_guide ->> 'photo_id', '')::uuid,
        photo_consent = (p_guide ->> 'photo_consent')::boolean,
        home_village = p_guide ->> 'home_village',
        home_district = p_guide ->> 'home_district',
        age = (p_guide ->> 'age')::smallint,
        years_guiding = (p_guide ->> 'years_guiding')::smallint,
        badge = (p_guide ->> 'badge')::public.guide_badge,
        languages = array(select jsonb_array_elements_text(p_guide -> 'languages')),
        licence_number = p_guide ->> 'licence_number',
        licence_valid_until = nullif(p_guide ->> 'licence_valid_until', '')::date,
        certificates = array(select jsonb_array_elements_text(p_guide -> 'certificates')),
        wfr_valid_until = nullif(p_guide ->> 'wfr_valid_until', '')::date,
        first_aid_valid_until = nullif(p_guide ->> 'first_aid_valid_until', '')::date,
        show_on_about = (p_guide ->> 'show_on_about')::boolean,
        can_lead_treks = (p_guide ->> 'can_lead_treks')::boolean,
        can_fact_check = (p_guide ->> 'can_fact_check')::boolean,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_guide_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Guide not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.trekking_guide_translations as t (guide_id, locale, role, bio, quote)
  values (saved_id, p_locale, p_text ->> 'role', p_text ->> 'bio', p_text ->> 'quote')
  on conflict (guide_id, locale) do update
  set role = excluded.role, bio = excluded.bio, quote = excluded.quote;

  delete from public.trekking_guide_regions where guide_id = saved_id;
  insert into public.trekking_guide_regions (guide_id, region_id)
  select distinct saved_id, r.region_id::uuid from jsonb_array_elements_text(p_region_ids) as r (region_id);

  return saved_id;
end;
$function$;

-- A guide of another website fails on authors_guide_site_fkey (23503).
CREATE OR REPLACE FUNCTION public.save_author(p_author_id uuid, p_locale text, p_author jsonb, p_text jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
  guide uuid := nullif(p_author ->> 'guide_id', '')::uuid;
begin
  if guide is not null and not exists (select 1 from public.trekking_guides g where g.id = guide and g.photo_consent) then
    raise exception 'This trekking guide has not agreed to be shown' using errcode = '22023';
  end if;

  if p_author_id is null then
    insert into public.authors (
      site_id, kind, guide_id, name, photo_id, photo_consent, writes_in, topics, profile_links, show_author_box, show_on_about, updated_by
    )
    values (
      coalesce(nullif(p_author ->> 'site_id', ''), 'ttn'),
      (p_author ->> 'kind')::public.author_kind, guide, p_author ->> 'name', nullif(p_author ->> 'photo_id', '')::uuid,
      (p_author ->> 'photo_consent')::boolean,
      array(select jsonb_array_elements_text(p_author -> 'writes_in')),
      array(select jsonb_array_elements_text(p_author -> 'topics')),
      array(select jsonb_array_elements_text(p_author -> 'profile_links')),
      (p_author ->> 'show_author_box')::boolean, (p_author ->> 'show_on_about')::boolean, auth.uid()
    )
    returning id into saved_id;
  else
    update public.authors
    set kind = (p_author ->> 'kind')::public.author_kind,
        guide_id = guide,
        name = p_author ->> 'name',
        photo_id = nullif(p_author ->> 'photo_id', '')::uuid,
        photo_consent = (p_author ->> 'photo_consent')::boolean,
        writes_in = array(select jsonb_array_elements_text(p_author -> 'writes_in')),
        topics = array(select jsonb_array_elements_text(p_author -> 'topics')),
        profile_links = array(select jsonb_array_elements_text(p_author -> 'profile_links')),
        show_author_box = (p_author ->> 'show_author_box')::boolean,
        show_on_about = (p_author ->> 'show_on_about')::boolean,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_author_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Author not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.author_translations as t (author_id, locale, job_title, bio)
  values (saved_id, p_locale, p_text ->> 'job_title', p_text ->> 'bio')
  on conflict (author_id, locale) do update
  set job_title = excluded.job_title, bio = excluded.bio;

  return saved_id;
end;
$function$;

-- 3. The website's views ---------------------------------------------------------------------------------------------

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
     JOIN author_translations t ON t.author_id = a.id AND t.locale = 'en'::text
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
     JOIN trekking_guide_translations gt ON gt.guide_id = g.id AND gt.locale = 'en'::text
     LEFT JOIN photos p ON p.id = g.photo_id
  WHERE g.show_on_about AND g.photo_consent AND g.site_id = web_site_id();

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
    p.file_name AS cover_file_name,
    p.alt_text AS cover_alt_text,
    p.description AS cover_caption
   FROM trekking_guide_regions gr
     JOIN regions r ON r.id = gr.region_id
     JOIN trekking_guides g ON g.id = gr.guide_id
     JOIN trekking_guide_translations gt ON gt.guide_id = g.id
     LEFT JOIN photos p ON p.id = g.photo_id
  WHERE g.can_lead_treks AND g.photo_consent AND g.site_id = web_site_id() AND NOT (EXISTS ( SELECT 1
           FROM region_hidden_guides h
          WHERE h.region_id = gr.region_id AND h.guide_id = g.id));

-- Structured data per website: a block belongs to its page's website (a fixed page's, a trek's, a travel guide's;
-- regions are Travel To Nepal's).
update public.page_schemas s set site_id = t.site_id from public.treks t where t.id = s.trek_id and s.site_id <> t.site_id;
update public.page_schemas s set site_id = a.site_id from public.articles a where a.id = s.article_id and s.site_id <> a.site_id;

alter table public.articles add constraint articles_id_site_key unique (id, site_id);
alter table public.page_schemas
  add constraint page_schemas_trek_site_fkey foreign key (trek_id, site_id) references public.treks (id, site_id) on delete cascade,
  add constraint page_schemas_article_site_fkey foreign key (article_id, site_id) references public.articles (id, site_id) on delete cascade;
create index page_schemas_site_id_idx on public.page_schemas (site_id);

drop function public.save_page_schemas(text, text, jsonb);

-- Replaces one page's blocks on website p_site_id with p_schemas ([{ label, data, is_shown }], in order), as the admin
-- (Row Level Security applies). p_page_kind: 'page' (p_page_key a site page slug), 'trek', 'region' or 'guide' (an id).
-- A trek or travel guide of another website, and a region on a region website, fail like a missing page (23503).
create function public.save_page_schemas(p_page_kind text, p_page_key text, p_schemas jsonb, p_site_id text default 'ttn')
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_site_page text := case when p_page_kind = 'page' then p_page_key end;
  v_trek uuid := case when p_page_kind = 'trek' then p_page_key::uuid end;
  v_region uuid := case when p_page_kind = 'region' then p_page_key::uuid end;
  v_article uuid := case when p_page_kind = 'guide' then p_page_key::uuid end;
begin
  if num_nonnulls(v_site_page, v_trek, v_region, v_article) <> 1 then
    raise exception 'Unknown page %', p_page_kind using errcode = '22023';
  end if;

  if v_region is not null and not exists (select 1 from public.sites s where s.id = p_site_id and s.kind = 'main') then
    raise exception 'Region pages are on the main website' using errcode = '23503';
  end if;

  delete from public.page_schemas s
  where s.site_id = p_site_id
    and s.site_page_slug is not distinct from v_site_page
    and s.trek_id is not distinct from v_trek
    and s.region_id is not distinct from v_region
    and s.article_id is not distinct from v_article;

  -- A page that no longer exists (or is another website's) fails here (foreign key, 23503).
  insert into public.page_schemas (site_id, site_page_slug, trek_id, region_id, article_id, position, label, data, is_shown, updated_by)
  select p_site_id, v_site_page, v_trek, v_region, v_article, item.position::smallint, item.value ->> 'label', item.value -> 'data',
    (item.value ->> 'is_shown')::boolean, auth.uid()
  from jsonb_array_elements(p_schemas) with ordinality as item(value, position);
end;
$$;

revoke execute on function public.save_page_schemas(text, text, jsonb, text) from public, anon;
grant execute on function public.save_page_schemas(text, text, jsonb, text) to authenticated;

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
  WHERE s.is_shown AND s.site_id = web_site_id() AND (EXISTS ( SELECT 1
           FROM web_trek_pages w
          WHERE w.id = t.id))
UNION ALL
 SELECT 'region'::text AS page_kind,
    r.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN regions r ON r.id = s.region_id
  WHERE s.is_shown AND s.site_id = web_site_id() AND (EXISTS ( SELECT 1
           FROM web_region_pages w
          WHERE w.id = r.id))
UNION ALL
 SELECT 'guide'::text AS page_kind,
    a.slug AS page_slug,
    s."position",
    s.data
   FROM page_schemas s
     JOIN articles a ON a.id = s.article_id
  WHERE s.is_shown AND s.site_id = web_site_id() AND (EXISTS ( SELECT 1
           FROM web_travel_guide_pages w
          WHERE w.id = a.id));

-- 4. copy_trek: the trek's guides stay behind ------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.copy_trek(p_trek_id uuid, p_site_id text)
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

  -- Every column as it is (new columns too), but these. Runs as the admin: Row Level Security applies.
  insert into public.treks
  select (jsonb_populate_record(null::public.treks, to_jsonb(source) || jsonb_build_object(
    'id', new_id, 'site_id', p_site_id, 'slug', new_slug, 'status', 'draft', 'published_at', null, 'pdf_map_path', null,
    'created_at', now(), 'updated_at', now(), 'updated_by', auth.uid()
  ))).*;

  insert into public.trek_translations
  select (jsonb_populate_record(null::public.trek_translations, to_jsonb(t) || jsonb_build_object(
    'trek_id', new_id, 'canonical_path', '', 'hide_from_google', false, 'updated_at', now()
  ))).*
  from public.trek_translations t where t.trek_id = p_trek_id;

  -- Days and group prices get new ids; their texts follow them.
  select coalesce(jsonb_object_agg(d.id, gen_random_uuid()), '{}') into day_ids from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_days
  select (jsonb_populate_record(null::public.trek_days, to_jsonb(d) || jsonb_build_object('id', day_ids -> d.id::text, 'trek_id', new_id))).*
  from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_day_translations
  select (jsonb_populate_record(null::public.trek_day_translations, to_jsonb(dt) || jsonb_build_object('day_id', day_ids -> dt.day_id::text))).*
  from public.trek_day_translations dt where day_ids ? dt.day_id::text;

  select coalesce(jsonb_object_agg(p.id, gen_random_uuid()), '{}') into price_ids from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_prices
  select (jsonb_populate_record(null::public.trek_group_prices, to_jsonb(p) || jsonb_build_object('id', price_ids -> p.id::text, 'trek_id', new_id))).*
  from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_price_translations
  select (jsonb_populate_record(null::public.trek_group_price_translations, to_jsonb(pt) || jsonb_build_object('price_id', price_ids -> pt.price_id::text))).*
  from public.trek_group_price_translations pt where price_ids ? pt.price_id::text;

  insert into public.trek_photos (trek_id, photo_id, position) select new_id, photo_id, position from public.trek_photos where trek_id = p_trek_id;
  insert into public.trek_regions (trek_id, region_id, position) select new_id, region_id, position from public.trek_regions where trek_id = p_trek_id;
  -- The trek's guides stay behind: trekking guides belong to one website (20261111100000_people_per_site.sql).

  return new_id;
end;
$function$;
