-- Custom adventures (decided 2026-10-28; design: Main.dc.html, "Tell us your dream Nepal adventure"): a home page
-- section of experiences beyond trekking (honey hunting, rafting…) that we plan on request. No page of their own:
-- each is a card in a carousel, and visitors ask on WhatsApp or by email. Edited in the admin's Adventures screen:
-- the section's own words (one row) and the cards (add, edit, remove; "Show on website" hides one).
-- The website reads web_adventure_section and web_adventures.

-- The section's words, one row, filled with the design's text.
create table public.adventure_section (
  id boolean primary key default true check (id),
  eyebrow text not null check (char_length(btrim(eyebrow)) between 1 and 60),
  heading text not null check (char_length(btrim(heading)) between 1 and 120),
  intro text not null default '' check (char_length(intro) <= 400),
  -- The carousel's last card: "Something else in mind?" with WhatsApp and email buttons.
  ask_title text not null check (char_length(btrim(ask_title)) between 1 and 60),
  ask_text text not null default '' check (char_length(ask_text) <= 240),
  -- "How it works": exactly 3 of { "title", "text" }.
  steps_title text not null check (char_length(btrim(steps_title)) between 1 and 60),
  steps jsonb not null check (jsonb_typeof(steps) = 'array' and jsonb_array_length(steps) = 3),
  -- The yellow note under the steps ('' leaves it out).
  note text not null default '' check (char_length(note) <= 300),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

insert into public.adventure_section (eyebrow, heading, intro, ask_title, ask_text, steps_title, steps, note) values (
  'Beyond the trekking trail',
  'Tell us your dream Nepal adventure. We''ll make it happen.',
  'Some of Nepal''s best experiences aren''t available online. Tell us the adventure or trek you have in mind, and we''ll plan it for you. It''s part of how we help you see Nepal in a new way.',
  'Something else in mind?',
  'Festivals, paragliding, monastery stays, or a route you read about years ago. Tell us, and we''ll tell you honestly if it''s possible.',
  'How it works',
  '[
    {"title": "Tell us your idea", "text": "Send a message on WhatsApp or email with what you want to do and when."},
    {"title": "We check what''s possible", "text": "We talk to local guides and communities, then send you an honest plan and price."},
    {"title": "We plan it around you", "text": "Change dates, pace, or add a trek. We adjust until it fits."}
  ]'::jsonb,
  'Some experiences depend on season, weather and local permission. If something isn''t possible or isn''t right for the place, we''ll tell you before you book.'
);

-- One card each. A card shows on the website only with a photo.
create table public.adventures (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(btrim(title)) between 1 and 60),
  -- The orange tag on the photo, e.g. "Lamjung · Spring and autumn" ('' leaves it out).
  tag text not null default '' check (char_length(tag) <= 40),
  summary text not null check (char_length(btrim(summary)) between 1 and 240),
  photo_id uuid references public.photos (id) on delete restrict,
  -- What the photo shows, for screen readers and Google ('' uses the title).
  photo_alt text not null default '' check (char_length(photo_alt) <= 160),
  -- Place in the carousel, 1 first.
  position smallint not null default 1 check (position between 1 and 99),
  is_shown boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  check (not is_shown or photo_id is not null)
);

create index adventures_photo_id_idx on public.adventures (photo_id);

-- The design's five, hidden until a photo is picked for each.
insert into public.adventures (title, tag, summary, photo_alt, position) values
  ('Wild honey hunting', 'Lamjung · Spring and autumn',
   'Watch Gurung honey hunters harvest cliff honey with rope ladders and bamboo poles, a tradition passed down for generations.',
   'A honey hunter on a rope ladder harvesting cliff honey', 1),
  ('Red panda tracking', 'Eastern Nepal · Spring',
   'Walk quiet forests with a local tracker to look for red pandas in the bamboo, far from the main trekking routes.',
   'A red panda climbing along a tree branch', 2),
  ('Himalayan bird watching', 'Nationwide · Year-round',
   'Nepal has over 850 bird species. We pair you with a birding guide and plan your route around the birds you want to see.',
   'A Himalayan monal, Nepal''s national bird', 3),
  ('Rock climbing', 'Near Kathmandu · Oct–May',
   'Climb limestone crags a short drive from Kathmandu, with routes for beginners and experienced climbers.',
   'A climber on a limestone rock face', 4),
  ('White water rafting', 'Trishuli River · Sep–May',
   'Run rapids on the Trishuli or Bhote Koshi, from a half-day trip near Kathmandu to multi-day runs with riverside camping.',
   'A raft crew paddling through white water rapids', 5);

alter table public.adventure_section enable row level security;
alter table public.adventures enable row level security;

grant select, update on public.adventure_section to authenticated;
grant select, insert, update, delete on public.adventures to authenticated;

create policy "Admins read the adventures section" on public.adventure_section for select to authenticated using ((select public.is_admin()));
create policy "Admins edit the adventures section" on public.adventure_section
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

create policy "Admins read adventures" on public.adventures for select to authenticated using ((select public.is_admin()));
create policy "Admins add adventures" on public.adventures for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit adventures" on public.adventures
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Super admins remove adventures" on public.adventures for delete to authenticated using ((select public.is_super_admin()));

-- Saves the section's words (as the admin: Row Level Security applies).
create function public.save_adventure_section(p_section jsonb)
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
  where id;
  if not found then
    raise exception 'Adventures section not found' using errcode = 'P0002';
  end if;
end;
$$;

-- Adds (p_adventure_id null) or updates one card; returns its id. Raises P0002 for a card that no longer exists.
create function public.save_adventure(p_adventure_id uuid, p_adventure jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
begin
  if p_adventure_id is null then
    insert into public.adventures (title, tag, summary, photo_id, photo_alt, position, is_shown, updated_by)
    values (
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
  where id = p_adventure_id
  returning id into saved_id;

  if saved_id is null then
    raise exception 'Adventure not found' using errcode = 'P0002';
  end if;
  return saved_id;
end;
$$;

revoke execute on function public.save_adventure_section(jsonb), public.save_adventure(uuid, jsonb) from public, anon;
grant execute on function public.save_adventure_section(jsonb), public.save_adventure(uuid, jsonb) to authenticated;

-- The section's words, for the website.
create view public.web_adventure_section as
select s.eyebrow, s.heading, s.intro, s.ask_title, s.ask_text, s.steps_title, s.steps, s.note
from public.adventure_section s;

-- The cards the website shows, in carousel order, with their photo.
create view public.web_adventures as
select
  a.id,
  a.title,
  a.tag,
  a.summary,
  a.photo_alt,
  a.position,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.adventures a
join public.photos p on p.id = a.photo_id
where a.is_shown;

revoke all on public.web_adventure_section, public.web_adventures from public, authenticated;
grant select on public.web_adventure_section, public.web_adventures to anon;
