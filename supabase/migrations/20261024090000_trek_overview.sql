-- Treks, step 2a: the Overview and highlights section (data shape: the website's trek page).
-- introduction: rich text (src/lib/richText), the first paragraph shows until "Read more".
-- highlights / suitability_points: [{ "title", "text" }] in display order ("Is this trek for you?").

alter table public.trek_translations
  add column introduction jsonb not null default '{"type": "doc", "content": [{"type": "paragraph"}]}'
    check (jsonb_typeof(introduction) = 'object' and octet_length(introduction::text) <= 100000),
  add column highlights_heading text not null default '' check (char_length(highlights_heading) <= 160),
  add column highlights jsonb not null default '[]'
    check (jsonb_typeof(highlights) = 'array' and jsonb_array_length(highlights) <= 10),
  add column suitability_intro text not null default '' check (char_length(suitability_intro) <= 300),
  add column suitability_points jsonb not null default '[]'
    check (jsonb_typeof(suitability_points) = 'array' and jsonb_array_length(suitability_points) <= 10);

-- save_trek also saves the overview text. Otherwise unchanged.
create or replace function public.save_trek(p_trek_id uuid, p_locale text, p_trek jsonb, p_text jsonb, p_photos jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
  region uuid := (p_trek ->> 'region_id')::uuid;
begin
  if jsonb_array_length(p_photos -> 'gallery') > 30 then
    raise exception 'A trek can have up to 30 gallery photos' using errcode = '22023';
  end if;

  if p_trek_id is null then
    insert into public.treks (
      slug, region_id, status, difficulty, grade, days, max_altitude_m, distance_km,
      seasons, tags, is_popular, cover_photo_id, updated_by
    )
    values (
      p_trek ->> 'slug', region, (p_trek ->> 'status')::public.trek_status,
      (p_trek ->> 'difficulty')::public.trek_difficulty, (p_trek ->> 'grade')::smallint,
      (p_trek ->> 'days')::smallint, (p_trek ->> 'max_altitude_m')::integer, (p_trek ->> 'distance_km')::integer,
      array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
      array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
      (p_trek ->> 'is_popular')::boolean, nullif(p_trek ->> 'cover_photo_id', '')::uuid, auth.uid()
    )
    returning id into saved_id;
  else
    update public.treks
    set slug = p_trek ->> 'slug',
        region_id = region,
        status = (p_trek ->> 'status')::public.trek_status,
        difficulty = (p_trek ->> 'difficulty')::public.trek_difficulty,
        grade = (p_trek ->> 'grade')::smallint,
        days = (p_trek ->> 'days')::smallint,
        max_altitude_m = (p_trek ->> 'max_altitude_m')::integer,
        distance_km = (p_trek ->> 'distance_km')::integer,
        seasons = array(select jsonb_array_elements_text(p_trek -> 'seasons')::public.trek_season),
        tags = array(select jsonb_array_elements_text(p_trek -> 'tags')::public.trek_tag),
        is_popular = (p_trek ->> 'is_popular')::boolean,
        cover_photo_id = nullif(p_trek ->> 'cover_photo_id', '')::uuid,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_trek_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Trek not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.trek_translations as t (
    trek_id, locale, name, summary, card_badge, photo_badges,
    start_finish, daily_walking, guide_ratio, season_label, accommodation, transport,
    introduction, highlights_heading, highlights, suitability_intro, suitability_points
  )
  values (
    saved_id, p_locale, p_text ->> 'name', p_text ->> 'summary', p_text ->> 'card_badge', p_text -> 'photo_badges',
    p_text ->> 'start_finish', p_text ->> 'daily_walking', p_text ->> 'guide_ratio', p_text ->> 'season_label',
    p_text ->> 'accommodation', p_text ->> 'transport',
    p_text -> 'introduction', p_text ->> 'highlights_heading', p_text -> 'highlights',
    p_text ->> 'suitability_intro', p_text -> 'suitability_points'
  )
  on conflict (trek_id, locale) do update
  set name = excluded.name,
      summary = excluded.summary,
      card_badge = excluded.card_badge,
      photo_badges = excluded.photo_badges,
      start_finish = excluded.start_finish,
      daily_walking = excluded.daily_walking,
      guide_ratio = excluded.guide_ratio,
      season_label = excluded.season_label,
      accommodation = excluded.accommodation,
      transport = excluded.transport,
      introduction = excluded.introduction,
      highlights_heading = excluded.highlights_heading,
      highlights = excluded.highlights,
      suitability_intro = excluded.suitability_intro,
      suitability_points = excluded.suitability_points,
      updated_at = now();

  update public.photos p
  set place = d.place,
      region_id = coalesce(p.region_id, region),
      updated_at = now()
  from jsonb_to_recordset(p_photos -> 'details') as d (id uuid, place text)
  where p.id = d.id;

  delete from public.trek_photos where trek_id = saved_id;
  insert into public.trek_photos (trek_id, photo_id, position)
  select saved_id, g.photo_id::uuid, (g.n - 1)::smallint
  from jsonb_array_elements_text(p_photos -> 'gallery') with ordinality as g (photo_id, n);

  return saved_id;
end;
$$;

-- Langtang Valley's overview, as on the website (apps/web/src/features/trek-detail/content/langtangValley.ts).
update public.trek_translations t
set introduction = '{"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "text": "The Langtang Valley Trek is the closest big-mountain trek to Kathmandu, and one of the most rewarding. A scenic drive takes you to Syabrubesi (1,503 m), where the trail follows the Langtang Khola through bamboo, oak and rhododendron forest, past yak pastures and Tamang villages, to Kyanjin Gompa (3,870 m): a monastery village ringed by glaciers. From there a sunrise climb of Kyanjin Ri (4,773 m) puts you face to face with Langtang Lirung (7,227 m)."}]}, {"type": "paragraph", "content": [{"type": "text", "text": "Daily stages are short and the ascent is gradual, so it suits first-time trekkers as well as experienced walkers. You spend two nights at Kyanjin Gompa, with a free day for Kyanjin Ri or the longer climb to Tserko Ri (4,984 m), and sleep in family-run teahouses along the way."}]}]}',
    highlights_heading = 'Langtang Trek highlights and why you will love this trek',
    highlights = '[
  {
    "title": "Kyanjin Ri sunrise (4,773 m / 15,659 ft)",
    "text": "An early hike to the best viewpoint in the valley, with Langtang Lirung (7,227 m) and its glaciers right in front of you."
  },
  {
    "title": "Kyanjin Gompa monastery village (3,870 m)",
    "text": "A Buddhist monastery, prayer wheels and mani walls at the head of the valley, with two nights to explore."
  },
  {
    "title": "Tamang culture and hospitality",
    "text": "Stone villages, teahouses run by Tamang families and a culture closely linked to Tibet."
  },
  {
    "title": "Forest to glacier in four days",
    "text": "From bamboo and rhododendron forest to high yak pastures and glacial moraines."
  },
  {
    "title": "Yak cheese and local food",
    "text": "Visit the cheese factory at Kyanjin and taste fresh yak cheese and butter tea."
  },
  {
    "title": "Close to Kathmandu, no flights",
    "text": "A scenic drive to the trailhead means no weather delays on mountain flights."
  }
]',
    suitability_intro = 'An honest checklist from our guides to help you prepare and decide if the Langtang Valley suits your goals.',
    suitability_points = '[
  {
    "title": "Physical demands and fitness",
    "text": "5 to 7 hours of walking a day on mountain trails with a light daypack (4–6 kg). Moderate stamina is enough."
  },
  {
    "title": "Altitude and acclimatization",
    "text": "You sleep no higher than 3,870 m and day hike to 4,773 m. Suitable for anyone in good health."
  },
  {
    "title": "Technical skill required",
    "text": "None. Trails, stone steps and some moraine. No ropes, crampons or climbing gear."
  },
  {
    "title": "Trail comfort and accommodation",
    "text": "Simple family-run teahouses with shared dining rooms and twin rooms. Not luxury hotels."
  },
  {
    "title": "Mental resilience",
    "text": "Be ready for changing mountain weather and cold nights below freezing at Kyanjin."
  },
  {
    "title": "Medical conditions",
    "text": "With heart or lung conditions or severe asthma, speak to your doctor before booking."
  }
]'
from public.treks k
where k.id = t.trek_id and k.slug = 'langtang-valley' and t.locale = 'en';
