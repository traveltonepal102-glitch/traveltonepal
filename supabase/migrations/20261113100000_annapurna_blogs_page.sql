-- Annapurna Trekking's Blogs page (the "travel-guides" fixed page, Pages › Lists): the top of the page and its Google
-- result, from the design (canvas "Annapurna Trekking Home Page", Blogs artboard). The website showed the seeded
-- "Travel guides" heading until now.

update public.site_pages
set heading = 'Annapurna trekking blogs',
    intro = 'Costs, seasons, permits, packing and health, written by the people who guide the treks. Read before you go, or ask us what you can’t find.',
    seo_title = 'Annapurna trekking blogs: costs, seasons, permits and packing',
    seo_description = 'Practical blogs about trekking in the Annapurna region, written by local guides: what it costs, when to go, which permits you need and what to pack.',
    seo_keyword = 'Annapurna trekking blog',
    updated_at = now()
where site_id = 'annapurna' and slug = 'travel-guides';
