-- Everest Trek (decided 2026-11-18): the fourth region website, "everest", for the Everest region (everest-trek.de),
-- built like Nar Phu Trek to the design canvas "Everest Trek Website" (apps/everest). German with euros and the
-- informal "du" (its brand guide). It starts with its own copies of what Travel To Nepal has about Everest, so the
-- website shows real content from the first build:
--
--   1. The website row; its settings, fixed pages and adventure section come with it (the sites triggers).
--   2. Its own copies of the photos those copies show (photo_file_copies lists the files to copy, done by
--      apps/admin/scripts/copy-photo-files.mjs).
--   3. The people: the guides who lead the treks or check the blogs, the blogs' authors and the founder.
--   4. The Everest Base Camp Trek (its main trek), the Gokyo Lakes Trek and the Pikey Peak Trek, published, with their
--      photos, days, prices, guides and similar treks. Their PDF maps and GPS tracks stay with Travel To Nepal.
--   5. The blogs about these treks, the company's reviews, settings and the About, Contact and legal pages.
--
-- Every text is stored as the website's German from the start (check_content_locale refuses English text on a German
-- website); the German words follow in 20261118120000_everest_german_content.sql. Prices keep their numbers as euros
-- until the team types its euro prices. The copies are new rows with new ids and no link back.
-- The website isn't live until a Super admin types its address and switches on "Live" in Sites.

-- 1. The website -------------------------------------------------------------------------------------------------------

insert into public.sites (id, kind, region_id, name, url, is_live, position, language, currency)
values (
  'everest', 'region', (select r.id from public.regions r where r.slug = 'everest-region'),
  'Everest Trek', null, false, (select coalesce(max(s.position), 0) + 1 from public.sites s), 'de', 'EUR'
);

-- What is copied ------------------------------------------------------------------------------------------------------

create temporary table src_treks on commit drop as
select t.id as old_id, gen_random_uuid() as new_id
from public.treks t
where t.site_id = 'ttn' and t.slug in ('everest-base-camp', 'gokyo-lakes', 'pikey-peak');

-- A blog about one of these treks: its trek, the trek its photos come from, or a trek section.
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

-- Every photo the copies will show: a new copy for the Everest Trek website (Travel To Nepal keeps the original).
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
  union select x.photo_id from public.site_settings s cross join lateral (values (s.share_photo_id), (s.certificate_photo_id), (s.pan_certificate_photo_id)) as x (photo_id) where s.site_id = 'ttn'
  union select p.photo_id from public.site_pages p where p.site_id = 'ttn' and p.slug in ('about', 'contact', 'terms', 'privacy', 'impressum', 'cookies')
  union select p.share_photo_id from public.site_pages p where p.site_id = 'ttn' and p.slug in ('about', 'contact', 'terms', 'privacy', 'impressum', 'cookies')
  union select public.photo_ids_in(p.content) from public.site_pages p where p.site_id = 'ttn' and p.slug in ('about', 'contact', 'terms', 'privacy', 'impressum', 'cookies')
  union select pp.photo_id from public.site_page_photos pp where pp.site_id = 'ttn' and pp.page_slug in ('about', 'contact')
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
  'id', m.new_id, 'site_id', 'everest', 'master_key', 'masters/' || m.new_id || '.jpg', 'created_at', now(), 'updated_at', now()
))).*
from photo_map m
join public.photos p on p.id = m.old_id;

insert into public.photo_file_copies (photo_id, source_id) select m.new_id, m.old_id from photo_map m;

-- 3. People -------------------------------------------------------------------------------------------------------------

insert into public.trekking_guides
select (jsonb_populate_record(null::public.trekking_guides, pg_temp.map_photos(to_jsonb(g)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'everest', 'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid
))).*
from src_guides m
join public.trekking_guides g on g.id = m.old_id;

insert into public.trekking_guide_translations
select (jsonb_populate_record(null::public.trekking_guide_translations, pg_temp.map_photos(to_jsonb(t)) || jsonb_build_object('guide_id', m.new_id, 'locale', 'de'))).*
from src_guides m
join public.trekking_guide_translations t on t.guide_id = m.old_id and t.locale = 'en';

insert into public.trekking_guide_regions (guide_id, region_id)
select m.new_id, r.region_id from src_guides m join public.trekking_guide_regions r on r.guide_id = m.old_id;

insert into public.authors
select (jsonb_populate_record(null::public.authors, pg_temp.map_photos(to_jsonb(au)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'everest', 'writes_in', '{de}'::text[], 'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid,
  'guide_id', (select gm.new_id from src_guides gm where gm.old_id = au.guide_id)
))).*
from src_authors m
join public.authors au on au.id = m.old_id;

insert into public.author_translations
select (jsonb_populate_record(null::public.author_translations, pg_temp.map_photos(to_jsonb(t)) || jsonb_build_object('author_id', m.new_id, 'locale', 'de'))).*
from src_authors m
join public.author_translations t on t.author_id = m.old_id and t.locale = 'en';

-- 4. Treks --------------------------------------------------------------------------------------------------------------

