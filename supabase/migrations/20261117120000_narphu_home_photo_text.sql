-- Nar Phu Trek's Home: the description of its top photo (20261117110000_narphu_site.sql) named a view of Phu village,
-- but the photo is the trek's cover, the chortens and prayer flags at Phu. Only where the first words are still there.

update public.site_pages p
set content = p.content || '{"photoAlt": "Chortens and prayer flags at Phu village in the Nar Phu valley"}'::jsonb,
    updated_at = now()
where p.site_id = 'narphu'
  and p.slug = 'home'
  and p.content ->> 'photoAlt' = 'Phu village on its hill above the Phu Khola';
