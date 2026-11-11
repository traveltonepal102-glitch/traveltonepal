-- Adventures per website (decided 2026-11-11): each website has its own adventure cards and section words, edited in
-- its own Adventures screen (now in a region website's menu too). Travel To Nepal keeps the ones it has; a region
-- website starts with no cards, so its home page leaves the section out until it shows one, and with the design's
-- words for the section (made with the website, like its settings).

-- Cards ---------------------------------------------------------------------------------------------------------------

alter table public.adventures add column site_id text not null default 'ttn' references public.sites (id) on delete restrict;
create index adventures_site_id_idx on public.adventures (site_id, position);

-- Section words: one row per website --------------------------------------------------------------------------------

alter table public.adventure_section add column site_id text not null default 'ttn' references public.sites (id) on delete cascade;
alter table public.adventure_section drop constraint adventure_section_pkey;
alter table public.adventure_section drop column id;
alter table public.adventure_section add primary key (site_id);

-- The design's words (Main.dc.html, "Tell us your dream Nepal adventure"), for a website that has none yet.
create function public.add_adventure_section(p_site_id text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.adventure_section (site_id, eyebrow, heading, intro, ask_title, ask_text, steps_title, steps, note) values (
    p_site_id,
    'Beyond the trekking trail',
    'Tell us your dream Nepal adventure. We''ll make it happen.',
    'Some of Nepal''s best experiences aren''t available online. Tell us the adventure or trek you have in mind, and we''ll plan it for you.',
    'Something else in mind?',
    'Festivals, paragliding, monastery stays, or a route you read about years ago. Tell us, and we''ll tell you honestly if it''s possible.',
    'How it works',
    '[
      {"title": "Tell us your idea", "text": "Send a message on WhatsApp or email with what you want to do and when."},
      {"title": "We check what''s possible", "text": "We talk to local guides and communities, then send you an honest plan and price."},
      {"title": "We plan it around you", "text": "Change dates, pace, or add a trek. We adjust until it fits."}
    ]'::jsonb,
    'Some experiences depend on season, weather and local permission. If something isn''t possible or isn''t right for the place, we''ll tell you before you book.'
  )
  on conflict (site_id) do nothing;
$$;

create function public.create_adventure_section()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform public.add_adventure_section(new.id);
  return new;
end;
$$;

revoke execute on function public.add_adventure_section(text), public.create_adventure_section() from public, anon, authenticated;

create trigger sites_create_adventure_section after insert on public.sites for each row execute function public.create_adventure_section();

-- The region websites added before this migration get theirs now.
select public.add_adventure_section(s.id) from public.sites s where s.id <> 'ttn';

-- Saves ---------------------------------------------------------------------------------------------------------------

drop function public.save_adventure_section(jsonb);

-- Saves the words of website p_site_id's section (as the admin: Row Level Security applies).
create function public.save_adventure_section(p_section jsonb, p_site_id text default 'ttn')
returns void
language plpgsql
set search_path = ''
as $$
begin
  update public.adventure_section
  set eyebrow = p_section ->> 'eyebrow',
      heading = p_section ->> 'heading',
      intro = p_section ->> 'intro',
      ask_title = p_section ->> 'ask_title',
      ask_text = p_section ->> 'ask_text',
      steps_title = p_section ->> 'steps_title',
      steps = p_section -> 'steps',
      note = p_section ->> 'note',
      updated_at = now(),
      updated_by = auth.uid()
  where site_id = p_site_id;
  if not found then
    raise exception 'Adventures section not found' using errcode = 'P0002';
  end if;
end;
$$;

revoke execute on function public.save_adventure_section(jsonb, text) from public, anon;
grant execute on function public.save_adventure_section(jsonb, text) to authenticated;

-- Adds (p_adventure_id null) a card to the website p_adventure.site_id, or updates one of that website's cards; returns
-- its id. Raises P0002 for a card that no longer exists (or is another website's).
CREATE OR REPLACE FUNCTION public.save_adventure(p_adventure_id uuid, p_adventure jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  saved_id uuid;
  site text := coalesce(nullif(p_adventure ->> 'site_id', ''), 'ttn');
begin
  if p_adventure_id is null then
    insert into public.adventures (site_id, title, tag, summary, photo_id, photo_alt, position, is_shown, updated_by)
    values (
      site,
      p_adventure ->> 'title',
      p_adventure ->> 'tag',
      p_adventure ->> 'summary',
      nullif(p_adventure ->> 'photo_id', '')::uuid,
      p_adventure ->> 'photo_alt',
      (p_adventure ->> 'position')::smallint,
      (p_adventure ->> 'is_shown')::boolean,
      auth.uid()
    )
    returning id into saved_id;
    return saved_id;
  end if;

  update public.adventures
  set title = p_adventure ->> 'title',
      tag = p_adventure ->> 'tag',
      summary = p_adventure ->> 'summary',
      photo_id = nullif(p_adventure ->> 'photo_id', '')::uuid,
      photo_alt = p_adventure ->> 'photo_alt',
      position = (p_adventure ->> 'position')::smallint,
      is_shown = (p_adventure ->> 'is_shown')::boolean,
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_adventure_id and site_id = site
  returning id into saved_id;

  if saved_id is null then
    raise exception 'Adventure not found' using errcode = 'P0002';
  end if;
  return saved_id;
end;
$function$;

-- Photos: an adventure's photo is its own website's now (was the main site's, 20261111110000_photos_per_site.sql).
CREATE OR REPLACE FUNCTION public.photo_owner_site(p_table text, p_row jsonb)
 RETURNS text
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  case p_table
    when 'treks', 'articles', 'site_pages', 'site_page_photos', 'site_settings', 'reviews', 'authors', 'trekking_guides',
         'adventures', 'adventure_section' then
      return p_row ->> 'site_id';
    when 'trek_translations', 'trek_photos', 'trek_days' then
      return (select t.site_id from public.treks t where t.id = (p_row ->> 'trek_id')::uuid);
    when 'trek_day_translations' then
      return (select t.site_id from public.trek_days d join public.treks t on t.id = d.trek_id where d.id = (p_row ->> 'day_id')::uuid);
    when 'article_translations', 'article_sections' then
      return (select a.site_id from public.articles a where a.id = (p_row ->> 'article_id')::uuid);
    when 'article_section_translations', 'article_section_photos' then
      return (select a.site_id from public.article_sections s join public.articles a on a.id = s.article_id where s.id = (p_row ->> 'section_id')::uuid);
    else
      -- Regions are the main site's.
      return (select s.id from public.sites s where s.kind = 'main');
  end case;
end;
$function$;

-- The website's views: each website its own ------------------------------------------------------------------------

create or replace view public.web_adventure_section as
 SELECT s.eyebrow,
    s.heading,
    s.intro,
    s.ask_title,
    s.ask_text,
    s.steps_title,
    s.steps,
    s.note
   FROM adventure_section s
  WHERE s.site_id = web_site_id();

create or replace view public.web_adventures as
 SELECT a.id,
    a.title,
    a.tag,
    a.summary,
    a.photo_alt,
    a."position",
    p.id AS cover_id,
    p.width AS cover_width,
    p.height AS cover_height,
    p.variant_widths AS cover_variant_widths,
    p.placeholder AS cover_placeholder,
    p.place AS cover_place,
    p.file_name AS cover_file_name,
    p.alt_text AS cover_alt_text,
    p.description AS cover_caption
   FROM adventures a
     JOIN photos p ON p.id = a.photo_id
  WHERE a.is_shown AND a.site_id = web_site_id();
