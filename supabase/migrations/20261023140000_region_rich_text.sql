-- The region introduction and the question answers become rich text: Tiptap JSON documents with
-- paragraphs, bold, italic, links and lists only (the admin server checks the structure before saving).
-- Text already saved is converted: an empty line starts a new paragraph.

create function public.plain_text_to_rich_text(p_text text)
returns jsonb
language sql
immutable
set search_path = ''
as $$
  select jsonb_build_object('type', 'doc', 'content', coalesce(
    (
      select jsonb_agg(
        jsonb_build_object('type', 'paragraph', 'content', jsonb_build_array(
          jsonb_build_object('type', 'text', 'text', regexp_replace(btrim(part), '\s*\n\s*', ' ', 'g'))
        ))
        order by n
      )
      from regexp_split_to_table(coalesce(p_text, ''), '\n\s*\n') with ordinality as s (part, n)
      where btrim(part) <> ''
    ),
    '[{"type": "paragraph"}]'::jsonb
  ));
$$;

-- 1. Introduction: text → JSON document.
alter table public.region_translations drop constraint region_translations_introduction_check;
alter table public.region_translations alter column introduction drop default;
alter table public.region_translations
  alter column introduction type jsonb using public.plain_text_to_rich_text(introduction);
alter table public.region_translations
  alter column introduction set default '{"type": "doc", "content": [{"type": "paragraph"}]}'::jsonb;
alter table public.region_translations add constraint region_translations_introduction_check
  check (jsonb_typeof(introduction) = 'object' and octet_length(introduction::text) <= 100000);

-- 2. Answers inside faqs: text → JSON document (questions stay plain text).
update public.region_translations t
set faqs = (
  select jsonb_agg(
    case
      when jsonb_typeof(faq -> 'answer') = 'string'
        then jsonb_set(faq, '{answer}', public.plain_text_to_rich_text(faq ->> 'answer'))
      else faq
    end
    order by n
  )
  from jsonb_array_elements(t.faqs) with ordinality as e (faq, n)
)
where jsonb_array_length(t.faqs) > 0;

alter table public.region_translations add constraint region_translations_faqs_size_check
  check (octet_length(faqs::text) <= 500000);

drop function public.plain_text_to_rich_text(text);

-- 3. save_region: the introduction is now JSON (-> instead of ->>). Otherwise unchanged.
create or replace function public.save_region(p_region_id uuid, p_locale text, p_region jsonb, p_text jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
  ratings public.month_rating[] := array(
    select jsonb_array_elements_text(p_region -> 'month_ratings')::public.month_rating
  );
begin
  if p_region_id is null then
    insert into public.regions (slug, district, latitude, longitude, month_ratings, updated_by)
    values (
      p_region ->> 'slug',
      p_region ->> 'district',
      (p_region ->> 'latitude')::numeric,
      (p_region ->> 'longitude')::numeric,
      ratings,
      auth.uid()
    )
    returning id into saved_id;
  else
    update public.regions
    set slug = p_region ->> 'slug',
        district = p_region ->> 'district',
        latitude = (p_region ->> 'latitude')::numeric,
        longitude = (p_region ->> 'longitude')::numeric,
        month_ratings = ratings,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_region_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Region not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.region_translations as t (
    region_id, locale, name, pin_label, tagline, introduction, best_for,
    highest_point, trek_length, difficulty, getting_there, getting_there_details, permits,
    season_spring, season_monsoon, season_autumn, season_winter, faqs,
    seo_keyword, seo_title, seo_description
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'pin_label', p_text ->> 'tagline', p_text -> 'introduction',
    array(select jsonb_array_elements_text(p_text -> 'best_for')),
    p_text ->> 'highest_point', p_text ->> 'trek_length', p_text ->> 'difficulty', p_text ->> 'getting_there',
    p_text ->> 'getting_there_details', p_text ->> 'permits',
    p_text ->> 'season_spring', p_text ->> 'season_monsoon', p_text ->> 'season_autumn', p_text ->> 'season_winter',
    p_text -> 'faqs', p_text ->> 'seo_keyword', p_text ->> 'seo_title', p_text ->> 'seo_description'
  )
  on conflict (region_id, locale) do update
  set name = excluded.name,
      pin_label = excluded.pin_label,
      tagline = excluded.tagline,
      introduction = excluded.introduction,
      best_for = excluded.best_for,
      highest_point = excluded.highest_point,
      trek_length = excluded.trek_length,
      difficulty = excluded.difficulty,
      getting_there = excluded.getting_there,
      getting_there_details = excluded.getting_there_details,
      permits = excluded.permits,
      season_spring = excluded.season_spring,
      season_monsoon = excluded.season_monsoon,
      season_autumn = excluded.season_autumn,
      season_winter = excluded.season_winter,
      faqs = excluded.faqs,
      seo_keyword = excluded.seo_keyword,
      seo_title = excluded.seo_title,
      seo_description = excluded.seo_description,
      updated_at = now();

  return saved_id;
end;
$$;
