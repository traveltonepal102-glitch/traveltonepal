-- Annapurna Trekking (decided 2026-11-12): the second region website, "annapurna", for the Annapurna region, built
-- like Manaslu Trek (apps/annapurna, design canvas "Annapurna Trekking Home Page"). It starts with its own copies of
-- everything Travel To Nepal has about Annapurna, so the website shows real content from the first build:
--
--   1. The website row; its settings, fixed pages and adventure section come with it (the sites triggers).
--   2. Its own copies of the photos those copies show (photo_file_copies lists the files to copy, done by
--      apps/admin/scripts/copy-photo-files.mjs, as when photos became per website).
--   3. The people: the guides who lead the Annapurna treks or check the blogs, the blogs' authors and the founder.
--   4. The six Annapurna treks (published, with their photos, days, prices, guides and similar treks).
--   5. The ten Annapurna blogs (with their sections, photos, guides and related blogs), the four reviews, the five
--      adventure cards, the company's settings and the About, Contact and legal pages.
--   6. Home: the Annapurna Base Camp Trek, with the top of the page from the design.
--
-- The copies are new rows with new ids and no link back: afterwards the two websites are edited apart.

-- 1. The website -------------------------------------------------------------------------------------------------------

insert into public.sites (id, kind, region_id, name, url, is_live, position)
values (
  'annapurna', 'region', (select r.id from public.regions r where r.slug = 'annapurna-region'),
  'Annapurna Trekking', null, false, (select coalesce(max(s.position), 0) + 1 from public.sites s)
);

-- What is copied ------------------------------------------------------------------------------------------------------

create temporary table src_treks on commit drop as
select t.id as old_id, gen_random_uuid() as new_id
from public.treks t
where t.site_id = 'ttn' and t.region_id = (select r.id from public.regions r where r.slug = 'annapurna-region');

-- A blog about an Annapurna trek: its trek, the trek its photos come from, or a trek section.
create temporary table src_articles on commit drop as
select a.id as old_id, gen_random_uuid() as new_id
from public.articles a
where a.site_id = 'ttn'
  and (a.main_trek_id in (select old_id from src_treks)
    or a.photo_trek_id in (select old_id from src_treks)
    or exists (select 1 from public.article_sections s where s.article_id = a.id and s.trek_id in (select old_id from src_treks)));

-- The blogs' authors and the founder.
create temporary table src_authors on commit drop as
select au.id as old_id, gen_random_uuid() as new_id
from public.authors au
where au.site_id = 'ttn'
  and (au.id in (select a.author_id from public.articles a where a.id in (select old_id from src_articles) and a.author_id is not null)
    or au.id = (select p.founder_author_id from public.site_pages p where p.site_id = 'ttn' and p.slug = 'about'));

-- The treks' guides, the blogs' checkers and guide sections, and the authors' guides.
create temporary table src_guides on commit drop as
select g.id as old_id, gen_random_uuid() as new_id
from public.trekking_guides g
where g.site_id = 'ttn'
  and (g.id in (select tg.guide_id from public.trek_guides tg where tg.trek_id in (select old_id from src_treks))
    or g.id in (select a.checker_guide_id from public.articles a where a.id in (select old_id from src_articles) and a.checker_guide_id is not null)
    or g.id in (select sg.guide_id from public.article_section_guides sg join public.article_sections s on s.id = sg.section_id where s.article_id in (select old_id from src_articles))
    or g.id in (select au.guide_id from public.authors au where au.id in (select old_id from src_authors) and au.guide_id is not null));

-- 2. Photos -------------------------------------------------------------------------------------------------------------

