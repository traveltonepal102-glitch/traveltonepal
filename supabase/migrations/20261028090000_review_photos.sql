-- Reviews › Reviewer photo (decided 2026-10-28): a review may show the reviewer's photo, saved in the photo library
-- (uploads lose their location data and get the website's sizes). Without one, the website shows their initial.

alter table public.reviews add column photo_id uuid references public.photos (id) on delete set null;

create index reviews_photo_id_idx on public.reviews (photo_id);

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
    insert into public.reviews (source, url, reviewer_name, reviewer_country, rating, title, quote, reviewed_on, trek_id, is_shown, photo_id, updated_by)
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
      nullif(p_review ->> 'photo_id', '')::uuid,
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
      photo_id = nullif(p_review ->> 'photo_id', '')::uuid,
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

create or replace view public.web_reviews as
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
  t.name as trek_name,
  -- Added later: a view only grows at the end.
  p.id as photo_id,
  p.variant_widths as photo_variant_widths,
  p.placeholder as photo_placeholder
from public.reviews r
left join public.treks tr on tr.id = r.trek_id and tr.status = 'published'
left join public.trek_translations t on t.trek_id = tr.id and t.locale = 'en'
left join public.photos p on p.id = r.photo_id
where r.is_shown;

