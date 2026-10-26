-- Travel guide pages read the database (decided 2026-10-26), replacing the website's hand-written demo guides.
-- Public content only, as the other web_ views: never ages, licence numbers, admin users or guides who haven't agreed.

-- The guide cards gain what the Travel guides page lists by: the author's name, the regions the guide is about and a
-- reading time (about 200 words a minute over the intro and the article body, at least 1). "create or replace view"
-- keeps the existing columns and anon's grant; the new ones come last.
create or replace view public.web_travel_guides as
select
  a.id,
  a.slug,
  t.locale,
  t.title,
  t.card_text,
  a.topic,
  r.slug as site_region_slug,
  a.also_on_main_site,
  a.is_featured,
  a.start_here_position,
  a.published_on,
  a.updated_on,
  t.cover_alt,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place,
  coalesce(nullif(au.name, ''), ag.name, '') as author_name,
  array(
    select ar_r.slug
    from public.article_regions ar
    join public.regions ar_r on ar_r.id = ar.region_id
    where ar.article_id = a.id
    order by ar_r.slug
  ) as region_slugs,
  greatest(
    1,
    ceil(
      (
        select count(*)
        from (
          select regexp_split_to_table(text_value.value #>> '{}', '\s+') as word
          from public.article_sections s
          join public.article_section_translations st on st.section_id = s.id and st.locale = t.locale
          cross join lateral jsonb_path_query(st.content, 'strict $.**') as text_value (value)
          where s.article_id = a.id
            and jsonb_typeof(text_value.value) = 'string'
            -- Rich text's own markers and link addresses are not words a reader reads.
            and text_value.value #>> '{}' not in ('doc', 'paragraph', 'text', 'heading', 'bulletList', 'orderedList', 'listItem', 'bold', 'italic', 'link', 'hardBreak')
            and text_value.value #>> '{}' !~ '^(/|https?:|mailto:)'
          union all
          select regexp_split_to_table(t.intro, '\s+')
        ) as words
        where words.word <> ''
      ) / 200.0
    )
  )::integer as read_minutes
from public.articles a
join public.article_translations t on t.article_id = a.id
left join public.regions r on r.id = a.site_region_id
left join public.photos p on p.id = a.cover_photo_id
left join public.authors au on au.id = a.author_id
left join public.trekking_guides ag on ag.id = au.guide_id
where a.status = 'published'
  and a.published_on <= (now() at time zone 'Asia/Kathmandu')::date;

-- The rest of a travel guide's page. Sections come in order with what each one shows already joined: a published
-- trek's address, guides who agreed to be shown (photo and name), library photos and, for "Itinerary days", the
-- chosen days of the trek. Treks that aren't published and guides who haven't agreed are left out.
create view public.web_travel_guide_pages as
select
  g.id,
  g.slug,
  g.locale,
  t.title,
  t.intro,
  t.highlight_tag,
  t.updated_line,
  t.facts,
  t.seo_title,
  t.seo_description,
  a.published_on,
  a.updated_on,
  a.topic,
  a.month_ratings,
  t.month_notes,
  t.cover_alt,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place,
  (select w.slug from public.web_treks w where w.id = a.main_trek_id and w.locale = g.locale) as main_trek_slug,
  (select w.slug from public.web_treks w where w.id = a.photo_trek_id and w.locale = g.locale) as photo_trek_slug,
  -- Office and guest authors have their own name, photo and bio; a trekking guide author's come from the guide.
  (
    select jsonb_build_object(
      'kind', au.kind,
      'name', coalesce(nullif(au.name, ''), ag.name, ''),
      'job_title', coalesce(aut.job_title, ''),
      'bio', coalesce(nullif(aut.bio, ''), agt.bio, ''),
      'photo', case when ap.id is null then null else jsonb_build_object(
        'cover_id', ap.id, 'cover_width', ap.width, 'cover_height', ap.height,
        'cover_variant_widths', ap.variant_widths, 'cover_placeholder', ap.placeholder, 'cover_place', ap.place
      ) end
    )
    from public.authors au
    left join public.author_translations aut on aut.author_id = au.id and aut.locale = g.locale
    left join public.trekking_guides ag on ag.id = au.guide_id
    left join public.trekking_guide_translations agt on agt.guide_id = ag.id and agt.locale = g.locale
    left join public.photos ap
      on ap.id = case when au.kind = 'guide' then ag.photo_id when au.photo_consent then au.photo_id end
    where au.id = a.author_id
  ) as author,
  -- "Fact-checked by": only a guide who checks facts and agreed to be shown.
  (
    select jsonb_build_object(
      'name', cg.name,
      'role', coalesce(cgt.role, ''),
      'photo', case when cp.id is null then null else jsonb_build_object(
        'cover_id', cp.id, 'cover_width', cp.width, 'cover_height', cp.height,
        'cover_variant_widths', cp.variant_widths, 'cover_placeholder', cp.placeholder, 'cover_place', cp.place
      ) end
    )
    from public.trekking_guides cg
    left join public.trekking_guide_translations cgt on cgt.guide_id = cg.id and cgt.locale = g.locale
    left join public.photos cp on cp.id = cg.photo_id
    where cg.id = a.checker_guide_id and cg.can_fact_check and cg.photo_consent
  ) as checker,
  array(
    select rg.slug
    from public.article_related rel
    join public.web_travel_guides rg on rg.id = rel.related_article_id and rg.locale = g.locale
    where rel.article_id = a.id
    order by rel.position
  ) as related_slugs,
  g.region_slugs,
  g.read_minutes,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'type', s.type,
          'settings', s.settings,
          'content', coalesce(st.content, '{}'::jsonb),
          'trek_slug', (select w.slug from public.web_treks w where w.id = s.trek_id and w.locale = g.locale),
          -- "Compare treks": the published ones, in the admin's order.
          'trek_slugs', coalesce(
            (
              select jsonb_agg(w.slug order by picked.position)
              from jsonb_array_elements_text(
                case when jsonb_typeof(s.settings -> 'trekIds') = 'array' then s.settings -> 'trekIds' else '[]'::jsonb end
              ) with ordinality as picked (trek_id, position)
              join public.web_treks w on w.id::text = picked.trek_id and w.locale = g.locale
            ),
            '[]'::jsonb
          ),
          'guides', coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'name', sg.name,
                  'role', coalesce(sgt.role, ''),
                  'quote', coalesce(sgt.quote, ''),
                  'photo', case when sp.id is null then null else jsonb_build_object(
                    'cover_id', sp.id, 'cover_width', sp.width, 'cover_height', sp.height,
                    'cover_variant_widths', sp.variant_widths, 'cover_placeholder', sp.placeholder, 'cover_place', sp.place
                  ) end
                )
                order by sgl.position
              )
              from public.article_section_guides sgl
              join public.trekking_guides sg on sg.id = sgl.guide_id and sg.photo_consent
              left join public.trekking_guide_translations sgt on sgt.guide_id = sg.id and sgt.locale = g.locale
              left join public.photos sp on sp.id = sg.photo_id
              where sgl.section_id = s.id
            ),
            '[]'::jsonb
          ),
          'photos', coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'cover_id', ph.id, 'cover_width', ph.width, 'cover_height', ph.height,
                  'cover_variant_widths', ph.variant_widths, 'cover_placeholder', ph.placeholder, 'cover_place', ph.place
                )
                order by spl.position
              )
              from public.article_section_photos spl
              join public.photos ph on ph.id = spl.photo_id
              where spl.section_id = s.id
            ),
            '[]'::jsonb
          ),
          -- "Itinerary days": the chosen days of a published trek, in the admin's order.
          'days', coalesce(
            (
              select jsonb_agg(
                jsonb_build_object(
                  'place', dt.place,
                  'title', dt.title,
                  'subtitle', dt.subtitle,
                  'duration', dt.duration,
                  'altitude_m', d.altitude_m,
                  'sleep_altitude_m', d.sleep_altitude_m,
                  'is_high_point', d.is_high_point,
                  'day_number', d.position + 1,
                  'description', dt.description
                )
                order by picked.position
              )
              from jsonb_array_elements_text(
                case when jsonb_typeof(s.settings -> 'dayIds') = 'array' then s.settings -> 'dayIds' else '[]'::jsonb end
              ) with ordinality as picked (day_id, position)
              join public.trek_days d on d.id::text = picked.day_id
              join public.trek_day_translations dt on dt.day_id = d.id and dt.locale = g.locale
              where exists (select 1 from public.web_treks w where w.id = d.trek_id and w.locale = g.locale)
            ),
            '[]'::jsonb
          )
        )
        order by s.position
      )
      from public.article_sections s
      left join public.article_section_translations st on st.section_id = s.id and st.locale = g.locale
      where s.article_id = a.id
    ),
    '[]'::jsonb
  ) as sections
from public.web_travel_guides g
join public.articles a on a.id = g.id
join public.article_translations t on t.article_id = a.id and t.locale = g.locale
left join public.photos p on p.id = a.cover_photo_id;

revoke all on public.web_travel_guide_pages from public, authenticated;
grant select on public.web_travel_guide_pages to anon;