-- Every photo the copies will show: a new copy for the Annapurna website (Travel To Nepal keeps the original).
create temporary table photo_map on commit drop as
select distinct p.id as old_id, gen_random_uuid() as new_id
from (
  select t.cover_photo_id as id from public.treks t where t.id in (select old_id from src_treks)
  union select tt.share_photo_id from public.trek_translations tt where tt.trek_id in (select old_id from src_treks)
  union select public.photo_ids_in(to_jsonb(tt)) from public.trek_translations tt where tt.trek_id in (select old_id from src_treks)
  union select tp.photo_id from public.trek_photos tp where tp.trek_id in (select old_id from src_treks)
  union select d.photo_id from public.trek_days d where d.trek_id in (select old_id from src_treks)
  union select public.photo_ids_in(to_jsonb(dt)) from public.trek_day_translations dt join public.trek_days d on d.id = dt.day_id where d.trek_id in (select old_id from src_treks)
  union select a.cover_photo_id from public.articles a where a.id in (select old_id from src_articles)
  union select at.share_photo_id from public.article_translations at where at.article_id in (select old_id from src_articles)
  union select public.photo_ids_in(to_jsonb(at)) from public.article_translations at where at.article_id in (select old_id from src_articles)
  union select public.photo_ids_in(to_jsonb(s)) from public.article_sections s where s.article_id in (select old_id from src_articles)
  union select public.photo_ids_in(to_jsonb(st)) from public.article_section_translations st join public.article_sections s on s.id = st.section_id where s.article_id in (select old_id from src_articles)
  union select sp.photo_id from public.article_section_photos sp join public.article_sections s on s.id = sp.section_id where s.article_id in (select old_id from src_articles)
  union select g.photo_id from public.trekking_guides g where g.id in (select old_id from src_guides)
  union select au.photo_id from public.authors au where au.id in (select old_id from src_authors)
  union select r.photo_id from public.reviews r where r.site_id = 'ttn'
  union select ad.photo_id from public.adventures ad where ad.site_id = 'ttn'
  union select x.photo_id from public.site_settings s cross join lateral (values (s.share_photo_id), (s.certificate_photo_id), (s.pan_certificate_photo_id)) as x (photo_id) where s.site_id = 'ttn'
  union select p.photo_id from public.site_pages p where p.site_id = 'ttn' and p.slug <> 'home'
  union select p.share_photo_id from public.site_pages p where p.site_id = 'ttn' and p.slug <> 'home'
  union select public.photo_ids_in(p.content) from public.site_pages p where p.site_id = 'ttn' and p.slug <> 'home'
  union select pp.photo_id from public.site_page_photos pp where pp.site_id = 'ttn'
) as refs
join public.photos p on p.id = refs.id;

-- A row's JSON with every photo id swapped for the copy's: the photo columns and the photos inside its texts at once.
create function pg_temp.map_photos(p_value jsonb)
returns jsonb
language plpgsql
as $$
declare
  m record;
  value text := p_value::text;
begin
  for m in select old_id, new_id from photo_map loop
    value := replace(value, m.old_id::text, m.new_id::text);
  end loop;
  return value::jsonb;
end;
$$;

create function pg_temp.map_photo(p_id uuid)
returns uuid
language sql
as $$ select coalesce((select m.new_id from photo_map m where m.old_id = p_id), p_id) $$;

insert into public.photos
select (jsonb_populate_record(null::public.photos, to_jsonb(p) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'annapurna', 'master_key', 'masters/' || m.new_id || '.jpg', 'created_at', now(), 'updated_at', now()
))).*
from photo_map m
join public.photos p on p.id = m.old_id;

insert into public.photo_file_copies (photo_id, source_id) select m.new_id, m.old_id from photo_map m;

-- 3. People -------------------------------------------------------------------------------------------------------------

insert into public.trekking_guides
select (jsonb_populate_record(null::public.trekking_guides, pg_temp.map_photos(to_jsonb(g)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'annapurna', 'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid
))).*
from src_guides m
join public.trekking_guides g on g.id = m.old_id;

insert into public.trekking_guide_translations
select (jsonb_populate_record(null::public.trekking_guide_translations, pg_temp.map_photos(to_jsonb(t)) || jsonb_build_object('guide_id', m.new_id))).*
from src_guides m
join public.trekking_guide_translations t on t.guide_id = m.old_id;

insert into public.trekking_guide_regions (guide_id, region_id)
select m.new_id, r.region_id from src_guides m join public.trekking_guide_regions r on r.guide_id = m.old_id;

insert into public.authors
select (jsonb_populate_record(null::public.authors, pg_temp.map_photos(to_jsonb(au)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'annapurna', 'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid,
  'guide_id', (select gm.new_id from src_guides gm where gm.old_id = au.guide_id)
))).*
from src_authors m
join public.authors au on au.id = m.old_id;

