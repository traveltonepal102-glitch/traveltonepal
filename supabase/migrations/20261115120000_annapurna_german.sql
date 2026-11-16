-- Annapurna Trekking is German (20261115100000_site_language_and_currency.sql). Its content was copied from Travel
-- To Nepal in English (20261112120000_annapurna_site.sql); it now becomes the website's German text, still in English
-- words until it is translated in the admin. Prices keep their numbers until euro prices are typed in.

-- Texts of its treks, with their days, group prices and departures
update public.trek_translations x set locale = 'de'
from public.treks t where t.id = x.trek_id and t.site_id = 'annapurna' and x.locale = 'en';

update public.trek_day_translations x set locale = 'de'
from public.trek_days d join public.treks t on t.id = d.trek_id
where d.id = x.day_id and t.site_id = 'annapurna' and x.locale = 'en';

update public.trek_group_price_translations x set locale = 'de'
from public.trek_group_prices g join public.treks t on t.id = g.trek_id
where g.id = x.price_id and t.site_id = 'annapurna' and x.locale = 'en';

update public.trek_departure_translations x set locale = 'de'
from public.trek_departures d join public.treks t on t.id = d.trek_id
where d.id = x.departure_id and t.site_id = 'annapurna' and x.locale = 'en';

-- Its blogs (travel guides) and their sections
update public.article_translations x set locale = 'de'
from public.articles a where a.id = x.article_id and a.site_id = 'annapurna' and x.locale = 'en';

update public.article_section_translations x set locale = 'de'
from public.article_sections s join public.articles a on a.id = s.article_id
where s.id = x.section_id and a.site_id = 'annapurna' and x.locale = 'en';

-- Its people; its authors write in German (save_article checks it)
update public.author_translations x set locale = 'de'
from public.authors a where a.id = x.author_id and a.site_id = 'annapurna' and x.locale = 'en';

update public.authors set writes_in = '{de}' where site_id = 'annapurna';

update public.trekking_guide_translations x set locale = 'de'
from public.trekking_guides g where g.id = x.guide_id and g.site_id = 'annapurna' and x.locale = 'en';

-- The website has never been live, so it has no old addresses to keep.
delete from public.slug_redirects where site_id = 'annapurna';
