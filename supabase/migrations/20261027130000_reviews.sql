-- Reviews (decided 2026-10-27): real reviews from Google (or Tripadvisor), copied word for word in the admin, each
-- with the link to the original. The admin picks which ones the website shows (is_shown); nothing is ever written
-- here that the reviewer didn't write. The overall rating per source ("4.9 from 37 reviews") is typed in by the
-- admin, from the review site's own numbers. The website reads web_reviews and web_review_ratings.

create type public.review_source as enum ('google', 'tripadvisor');

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  source public.review_source not null default 'google',
  -- The review itself on the review site ("Share review" link), opened from the website.
  url text not null unique check (url ~ '^https://' and char_length(url) <= 500),
  reviewer_name text not null check (char_length(btrim(reviewer_name)) between 1 and 80),
  -- Google doesn't show where reviewers are from: '' leaves it out.
  reviewer_country text not null default '' check (char_length(reviewer_country) <= 60),
  rating smallint not null check (rating between 1 and 5),
  -- Tripadvisor reviews have a title, Google reviews don't.
  title text not null default '' check (char_length(title) <= 120),
  quote text not null check (char_length(btrim(quote)) between 1 and 1500),
  reviewed_on date not null,
  -- The trek it is about (shown on that trek's page); null: about the company.
  trek_id uuid references public.treks (id) on delete set null,
  is_shown boolean not null default false,
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index reviews_trek_id_idx on public.reviews (trek_id);

-- The overall rating on a review site, as that site shows it. No row: not shown.
create table public.review_ratings (
  source public.review_source primary key,
  rating numeric(2, 1) not null check (rating between 1 and 5),
  review_count integer not null check (review_count between 1 and 100000),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.reviews enable row level security;
alter table public.review_ratings enable row level security;

grant select, insert, update, delete on public.reviews, public.review_ratings to authenticated;

create policy "Admins read reviews" on public.reviews for select to authenticated using ((select public.is_admin()));
create policy "Admins add reviews" on public.reviews for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit reviews" on public.reviews
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Super admins remove reviews" on public.reviews for delete to authenticated using ((select public.is_super_admin()));

create policy "Admins read review ratings" on public.review_ratings for select to authenticated using ((select public.is_admin()));
create policy "Admins add review ratings" on public.review_ratings for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit review ratings" on public.review_ratings
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove review ratings" on public.review_ratings for delete to authenticated using ((select public.is_admin()));

-- Adds (p_review_id null) or updates one review; returns its id. Raises P0002 for a review that no longer exists.
create or replace function public.save_review(p_review_id uuid, p_review jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
begin
  if p_review_id is null then
    insert into public.reviews (source, url, reviewer_name, reviewer_country, rating, title, quote, reviewed_on, trek_id, is_shown, updated_by)
    values (
      (p_review ->> 'source')::public.review_source,
      p_review ->> 'url',
      p_review ->> 'reviewer_name',
      p_review ->> 'reviewer_country',
      (p_review ->> 'rating')::smallint,
      p_review ->> 'title',
      p_review ->> 'quote',
      (p_review ->> 'reviewed_on')::date,
      nullif(p_review ->> 'trek_id', '')::uuid,
      (p_review ->> 'is_shown')::boolean,
      auth.uid()
    )
    returning id into saved_id;
    return saved_id;
  end if;

  update public.reviews
  set source = (p_review ->> 'source')::public.review_source,
      url = p_review ->> 'url',
      reviewer_name = p_review ->> 'reviewer_name',
      reviewer_country = p_review ->> 'reviewer_country',
      rating = (p_review ->> 'rating')::smallint,
      title = p_review ->> 'title',
      quote = p_review ->> 'quote',
      reviewed_on = (p_review ->> 'reviewed_on')::date,
      trek_id = nullif(p_review ->> 'trek_id', '')::uuid,
      is_shown = (p_review ->> 'is_shown')::boolean,
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_review_id
  returning id into saved_id;

  if saved_id is null then
    raise exception 'Review not found' using errcode = 'P0002';
  end if;
  return saved_id;
end;
$$;

-- Replaces the overall ratings: [{ source, rating, review_count }]; a source left out is no longer shown.
create or replace function public.save_review_ratings(p_ratings jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  delete from public.review_ratings
  where source not in (select (item ->> 'source')::public.review_source from jsonb_array_elements(p_ratings) item);

  insert into public.review_ratings (source, rating, review_count, updated_by)
  select (item ->> 'source')::public.review_source, (item ->> 'rating')::numeric, (item ->> 'review_count')::integer, auth.uid()
  from jsonb_array_elements(p_ratings) item
  on conflict (source) do update
  set rating = excluded.rating,
      review_count = excluded.review_count,
      updated_at = now(),
      updated_by = excluded.updated_by;
end;
$$;

revoke execute on function public.save_review(uuid, jsonb), public.save_review_ratings(jsonb) from public, anon;
grant execute on function public.save_review(uuid, jsonb), public.save_review_ratings(jsonb) to authenticated;

-- The reviews the admin chose to show, newest first, with the trek's name and address while the trek is published
-- (a review of a hidden trek still shows, as a review of the company).
create view public.web_reviews as
select
  r.id,
  r.source,
  r.url,
  r.reviewer_name,
  r.reviewer_country,
  r.rating,
  r.title,
  r.quote,
  r.reviewed_on,
  tr.slug as trek_slug,
  t.name as trek_name
from public.reviews r
left join public.treks tr on tr.id = r.trek_id and tr.status = 'published'
left join public.trek_translations t on t.trek_id = tr.id and t.locale = 'en'
where r.is_shown;

-- The overall ratings, with the review site's profile from Site settings (the badge links there).
create view public.web_review_ratings as
select
  rr.source,
  rr.rating,
  rr.review_count,
  case rr.source when 'google' then s.google_business_url when 'tripadvisor' then s.tripadvisor_url end as profile_url
from public.review_ratings rr
cross join public.site_settings s;

revoke all on public.web_reviews, public.web_review_ratings from public, authenticated;
grant select on public.web_reviews, public.web_review_ratings to anon;