insert into public.author_translations
select (jsonb_populate_record(null::public.author_translations, pg_temp.map_photos(to_jsonb(t)) || jsonb_build_object('author_id', m.new_id))).*
from src_authors m
join public.author_translations t on t.author_id = m.old_id;

-- 4. Treks --------------------------------------------------------------------------------------------------------------

insert into public.treks
select (jsonb_populate_record(null::public.treks, pg_temp.map_photos(to_jsonb(t)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'annapurna', 'pdf_map_path', null::text, 'featured_article_id', null::uuid,
  'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid
))).*
from src_treks m
join public.treks t on t.id = m.old_id;

insert into public.trek_translations
select (jsonb_populate_record(null::public.trek_translations, pg_temp.map_photos(to_jsonb(tt)) || jsonb_build_object(
  'trek_id', m.new_id, 'canonical_path', '', 'hide_from_google', false, 'updated_at', now()
))).*
from src_treks m
join public.trek_translations tt on tt.trek_id = m.old_id;

create temporary table day_map on commit drop as
select d.id as old_id, gen_random_uuid() as new_id, m.new_id as trek_id
from public.trek_days d join src_treks m on m.old_id = d.trek_id;

insert into public.trek_days
select (jsonb_populate_record(null::public.trek_days, pg_temp.map_photos(to_jsonb(d)) || jsonb_build_object('id', m.new_id, 'trek_id', m.trek_id))).*
from day_map m
join public.trek_days d on d.id = m.old_id;

insert into public.trek_day_translations
select (jsonb_populate_record(null::public.trek_day_translations, pg_temp.map_photos(to_jsonb(dt)) || jsonb_build_object('day_id', m.new_id))).*
from day_map m
join public.trek_day_translations dt on dt.day_id = m.old_id;

create temporary table price_map on commit drop as
select p.id as old_id, gen_random_uuid() as new_id, m.new_id as trek_id
from public.trek_group_prices p join src_treks m on m.old_id = p.trek_id;

insert into public.trek_group_prices
select (jsonb_populate_record(null::public.trek_group_prices, to_jsonb(p) || jsonb_build_object('id', m.new_id, 'trek_id', m.trek_id))).*
from price_map m
join public.trek_group_prices p on p.id = m.old_id;

insert into public.trek_group_price_translations
select (jsonb_populate_record(null::public.trek_group_price_translations, to_jsonb(pt) || jsonb_build_object('price_id', m.new_id))).*
from price_map m
join public.trek_group_price_translations pt on pt.price_id = m.old_id;

insert into public.trek_photos (trek_id, photo_id, position)
select m.new_id, pg_temp.map_photo(tp.photo_id), tp.position from src_treks m join public.trek_photos tp on tp.trek_id = m.old_id;

insert into public.trek_regions (trek_id, region_id, position)
select m.new_id, tr.region_id, tr.position from src_treks m join public.trek_regions tr on tr.trek_id = m.old_id;

insert into public.trek_guides (trek_id, guide_id, position)
select m.new_id, gm.new_id, tg.position
from src_treks m join public.trek_guides tg on tg.trek_id = m.old_id join src_guides gm on gm.old_id = tg.guide_id;

-- Similar treks, where both are Annapurna treks.
insert into public.trek_similar (trek_id, similar_trek_id, position)
select m.new_id, sm.new_id, ts.position
from src_treks m join public.trek_similar ts on ts.trek_id = m.old_id join src_treks sm on sm.old_id = ts.similar_trek_id;

-- 5. Blogs, reviews, adventures, settings and pages ------------------------------------------------------------------

insert into public.articles
select (jsonb_populate_record(null::public.articles, pg_temp.map_photos(to_jsonb(a)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'annapurna', 'site_region_id', null::uuid, 'also_on_main_site', false,
  'author_id', (select am.new_id from src_authors am where am.old_id = a.author_id),
  'checker_guide_id', (select gm.new_id from src_guides gm where gm.old_id = a.checker_guide_id),
  'main_trek_id', (select tm.new_id from src_treks tm where tm.old_id = a.main_trek_id),
  'photo_trek_id', (select tm.new_id from src_treks tm where tm.old_id = a.photo_trek_id),
  -- The blog shown first on the website: the one about its main trek.
  'is_featured', a.slug = 'annapurna-base-camp-or-poon-hill',
  'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid
))).*
from src_articles m
join public.articles a on a.id = m.old_id;

