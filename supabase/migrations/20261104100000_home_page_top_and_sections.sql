-- A region website's Home (changed 2026-11-04): like a travel guide, a fixed "Top of the page" with required fields
-- (the photo, its description, the H1, the intro and the WhatsApp button), kept in its site_pages row (photo_id,
-- heading, intro, eyebrow; content holds photoAlt, buttonLabel, secondLabel), then the sections the admin picks from
-- the catalog. So the hero is no longer a section, and a new site's Home starts with no sections.

-- The default sections (20261103140000) are dropped while no admin has saved them (a save sets updated_by).
drop trigger site_pages_create_home_sections on public.site_pages;
drop function public.create_home_sections();
drop function public.insert_default_home_sections(text);

delete from public.site_page_sections where updated_by is null;

alter table public.site_page_sections drop constraint site_page_sections_type_check;
alter table public.site_page_sections add constraint site_page_sections_type_check check (type in (
  'facts', 'treks', 'prices', 'itinerary', 'gallery', 'fit', 'why',
  'reviews', 'months', 'days', 'faq', 'guides', 'cta', 'text'
));

-- Saves a page's top and Google result (save_site_page) and its sections (save_site_page_sections) in one
-- transaction. Runs as the admin: Row Level Security applies.
create function public.save_site_page_with_sections(p_site_id text, p_slug text, p_page jsonb, p_sections jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  perform public.save_site_page(p_slug, p_page, '[]'::jsonb, p_site_id);
  perform public.save_site_page_sections(p_site_id, p_slug, p_sections);
end;
$$;

revoke execute on function public.save_site_page_with_sections(text, text, jsonb, jsonb) from public, anon;
grant execute on function public.save_site_page_with_sections(text, text, jsonb, jsonb) to authenticated;
