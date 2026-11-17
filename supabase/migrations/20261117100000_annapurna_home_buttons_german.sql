-- Annapurna Trekking is German only (decided 2026-11-15), but its Home's two buttons kept the English words from
-- 20261112120000_annapurna_site.sql: 20261116100000 left the Home alone, as the team had already written its text in
-- German. Give the buttons the same German words as the trek pages, and only where the English words are still there.

update public.site_pages p
set content = p.content
      || case when p.content ->> 'buttonLabel' = 'Plan my trek on WhatsApp' then '{"buttonLabel": "Trek per WhatsApp planen"}'::jsonb else '{}'::jsonb end
      || case when p.content ->> 'secondLabel' = 'See the itinerary' then '{"secondLabel": "Zum Reiseverlauf"}'::jsonb else '{}'::jsonb end,
    updated_at = now()
where p.site_id = 'annapurna'
  and p.slug = 'home'
  and (p.content ->> 'buttonLabel' = 'Plan my trek on WhatsApp' or p.content ->> 'secondLabel' = 'See the itinerary');
