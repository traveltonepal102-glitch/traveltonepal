-- Nar Phu Trek: "Our story" (the founder section) comes after the itinerary on both treks' pages, not after the
-- overview (asked 2026-11-17). The same change as moving it in the trek editor's "Order of the page sections".

update public.treks t
set section_order = (
      select array_agg(section order by position)
      from (
        select section, position from unnest(array_remove(t.section_order, 'founder')) with ordinality as s (section, position)
        union all
        select 'founder', (select s.position from unnest(array_remove(t.section_order, 'founder')) with ordinality as s (section, position) where s.section = 'itinerary') + 0.5
      ) ordered
    ),
    updated_at = now()
where t.site_id = 'narphu'
  and 'itinerary' = any (t.section_order)
  and 'founder' = any (t.section_order);
