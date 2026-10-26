-- Pages (design: Admin-pages): the fixed pages of the website, one row each. Every page has the same top
-- (label, H1, text under it) and Google result (title, description, main keyword); `content` holds what only that
-- page has (About: story, milestones, promises; Contact: reply times, next steps, FAQ, time zones), checked by
-- the admin's zod schema before saving and again by the website when it reads it.
-- The rows exist from the start (seeded below with the website's current text): admins edit them, never add or
-- remove one. About and Contact first; the list and legal pages follow.

create table public.site_pages (
  slug text primary key
    check (slug in ('about', 'contact', 'home', 'treks', 'regions', 'travel-guides', 'terms', 'privacy', 'impressum', 'cookies')),
  -- Small label above the H1, e.g. "About Travel To Nepal".
  eyebrow text not null default '' check (char_length(eyebrow) <= 80),
  heading text not null check (char_length(heading) between 1 and 140),
  intro text not null default '' check (char_length(intro) <= 600),
  seo_title text not null default '' check (char_length(seo_title) <= 80),
  seo_description text not null default '' check (char_length(seo_description) <= 200),
  seo_keyword text not null default '' check (char_length(seo_keyword) <= 80),
  -- The photo behind the top of the page (About, Contact).
  photo_id uuid references public.photos (id) on delete restrict,
  -- About: the founder, an office author (name, job title and photo come from Authors).
  founder_author_id uuid references public.authors (id) on delete restrict,
  content jsonb not null default '{}' check (jsonb_typeof(content) = 'object' and octet_length(content::text) <= 100000),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index site_pages_photo_id_idx on public.site_pages (photo_id);
create index site_pages_founder_author_id_idx on public.site_pages (founder_author_id);

-- About › Our story: up to three photos beside the story, in order.
create table public.site_page_photos (
  page_slug text not null references public.site_pages (slug) on delete cascade,
  position smallint not null check (position between 1 and 3),
  photo_id uuid not null references public.photos (id) on delete restrict,
  primary key (page_slug, position)
);

create index site_page_photos_photo_id_idx on public.site_page_photos (photo_id);

alter table public.site_pages enable row level security;
alter table public.site_page_photos enable row level security;

grant select, update on public.site_pages to authenticated;
grant select, insert, delete on public.site_page_photos to authenticated;

create policy "Admins read pages" on public.site_pages for select to authenticated using ((select public.is_admin()));
create policy "Admins edit pages" on public.site_pages
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins read page photos" on public.site_page_photos for select to authenticated using ((select public.is_admin()));
create policy "Admins add page photos" on public.site_page_photos for insert to authenticated with check ((select public.is_admin()));
create policy "Admins remove page photos" on public.site_page_photos for delete to authenticated using ((select public.is_admin()));

-- Saves one page's form in one transaction (as the admin, Row Level Security on). p_photo_ids: the story photos in
-- order (at most three are kept).
create function public.save_site_page(p_slug text, p_page jsonb, p_photo_ids jsonb)
returns void
language plpgsql
set search_path = ''
as $$
declare
  founder uuid := nullif(p_page ->> 'founder_author_id', '')::uuid;
begin
  if founder is not null and not exists (select 1 from public.authors where id = founder and kind = 'office') then
    raise exception 'founder_kind' using errcode = '22023';
  end if;

  update public.site_pages
  set eyebrow = p_page ->> 'eyebrow',
      heading = p_page ->> 'heading',
      intro = p_page ->> 'intro',
      seo_title = p_page ->> 'seo_title',
      seo_description = p_page ->> 'seo_description',
      seo_keyword = p_page ->> 'seo_keyword',
      photo_id = nullif(p_page ->> 'photo_id', '')::uuid,
      founder_author_id = founder,
      content = p_page -> 'content',
      updated_at = now(),
      updated_by = auth.uid()
  where slug = p_slug;

  if not found then
    raise exception 'Not allowed to change this page' using errcode = '42501';
  end if;

  delete from public.site_page_photos where page_slug = p_slug;
  insert into public.site_page_photos (page_slug, position, photo_id)
  select p_slug, n, photo_id::uuid
  from jsonb_array_elements_text(p_photo_ids) with ordinality as p (photo_id, n)
  where n <= 3;
end;
$$;

revoke all on function public.save_site_page(text, jsonb, jsonb) from public, anon;
grant execute on function public.save_site_page(text, jsonb, jsonb) to authenticated;

-- What the website shows of each page, with its photos joined. The founder shows with photo only when they agreed.
create view public.web_site_pages as
select
  s.slug,
  s.eyebrow,
  s.heading,
  s.intro,
  s.seo_title,
  s.seo_description,
  s.seo_keyword,
  s.content,
  s.updated_at,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place,
  fa.name as founder_name,
  ft.job_title as founder_role,
  case when fa.photo_consent then fp.id end as founder_photo_id,
  case when fa.photo_consent then fp.variant_widths end as founder_photo_variant_widths,
  case when fa.photo_consent then fp.placeholder end as founder_photo_placeholder,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'id', sp.id, 'width', sp.width, 'height', sp.height, 'variant_widths', sp.variant_widths,
          'placeholder', sp.placeholder, 'place', sp.place
        )
        order by pp.position
      )
      from public.site_page_photos pp
      join public.photos sp on sp.id = pp.photo_id
      where pp.page_slug = s.slug
    ),
    '[]'::jsonb
  ) as story_photos
