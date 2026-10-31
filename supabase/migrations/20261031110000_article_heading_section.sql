-- Travel guides: a "Heading" section, a heading with nothing under it (for a table, photo or trek card that follows).
-- Its level ("h2", a stop in "In this guide", or "h3") is in settings; its heading and short name in content.
-- save_article and web_travel_guide_pages need no change: they take and send any section type as it is.
alter type public.article_section_type add value 'heading' after 'paragraph';
