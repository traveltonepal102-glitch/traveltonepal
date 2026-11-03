-- A region website has no Treks list page and no Regions page (decided 2026-11-03): it has at most four treks, and
-- its menu links straight to each trek's page. Its list pages are Home and Travel guides; the main site keeps all four.

-- The region sites' Treks and Regions pages go (they were empty drafts, nothing written on them yet).
delete from public.site_pages p
using public.sites s
where s.id = p.site_id and s.kind = 'region' and p.slug in ('treks', 'regions');

-- A new site's pages: a region site gets no Treks or Regions page.
create or replace function public.create_site_pages()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.site_pages (site_id, slug, heading)
  select new.id, page.slug, page.heading
  from (values
    ('home', new.name),
    ('treks', 'Treks'),
    ('regions', 'Regions'),
    ('travel-guides', 'Travel guides'),
    ('about', 'About us'),
    ('contact', 'Contact'),
    ('terms', 'Terms and conditions'),
    ('privacy', 'Privacy policy'),
    ('impressum', 'Impressum'),
    ('cookies', 'Cookie settings')
  ) as page (slug, heading)
  where new.kind = 'main' or page.slug not in ('treks', 'regions')
  on conflict (site_id, slug) do nothing;
  return new;
end;
$$;