insert into public.article_translations
select (jsonb_populate_record(null::public.article_translations, pg_temp.map_photos(to_jsonb(at)) || jsonb_build_object(
  'article_id', m.new_id, 'canonical_path', '', 'hide_from_google', false, 'updated_at', now()
))).*
from src_articles m
join public.article_translations at on at.article_id = m.old_id;

create temporary table section_map on commit drop as
select s.id as old_id, gen_random_uuid() as new_id, m.new_id as article_id
from public.article_sections s join src_articles m on m.old_id = s.article_id;

insert into public.article_sections
select (jsonb_populate_record(null::public.article_sections, pg_temp.map_photos(to_jsonb(s)) || jsonb_build_object(
  'id', m.new_id, 'article_id', m.article_id,
  'trek_id', (select tm.new_id from src_treks tm where tm.old_id = s.trek_id)
))).*
from section_map m
join public.article_sections s on s.id = m.old_id;

insert into public.article_section_translations
select (jsonb_populate_record(null::public.article_section_translations, pg_temp.map_photos(to_jsonb(st)) || jsonb_build_object('section_id', m.new_id))).*
from section_map m
join public.article_section_translations st on st.section_id = m.old_id;

insert into public.article_section_photos (section_id, photo_id, position)
select m.new_id, pg_temp.map_photo(sp.photo_id), sp.position from section_map m join public.article_section_photos sp on sp.section_id = m.old_id;

insert into public.article_section_guides (section_id, guide_id, position)
select m.new_id, gm.new_id, sg.position
from section_map m join public.article_section_guides sg on sg.section_id = m.old_id join src_guides gm on gm.old_id = sg.guide_id;

-- Not copied: the pins on the region maps (article_regions), which are Travel To Nepal's region pages.

insert into public.article_related (article_id, related_article_id, position)
select m.new_id, rm.new_id, ar.position
from src_articles m join public.article_related ar on ar.article_id = m.old_id join src_articles rm on rm.old_id = ar.related_article_id;

-- Each trek's "Blog post shown first".
update public.treks t
set featured_article_id = a.id
from (values
  ('annapurna-base-camp', 'annapurna-base-camp-or-poon-hill'),
  ('annapurna-circuit-trek', 'annapurna-circuit-trek-cost'),
  ('mardi-himal', 'mardi-himal-packing-list'),
  ('nar-phu-valley-trek', 'nar-phu-valley-trek-planning-guide'),
  ('poon-hill', 'first-himalayan-trek-which-region')
) as pick (trek_slug, article_slug)
join public.articles a on a.site_id = 'annapurna' and a.slug = pick.article_slug
where t.site_id = 'annapurna' and t.slug = pick.trek_slug;

-- The company's real reviews, on this website too (one about a trek it doesn't have is about the company).
insert into public.reviews
select (jsonb_populate_record(null::public.reviews, pg_temp.map_photos(to_jsonb(r)) || jsonb_build_object(
  'id', gen_random_uuid(), 'site_id', 'annapurna',
  'trek_id', (select tm.new_id from src_treks tm where tm.old_id = r.trek_id),
  'created_at', now(), 'created_by', null::uuid, 'updated_at', now(), 'updated_by', null::uuid
))).*
from public.reviews r
where r.site_id = 'ttn';

insert into public.adventures
select (jsonb_populate_record(null::public.adventures, pg_temp.map_photos(to_jsonb(ad)) || jsonb_build_object(
  'id', gen_random_uuid(), 'site_id', 'annapurna', 'created_at', now(), 'created_by', null::uuid, 'updated_at', now(), 'updated_by', null::uuid
))).*
from public.adventures ad
where ad.site_id = 'ttn';

