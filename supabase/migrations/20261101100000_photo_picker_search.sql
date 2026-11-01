-- The admin's "Choose a photo" window searches the whole library a page at a time (it used to get only the newest
-- 120 photos, so older ones were uploaded again), and an upload first asks whether a photo with the same file
-- name is already in it. Both run as the signed-in admin (RLS: admins read photos).

-- One page of ready photos (with sizes), newest first: those whose place, file name or uploaded file name contain
-- p_query, tagged with p_region_id, or that trek p_trek_id uses as cover or in its gallery. use_count is how many
-- places use the photo (public.photo_uses), worked out once for the page.
create function public.search_library_photos(
  p_query text default '',
  p_region_id uuid default null,
  p_trek_id uuid default null,
  p_limit integer default 40,
  p_offset integer default 0
)
returns table (
  id uuid, width integer, height integer, variant_widths integer[], file_name text, placeholder text, place text,
  original_name text, use_count integer
)
language sql
stable
set search_path = ''
as $$
  with
    pattern as (
      -- % and _ in what was typed are searched for as themselves.
      select '%' || replace(replace(replace(btrim(coalesce(p_query, '')), '\', '\\'), '%', '\%'), '_', '\_') || '%' as value
    ),
    trek_photo_ids as (
      select t.cover_photo_id as photo_id from public.treks t where t.id = p_trek_id and t.cover_photo_id is not null
      union
      select tp.photo_id from public.trek_photos tp where tp.trek_id = p_trek_id
    ),
    page as (
      select p.*
      from public.photos p, pattern
      where cardinality(p.variant_widths) > 0
        and (btrim(coalesce(p_query, '')) = ''
          or p.place ilike pattern.value
          or p.file_name ilike pattern.value
          or p.original_name ilike pattern.value)
        and (p_region_id is null or p.region_id = p_region_id)
        and (p_trek_id is null or p.id in (select photo_id from trek_photo_ids))
      order by p.created_at desc, p.id
      limit least(greatest(p_limit, 1), 100)
      offset greatest(p_offset, 0)
    ),
    counts as (
      select u.photo_id, count(*)::integer as use_count
      from public.photo_uses() u
      where u.photo_id in (select page.id from page)
      group by u.photo_id
    )
  select page.id, page.width, page.height, page.variant_widths, page.file_name, page.placeholder, page.place,
         page.original_name, coalesce(counts.use_count, 0)
  from page left join counts on counts.photo_id = page.id
  order by page.created_at desc, page.id;
$$;

-- Library photos uploaded from a file with one of these names (letter case ignored), newest first.
create function public.photos_named(p_names text[])
returns table (
  id uuid, width integer, height integer, variant_widths integer[], file_name text, placeholder text, place text,
  original_name text
)
language sql
stable
set search_path = ''
as $$
  select p.id, p.width, p.height, p.variant_widths, p.file_name, p.placeholder, p.place, p.original_name
  from public.photos p
  where cardinality(p.variant_widths) > 0
    and lower(p.original_name) in (select lower(btrim(n)) from unnest(p_names) as n)
  order by p.created_at desc;
$$;

revoke execute on function public.search_library_photos(text, uuid, uuid, integer, integer) from public, anon;
revoke execute on function public.photos_named(text[]) from public, anon;
grant execute on function public.search_library_photos(text, uuid, uuid, integer, integer) to authenticated;
grant execute on function public.photos_named(text[]) to authenticated;
