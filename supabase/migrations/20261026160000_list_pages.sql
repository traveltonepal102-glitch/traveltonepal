-- Pages › List pages (design: Admin-pages, "List pages"): the top of the Home, Treks, Regions and Travel guides
-- pages and their Google result. The lists themselves fill from treks, regions and travel guides. The rows start
-- with the website's current text; {regions} and {treks} in a text are replaced by the website with the count.

insert into public.site_pages (slug, eyebrow, heading, intro, seo_title, seo_description, seo_keyword) values
(
  'home',
  'Spring and autumn 2027 departures open',
  'Walk the Himalaya with people who call it home.',
  '{regions} trekking regions, guides born in the valleys they lead, and a real person to plan it with you on WhatsApp.',
  'Nepal trekking with local guides',
  'Private treks in {regions} regions of Nepal with licensed local guides. Clear prices, your own dates, and a real person to plan it with on WhatsApp.',
  'Nepal trekking'
),
(
  'treks',
  'All treks and packages',
  'Nepal treks, from short valley walks to high passes',
  'Every trek is private, led by a local guide and planned with you on WhatsApp. Filter by region, length and difficulty, or ask us to suggest one.',
  'Nepal treks',
  'Every trek is private, led by a local guide and planned with you on WhatsApp. Filter by region, length and difficulty, or ask us to suggest one.',
  'Nepal treks'
),
(
  'regions',
  '{regions} trekking regions',
  'Trekking regions of Nepal: find the valley that fits you',
  'From short walks near Kathmandu to remote circuits near the Tibet border. Compare altitude, length, access and the best months, then pick your region.',
  'Trekking regions of Nepal: compare and choose',
  'Compare Nepal''s {regions} trekking regions on one map: altitude, trek length, access, permits and the best months, from Langtang near Kathmandu to remote Kanchenjunga.',
  'Nepal trekking regions'
),
(
  'travel-guides',
  'Written by our local team',
  'Nepal travel guides',
  'Honest, practical advice for planning a trek in Nepal: permits, seasons, costs, altitude and what to pack, from the people who walk these trails every season.',
  'Nepal travel guides: permits, seasons, costs and altitude',
  'Honest, practical advice for planning a trek in Nepal: permits, seasons, costs, altitude and what to pack, from the local team who walk these trails every season.',
  'Nepal travel guide'
);

-- Saves the four list pages in one transaction (as the admin, Row Level Security on). p_pages: { "<slug>": the
-- page as save_site_page takes it }; only these four slugs are read.
create function public.save_list_pages(p_pages jsonb)
returns void
language plpgsql
set search_path = ''
as $$
declare
  page_slug text;
begin
  foreach page_slug in array array['home', 'treks', 'regions', 'travel-guides'] loop
    if p_pages ? page_slug then
      perform public.save_site_page(page_slug, p_pages -> page_slug, '[]'::jsonb);
    end if;
  end loop;
end;
$$;

revoke all on function public.save_list_pages(jsonb) from public, anon;
grant execute on function public.save_list_pages(jsonb) to authenticated;