-- The same company: its contact details, licences and links.
update public.site_settings s
set (phone_country_code, phone_number, email, office_address, office_days, office_opens, office_closes, reply_languages,
     legal_name, legal_form, founded_year, tourism_registration, tourism_licence, company_registration, pan_number,
     taan_number, memberships, staff_insurer, payments_note, certificate_photo_id, facebook_url, instagram_url,
     youtube_url, tripadvisor_url, google_business_url, share_photo_id, linkedin_url, google_review_url,
     pan_certificate_photo_id, google_maps_url, google_maps_embed_url, updated_at) =
    (m.phone_country_code, m.phone_number, m.email, m.office_address, m.office_days, m.office_opens, m.office_closes, m.reply_languages,
     m.legal_name, m.legal_form, m.founded_year, m.tourism_registration, m.tourism_licence, m.company_registration, m.pan_number,
     m.taan_number, m.memberships, m.staff_insurer, m.payments_note, pg_temp.map_photo(m.certificate_photo_id), m.facebook_url, m.instagram_url,
     m.youtube_url, m.tripadvisor_url, m.google_business_url, pg_temp.map_photo(m.share_photo_id), m.linkedin_url, m.google_review_url,
     pg_temp.map_photo(m.pan_certificate_photo_id), m.google_maps_url, m.google_maps_embed_url, now())
from public.site_settings m
where m.site_id = 'ttn' and s.site_id = 'annapurna';

-- About, Contact and the legal pages, as Travel To Nepal wrote them (the legal texts take the company details from
-- Settings; the About words are rewritten for Annapurna in the admin).
update public.site_pages p
set (eyebrow, heading, intro, seo_title, seo_description, seo_keyword, photo_id, share_photo_id, founder_author_id, content, updated_at) =
    (m.eyebrow, m.heading, m.intro, m.seo_title, m.seo_description, m.seo_keyword, pg_temp.map_photo(m.photo_id), pg_temp.map_photo(m.share_photo_id),
     (select am.new_id from src_authors am where am.old_id = m.founder_author_id), pg_temp.map_photos(m.content), now())
from public.site_pages m
where m.site_id = 'ttn' and m.slug in ('about', 'contact', 'terms', 'privacy', 'impressum', 'cookies')
  and p.site_id = 'annapurna' and p.slug = m.slug;

insert into public.site_page_photos (site_id, page_slug, position, photo_id)
select 'annapurna', pp.page_slug, pp.position, pg_temp.map_photo(pp.photo_id)
from public.site_page_photos pp
where pp.site_id = 'ttn' and pp.page_slug in ('about', 'contact');

-- 6. Home: the Annapurna Base Camp Trek, with the top of the page from the design ---------------------------------------

update public.site_pages p
set eyebrow = 'Private trek · start any day · from 1 person',
    heading = 'Annapurna Base Camp Trek',
    intro = 'Eleven days from Kathmandu, through Gurung villages and rhododendron forest, into the sanctuary below the south face of Annapurna at 4,130 m. Private, with your own licensed guide, on the day you choose.',
    seo_title = 'Annapurna Base Camp Trek: private 11-day trek with a local team',
    seo_description = 'Private Annapurna Base Camp treks with a licensed local guide. Start on any day, from 1 person, with permits, teahouses and transport included. Plan it on WhatsApp.',
    seo_keyword = 'Annapurna Base Camp Trek',
    photo_id = (select t.cover_photo_id from public.treks t where t.site_id = 'annapurna' and t.slug = 'annapurna-base-camp'),
    content = '{"photoAlt": "Annapurna Base Camp at sunrise", "buttonLabel": "Plan my trek on WhatsApp", "secondLabel": "See the itinerary"}'::jsonb,
    updated_at = now()
where p.site_id = 'annapurna' and p.slug = 'home';

update public.sites
set home_trek_id = (select t.id from public.treks t where t.site_id = 'annapurna' and t.slug = 'annapurna-base-camp'),
    updated_at = now()
where id = 'annapurna';

-- Nothing of the new website points at another website's photo or person (the triggers check each row; this is the whole).
do $$
begin
  if exists (
    select 1 from public.treks t join public.photos p on p.id = t.cover_photo_id where t.site_id = 'annapurna' and p.site_id <> 'annapurna'
    union all
    select 1 from public.trek_guides tg join public.treks t on t.id = tg.trek_id join public.trekking_guides g on g.id = tg.guide_id
    where t.site_id = 'annapurna' and g.site_id <> 'annapurna'
    union all
    select 1 from public.articles a join public.authors au on au.id = a.author_id where a.site_id = 'annapurna' and au.site_id <> 'annapurna'
  ) then
    raise exception 'The Annapurna website still points at another website''s photo or person';
  end if;
end;
$$;