from public.site_pages s
left join public.photos p on p.id = s.photo_id
left join public.authors fa on fa.id = s.founder_author_id
left join public.author_translations ft on ft.author_id = fa.id and ft.locale = 'en'
left join public.photos fp on fp.id = fa.photo_id;

-- About › "Our guides and team": office authors and trekking guides with "Show on the About page" ticked who agreed
-- to be shown, office first, then guides by experience.
create view public.web_about_team as
select
  'office' as team_group,
  a.id,
  a.name,
  t.job_title as role,
  'Kathmandu office' as place,
  '{}'::text[] as languages,
  0 as sort_group,
  0 as years_guiding,
  p.id as cover_id,
  p.width as cover_width,
  p.height as cover_height,
  p.variant_widths as cover_variant_widths,
  p.placeholder as cover_placeholder,
  p.place as cover_place
from public.authors a
join public.author_translations t on t.author_id = a.id and t.locale = 'en'
left join public.photos p on p.id = a.photo_id
where a.kind = 'office' and a.show_on_about and a.photo_consent
union all
select
  'guides',
  g.id,
  g.name,
  gt.role,
  concat_ws(', ', nullif(g.home_village, ''), nullif(g.home_district, '')),
  g.languages,
  1,
  coalesce(g.years_guiding, 0),
  p.id,
  p.width,
  p.height,
  p.variant_widths,
  p.placeholder,
  p.place
from public.trekking_guides g
join public.trekking_guide_translations gt on gt.guide_id = g.id and gt.locale = 'en'
left join public.photos p on p.id = g.photo_id
where g.show_on_about and g.photo_consent;

revoke all on public.web_site_pages, public.web_about_team from public, authenticated;
grant select on public.web_site_pages, public.web_about_team to anon;

