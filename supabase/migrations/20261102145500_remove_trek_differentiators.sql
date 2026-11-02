-- The trek page's "What makes this trip different" section (key 'differentiators') is gone (2026-11-02): its cards
-- were fixed wording on every trek, not edited in the admin. Take the key out of each trek's saved order and hidden
-- shared sections. The checks on both columns still allow it, so an admin running the code from before this change
-- can keep saving until it is deployed again; the website and the admin drop unknown keys when they read them.

update public.treks
set section_order = array_remove(section_order, 'differentiators'),
    hidden_shared_sections = array_remove(hidden_shared_sections, 'differentiators')
where 'differentiators' = any (section_order) or 'differentiators' = any (hidden_shared_sections);