insert into public.treks
select (jsonb_populate_record(null::public.treks, pg_temp.map_photos(to_jsonb(t)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'everest', 'pdf_map_path', null::text, 'gpx_track_path', null::text, 'featured_article_id', null::uuid,
  'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid
))).*
from src_treks m
join public.treks t on t.id = m.old_id;

insert into public.trek_translations
select (jsonb_populate_record(null::public.trek_translations, pg_temp.map_photos(to_jsonb(tt)) || jsonb_build_object(
  'trek_id', m.new_id, 'locale', 'de', 'canonical_path', '', 'hide_from_google', false, 'updated_at', now()
))).*
from src_treks m
join public.trek_translations tt on tt.trek_id = m.old_id and tt.locale = 'en';

create temporary table day_map on commit drop as
select d.id as old_id, gen_random_uuid() as new_id, m.new_id as trek_id
from public.trek_days d join src_treks m on m.old_id = d.trek_id;

insert into public.trek_days
select (jsonb_populate_record(null::public.trek_days, pg_temp.map_photos(to_jsonb(d)) || jsonb_build_object('id', m.new_id, 'trek_id', m.trek_id))).*
from day_map m
join public.trek_days d on d.id = m.old_id;

insert into public.trek_day_translations
select (jsonb_populate_record(null::public.trek_day_translations, pg_temp.map_photos(to_jsonb(dt)) || jsonb_build_object('day_id', m.new_id, 'locale', 'de'))).*
from day_map m
join public.trek_day_translations dt on dt.day_id = m.old_id and dt.locale = 'en';

create temporary table price_map on commit drop as
select p.id as old_id, gen_random_uuid() as new_id, m.new_id as trek_id
from public.trek_group_prices p join src_treks m on m.old_id = p.trek_id;

insert into public.trek_group_prices
select (jsonb_populate_record(null::public.trek_group_prices, to_jsonb(p) || jsonb_build_object('id', m.new_id, 'trek_id', m.trek_id))).*
from price_map m
join public.trek_group_prices p on p.id = m.old_id;

insert into public.trek_group_price_translations
select (jsonb_populate_record(null::public.trek_group_price_translations, to_jsonb(pt) || jsonb_build_object('price_id', m.new_id, 'locale', 'de'))).*
from price_map m
join public.trek_group_price_translations pt on pt.price_id = m.old_id and pt.locale = 'en';

insert into public.trek_photos (trek_id, photo_id, position)
select m.new_id, pg_temp.map_photo(tp.photo_id), tp.position from src_treks m join public.trek_photos tp on tp.trek_id = m.old_id;

insert into public.trek_regions (trek_id, region_id, position)
select m.new_id, tr.region_id, tr.position from src_treks m join public.trek_regions tr on tr.trek_id = m.old_id;

insert into public.trek_guides (trek_id, guide_id, position)
select m.new_id, gm.new_id, tg.position
from src_treks m join public.trek_guides tg on tg.trek_id = m.old_id join src_guides gm on gm.old_id = tg.guide_id;

-- Similar treks, where both are on this website.
insert into public.trek_similar (trek_id, similar_trek_id, position)
select m.new_id, sm.new_id, ts.position
from src_treks m join public.trek_similar ts on ts.trek_id = m.old_id join src_treks sm on sm.old_id = ts.similar_trek_id;

-- 5. Blogs, reviews, settings and pages ----------------------------------------------------------------------------

insert into public.articles
select (jsonb_populate_record(null::public.articles, pg_temp.map_photos(to_jsonb(a)) || jsonb_build_object(
  'id', m.new_id, 'site_id', 'everest', 'site_region_id', null::uuid, 'also_on_main_site', false,
  'author_id', (select am.new_id from src_authors am where am.old_id = a.author_id),
  'checker_guide_id', (select gm.new_id from src_guides gm where gm.old_id = a.checker_guide_id),
  'main_trek_id', (select tm.new_id from src_treks tm where tm.old_id = a.main_trek_id),
  'photo_trek_id', (select tm.new_id from src_treks tm where tm.old_id = a.photo_trek_id),
  -- The blog shown first on the website: the one about its main trek.
  'is_featured', a.slug = 'best-time-to-trek-everest-base-camp',
  'created_at', now(), 'updated_at', now(), 'updated_by', null::uuid
))).*
from src_articles m
join public.articles a on a.id = m.old_id;

insert into public.article_translations
select (jsonb_populate_record(null::public.article_translations, pg_temp.map_photos(to_jsonb(at)) || jsonb_build_object(
  'article_id', m.new_id, 'locale', 'de', 'canonical_path', '', 'hide_from_google', false, 'updated_at', now()
))).*
from src_articles m
join public.article_translations at on at.article_id = m.old_id and at.locale = 'en';

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
select (jsonb_populate_record(null::public.article_section_translations, pg_temp.map_photos(to_jsonb(st)) || jsonb_build_object('section_id', m.new_id, 'locale', 'de'))).*
from section_map m
join public.article_section_translations st on st.section_id = m.old_id and st.locale = 'en';