-- The website's current text, so nothing changes until an admin edits it.
insert into public.site_pages (slug, eyebrow, heading, intro, seo_title, seo_description, seo_keyword, content) values
(
  'about',
  'About Travel To Nepal',
  'A Nepali team that plans every trek as if it were for family',
  'We are a licensed trekking company in Kathmandu. Our guides grew up in the valleys they lead, and the person who plans your trek on WhatsApp is the same team that looks after you on the trail.',
  'About us: a licensed Nepali trekking company in Kathmandu',
  'Meet the Kathmandu team and local guides behind Travel To Nepal: our story, what we promise on every trek, our licences, and how we look after porters and villages.',
  'Nepali trekking company',
  $json${
    "trekkersGuided": "",
    "storyHeading": "Born in the mountains, built in Kathmandu",
    "storyTeaser": "Born and raised in the mountains of Nepal, our founder grew up walking Himalayan trails with the elders of his village. That lifelong respect for the mountains became the foundation of Travel To Nepal.",
    "story": [
      "Our founder grew up in a mountain village, walking the trails between villages and high pastures long before he guided his first trekkers. He learned the routes, the weather and the teahouse families from the elders, and spent his first seasons as a porter and then a licensed guide.",
      "He started Travel To Nepal to give trekkers an honest local contact from the first message to the last day: no foreign middlemen, fair pay and proper gear for every guide and porter, and treks planned around the people who walk them."
    ],
    "quote": "I look after every trekker as if they were my own family, because in the mountains, that is what you are.",
    "milestones": [
      { "year": "", "title": "Founded in Kathmandu", "text": "Our founder starts Travel To Nepal with a small team of guides from his home region." },
      { "year": "", "title": "Licensed and registered", "text": "Registered with the Department of Tourism and a member of TAAN." },
      { "year": "", "title": "More regions, more guides", "text": "Treks across Nepal with guides from each valley." },
      { "year": "Today", "title": "One small team", "text": "Every trek planned personally on WhatsApp, from first message to last day." }
    ],
    "promises": [
      { "icon": "shield_person", "title": "Local guides from each valley", "text": "Licensed guides who grew up in the region they lead and know the teahouse families by name." },
      { "icon": "price_check", "title": "Clear prices, no surprises", "text": "Everything included is listed before you book. Meals are paid on the trail at real menu prices." },
      { "icon": "health_and_safety", "title": "Safety on every trek", "text": "Daily oxygen and pulse checks, a first-aid kit, and rescue coordinated from Kathmandu." },
      { "icon": "tune", "title": "Your trek, your dates", "text": "Every trek is private. Change the pace, days or route; we rewrite the plan for free." },
      { "icon": "chat", "title": "A real person on WhatsApp", "text": "You plan with our team directly, before, during and after your trek." },
      { "icon": "volunteer_activism", "title": "Fair to porters and villages", "text": "Weight limits, warm gear, insurance and fair pay for every person on your team." }
    ]
  }$json$::jsonb
),
(
  'contact',
  '',
  'Talk to a local trekking expert',
  'Ask anything, from “which trek suits me?” to permits and prices. A real person from our Kathmandu team replies, usually within a few hours. It is free, with no obligation to book.',
  'Contact us: talk to a local trekking expert',
  'Ask our Kathmandu team anything about trekking in Nepal on WhatsApp or by email. A real person replies, usually within a few hours. Free, with no obligation to book.',
  'contact Nepal trekking company',
  $json${
    "replyTimes": { "whatsApp": "Usually replies within a few hours", "email": "Reply within 24 hours" },
    "officeDirections": "",
    "nextSteps": [
      { "when": "Today", "title": "You send us a message", "text": "Tell us your dates, group size and what you would like to see. Questions only are fine too." },
      { "when": "Within a few hours", "title": "We reply with a plan and price", "text": "A local expert suggests the right trek, a day-by-day itinerary and a clear price for your group." },
      { "when": "When you are ready", "title": "Confirm with a 10% deposit", "text": "We book permits, transport, guides and lodges. Change the plan for free until it is right." }
    ],
    "faqs": [
      { "question": "How quickly do you reply?", "answer": "On WhatsApp usually within a few hours during Nepal office hours, and by email within 24 hours." },
      { "question": "Does it cost anything to ask?", "answer": "No. Questions, suggestions and itineraries are free, with no obligation to book." },
      { "question": "Do you store my details?", "answer": "This website does not store your message. It opens WhatsApp or your email app, and we only use your details to reply to you." },
      { "question": "Can we talk on a call?", "answer": "Yes. Ask on WhatsApp and we will set up a voice or video call at a time that suits you." },
      { "question": "I am already in Kathmandu. Can I visit?", "answer": "Of course. Drop by the office during opening hours, or message us and we will meet you." }
    ],
    "timeZones": ["Europe/Berlin", "Europe/London", "America/New_York"]
  }$json$::jsonb
);
