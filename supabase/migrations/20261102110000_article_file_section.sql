-- Travel guides: a "File to download" section, a PDF visitors open or download (a packing list, a permit form).
-- The PDF is in the public trek-files bucket at guide-files/<uuid>/<name>.pdf (@ttn/config/guideFiles); its address
-- and size in bytes are in settings ({ "path", "byteSize" }), its title and description in content.
-- save_article and web_travel_guide_pages need no change: they take and send any section type as it is.
alter type public.article_section_type add value 'file' after 'embed';