insert into public.article_section_photos (section_id, photo_id, position)
select m.new_id, pg_temp.map_photo(sp.photo_id), sp.position from section_map m join public.article_section_photos sp on sp.section_id = m.old_id;

insert into public.article_section_guides (section_id, guide_id, position)
select m.new_id, gm.new_id, sg.position
from section_map m join public.article_section_guides sg on sg.section_id = m.old_id join src_guides gm on gm.old_id = sg.guide_id;

-- Not copied: the pins on the region maps (article_regions), which are Travel To Nepal's region pages.

insert into public.article_related (article_id, related_article_id, position)
select m.new_id, rm.new_id, ar.position
from src_articles m join public.article_related ar on ar.article_id = m.old_id join src_articles rm on rm.old_id = ar.related_article_id;

-- Each trek's "Read before you go" (trek_articles, decided 2026-11-14): the blogs about it, in this order.
insert into public.trek_articles (trek_id, article_id, site_id, position)
select t.id, a.id, 'everest', picks.position
from (values
  ('everest-base-camp', 'best-time-to-trek-everest-base-camp', 1), ('everest-base-camp', 'altitude-sickness-everest-base-camp', 2),
  ('everest-base-camp', 'lukla-flights-explained', 3), ('everest-base-camp', 'trekking-insurance-nepal-what-to-check', 4),
  ('gokyo-lakes', 'lukla-flights-explained', 1), ('gokyo-lakes', 'altitude-sickness-everest-base-camp', 2),
  ('gokyo-lakes', 'best-time-to-trek-everest-base-camp', 3),
  ('pikey-peak', 'pikey-peak-everest-views-without-lukla', 1), ('pikey-peak', 'trekking-insurance-nepal-what-to-check', 2)
) as picks (trek_slug, article_slug, position)
join public.treks t on t.site_id = 'everest' and t.slug = picks.trek_slug
join public.articles a on a.site_id = 'everest' and a.slug = picks.article_slug;

update public.treks t
set featured_article_id = (select ta.article_id from public.trek_articles ta where ta.trek_id = t.id order by ta.position limit 1)
where t.site_id = 'everest';

-- The company's real reviews, on this website too (one about a trek it doesn't have is about the company).
insert into public.reviews
select (jsonb_populate_record(null::public.reviews, pg_temp.map_photos(to_jsonb(r)) || jsonb_build_object(
  'id', gen_random_uuid(), 'site_id', 'everest',
  'trek_id', (select tm.new_id from src_treks tm where tm.old_id = r.trek_id),
  'created_at', now(), 'created_by', null::uuid, 'updated_at', now(), 'updated_by', null::uuid
))).*
from public.reviews r
where r.site_id = 'ttn';

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
where m.site_id = 'ttn' and s.site_id = 'everest';

-- About, Contact and the legal pages, as Travel To Nepal wrote them (German words follow in the next migration).
update public.site_pages p
set (eyebrow, heading, intro, seo_title, seo_description, seo_keyword, photo_id, share_photo_id, founder_author_id, content, updated_at) =
    (m.eyebrow, m.heading, m.intro, m.seo_title, m.seo_description, m.seo_keyword, pg_temp.map_photo(m.photo_id), pg_temp.map_photo(m.share_photo_id),
     (select am.new_id from src_authors am where am.old_id = m.founder_author_id), pg_temp.map_photos(m.content), now())
from public.site_pages m
where m.site_id = 'ttn' and m.slug in ('about', 'contact', 'terms', 'privacy', 'impressum', 'cookies')
  and p.site_id = 'everest' and p.slug = m.slug;

insert into public.site_page_photos (site_id, page_slug, position, photo_id)
select 'everest', pp.page_slug, pp.position, pg_temp.map_photo(pp.photo_id)
from public.site_page_photos pp
where pp.site_id = 'ttn' and pp.page_slug in ('about', 'contact');

update public.sites
set home_trek_id = (select t.id from public.treks t where t.site_id = 'everest' and t.slug = 'everest-base-camp'),
    updated_at = now()
where id = 'everest';

-- Nothing of the new website points at another website's photo or person (the triggers check each row; this is the whole).
do $$
begin
  if exists (
    select 1 from public.treks t join public.photos p on p.id = t.cover_photo_id where t.site_id = 'everest' and p.site_id <> 'everest'
    union all
    select 1 from public.trek_guides tg join public.treks t on t.id = tg.trek_id join public.trekking_guides g on g.id = tg.guide_id
    where t.site_id = 'everest' and g.site_id <> 'everest'
    union all
    select 1 from public.articles a join public.authors au on au.id = a.author_id where a.site_id = 'everest' and au.site_id <> 'everest'
  ) then
    raise exception 'The Everest website still points at another website''s photo or person';
  end if;
  if (select count(*) from public.treks where site_id = 'everest') <> 3 or (select count(*) from public.articles where site_id = 'everest') <> 5 then
    raise exception 'The Everest website did not get its 3 treks and 5 blogs';
  end if;
  if (select home_trek_id from public.sites where id = 'everest') is null then
    raise exception 'The Everest website has no main trek';
  end if;
end;
$$;
