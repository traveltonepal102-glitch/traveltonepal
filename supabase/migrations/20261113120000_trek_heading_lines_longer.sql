-- The lines under the packing list's, route map's and best months' headings may hold 3,000 characters of text
-- (decided 2026-11-13; the admin's TREK_LIMITS.headingLine was 1,500). Their rich-text JSON gets room for that
-- with its links and paragraphs: 60,000 bytes instead of 20,000.

alter table public.trek_translations
  drop constraint trek_translations_packing_line_check,
  drop constraint trek_translations_route_map_line_check,
  drop constraint trek_translations_months_line_check,
  add constraint trek_translations_packing_line_check check (jsonb_typeof(packing_line) = 'object' and octet_length(packing_line::text) <= 60000),
  add constraint trek_translations_route_map_line_check check (jsonb_typeof(route_map_line) = 'object' and octet_length(route_map_line::text) <= 60000),
  add constraint trek_translations_months_line_check check (jsonb_typeof(months_line) = 'object' and octet_length(months_line::text) <= 60000);
