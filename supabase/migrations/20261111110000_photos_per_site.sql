-- Photos per website (decided 2026-11-11, replaces "the Photos library stays one gallery for all websites"): each
-- photo belongs to one website, so Travel To Nepal's photos never end up on Manaslu Trek and back.
--
--   1. photos.site_id. Every place that shows a photo (a photo column, or a photoId inside a text) takes only its own
--      website's photos: the trigger check_photo_website (23503, like a missing photo). Regions and adventures are the
--      main site's. Uploads go to the website "Working on" shows; the "Choose a photo" window searches only its photos.
--   2. Existing photos: a photo used only by one region website moves to it; one used by Travel To Nepal (or by nothing)
--      stays on Travel To Nepal; one used by Travel To Nepal and a region website stays, and the region website gets
--      its own copy (a new library entry: photo_file_copies lists the files to copy, done by
--      apps/admin/scripts/copy-photo-files.mjs).
--   3. copy_trek leaves the photos behind: no cover, gallery, day photos or share photo, and no photos in the texts.

-- 1. Column -----------------------------------------------------------------------------------------------------------

alter table public.photos add column site_id text not null default 'ttn' references public.sites (id) on delete restrict;
create index photos_site_id_idx on public.photos (site_id);

-- 2. Existing photos --------------------------------------------------------------------------------------------------

-- Every place a photo is shown, with its website (read again at the end, to check nothing is mixed any more).
create temporary view photo_refs (photo_id, site_id) as
with main as (select s.id from public.sites s where s.kind = 'main')
  select t.cover_photo_id, t.site_id from public.treks t where t.cover_photo_id is not null
  union select tt.share_photo_id, t.site_id from public.trek_translations tt join public.treks t on t.id = tt.trek_id where tt.share_photo_id is not null
  union select ids.id, t.site_id from public.trek_translations tt join public.treks t on t.id = tt.trek_id
    cross join lateral public.photo_ids_in(to_jsonb(tt)) as ids (id)
  union select tp.photo_id, t.site_id from public.trek_photos tp join public.treks t on t.id = tp.trek_id
  union select d.photo_id, t.site_id from public.trek_days d join public.treks t on t.id = d.trek_id where d.photo_id is not null
  union select ids.id, t.site_id from public.trek_day_translations dt join public.trek_days d on d.id = dt.day_id
    join public.treks t on t.id = d.trek_id cross join lateral public.photo_ids_in(to_jsonb(dt)) as ids (id)
  union select a.cover_photo_id, a.site_id from public.articles a where a.cover_photo_id is not null
  union select at.share_photo_id, a.site_id from public.article_translations at join public.articles a on a.id = at.article_id where at.share_photo_id is not null
  union select ids.id, a.site_id from public.article_translations at join public.articles a on a.id = at.article_id
    cross join lateral public.photo_ids_in(to_jsonb(at)) as ids (id)
  union select ids.id, a.site_id from public.article_sections s join public.articles a on a.id = s.article_id
    cross join lateral public.photo_ids_in(to_jsonb(s)) as ids (id)
  union select ids.id, a.site_id from public.article_section_translations st join public.article_sections s on s.id = st.section_id
    join public.articles a on a.id = s.article_id cross join lateral public.photo_ids_in(to_jsonb(st)) as ids (id)
  union select sp.photo_id, a.site_id from public.article_section_photos sp join public.article_sections s on s.id = sp.section_id
    join public.articles a on a.id = s.article_id
  union select p.photo_id, p.site_id from public.site_pages p where p.photo_id is not null
  union select p.share_photo_id, p.site_id from public.site_pages p where p.share_photo_id is not null
  union select ids.id, p.site_id from public.site_pages p cross join lateral public.photo_ids_in(p.content) as ids (id)
  union select pp.photo_id, pp.site_id from public.site_page_photos pp
  union select x.photo_id, s.site_id from public.site_settings s
    cross join lateral (values (s.share_photo_id), (s.certificate_photo_id), (s.pan_certificate_photo_id)) as x (photo_id) where x.photo_id is not null
  union select r.photo_id, r.site_id from public.reviews r where r.photo_id is not null
  union select a.photo_id, a.site_id from public.authors a where a.photo_id is not null
  union select g.photo_id, g.site_id from public.trekking_guides g where g.photo_id is not null
  -- The main site's: regions and adventures.
  union select r.cover_photo_id, main.id from public.regions r, main where r.cover_photo_id is not null
  union select rp.photo_id, main.id from public.region_photos rp, main
  union select rt.share_photo_id, main.id from public.region_translations rt, main where rt.share_photo_id is not null
  union select ids.id, main.id from public.region_translations rt cross join lateral public.photo_ids_in(to_jsonb(rt)) as ids (id), main
  union select a.photo_id, main.id from public.adventures a, main where a.photo_id is not null
  union select ids.id, main.id from public.adventure_section s cross join lateral public.photo_ids_in(s.steps) as ids (id), main;

create temporary table photo_site_uses on commit drop as
select distinct r.photo_id, r.site_id from photo_refs r join public.photos p on p.id = r.photo_id;

-- Each region website's photo: the photo itself when only that website uses it (it moves), otherwise a new copy.
create temporary table photo_map on commit drop as
select u.photo_id as old_id, u.site_id,
  case when (select count(*) from photo_site_uses o where o.photo_id = u.photo_id) = 1 then u.photo_id else gen_random_uuid() end as new_id
from photo_site_uses u
where u.site_id <> (select s.id from public.sites s where s.kind = 'main');

update public.photos p set site_id = m.site_id from photo_map m where m.new_id = m.old_id and p.id = m.old_id;

insert into public.photos
select (jsonb_populate_record(null::public.photos, to_jsonb(p) || jsonb_build_object(
  'id', m.new_id, 'site_id', m.site_id, 'master_key', 'masters/' || m.new_id || '.jpg', 'created_at', now(), 'updated_at', now()
))).*
from photo_map m
join public.photos p on p.id = m.old_id
where m.new_id <> m.old_id;

-- The files a copy still needs (its sizes, share picture and master, copied from the source photo's), until
-- scripts/copy-photo-files.mjs has copied them. Internal: no admin or website reads it.
create table public.photo_file_copies (
  photo_id uuid primary key references public.photos (id) on delete cascade,
  source_id uuid not null references public.photos (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.photo_file_copies enable row level security;
revoke all on public.photo_file_copies from public, anon, authenticated;
grant select, delete on public.photo_file_copies to service_role;

insert into public.photo_file_copies (photo_id, source_id) select m.new_id, m.old_id from photo_map m where m.new_id <> m.old_id;

-- The region websites' photo columns now point to their own copies.
update public.treks t set cover_photo_id = m.new_id
from photo_map m where m.old_id = t.cover_photo_id and m.site_id = t.site_id and m.new_id <> m.old_id;
update public.trek_translations tt set share_photo_id = m.new_id
from public.treks t, photo_map m where t.id = tt.trek_id and m.old_id = tt.share_photo_id and m.site_id = t.site_id and m.new_id <> m.old_id;
update public.trek_photos tp set photo_id = m.new_id
from public.treks t, photo_map m where t.id = tp.trek_id and m.old_id = tp.photo_id and m.site_id = t.site_id and m.new_id <> m.old_id;
update public.trek_days d set photo_id = m.new_id
from public.treks t, photo_map m where t.id = d.trek_id and m.old_id = d.photo_id and m.site_id = t.site_id and m.new_id <> m.old_id;
update public.articles a set cover_photo_id = m.new_id
from photo_map m where m.old_id = a.cover_photo_id and m.site_id = a.site_id and m.new_id <> m.old_id;
update public.article_translations at set share_photo_id = m.new_id
from public.articles a, photo_map m where a.id = at.article_id and m.old_id = at.share_photo_id and m.site_id = a.site_id and m.new_id <> m.old_id;
update public.article_section_photos sp set photo_id = m.new_id
from public.article_sections s, public.articles a, photo_map m
where s.id = sp.section_id and a.id = s.article_id and m.old_id = sp.photo_id and m.site_id = a.site_id and m.new_id <> m.old_id;
update public.site_pages p set photo_id = m.new_id
from photo_map m where m.old_id = p.photo_id and m.site_id = p.site_id and m.new_id <> m.old_id;
update public.site_pages p set share_photo_id = m.new_id
from photo_map m where m.old_id = p.share_photo_id and m.site_id = p.site_id and m.new_id <> m.old_id;
update public.site_page_photos pp set photo_id = m.new_id
from photo_map m where m.old_id = pp.photo_id and m.site_id = pp.site_id and m.new_id <> m.old_id;
update public.site_settings s set share_photo_id = m.new_id
from photo_map m where m.old_id = s.share_photo_id and m.site_id = s.site_id and m.new_id <> m.old_id;
update public.site_settings s set certificate_photo_id = m.new_id
from photo_map m where m.old_id = s.certificate_photo_id and m.site_id = s.site_id and m.new_id <> m.old_id;
update public.site_settings s set pan_certificate_photo_id = m.new_id
from photo_map m where m.old_id = s.pan_certificate_photo_id and m.site_id = s.site_id and m.new_id <> m.old_id;
update public.reviews r set photo_id = m.new_id
from photo_map m where m.old_id = r.photo_id and m.site_id = r.site_id and m.new_id <> m.old_id;
update public.authors a set photo_id = m.new_id
from photo_map m where m.old_id = a.photo_id and m.site_id = a.site_id and m.new_id <> m.old_id;
update public.trekking_guides g set photo_id = m.new_id
from photo_map m where m.old_id = g.photo_id and m.site_id = g.site_id and m.new_id <> m.old_id;

-- …and the photos inside their texts (a photoId in a jsonb column). Repeated until nothing changes, as one update
-- swaps one photo per row.
do $$
declare
  col record;
  owner_sql text;
  changed integer;
begin
  for col in
    select c.table_name, c.column_name
    from information_schema.columns c
    where c.table_schema = 'public' and c.data_type = 'jsonb'
      and c.table_name in ('trek_translations', 'trek_day_translations', 'article_translations', 'article_sections', 'article_section_translations', 'site_pages')
  loop
    owner_sql := case col.table_name
      when 'trek_translations' then 'select t.site_id from public.treks t where t.id = x.trek_id'
      when 'trek_day_translations' then 'select t.site_id from public.trek_days d join public.treks t on t.id = d.trek_id where d.id = x.day_id'
      when 'article_translations' then 'select a.site_id from public.articles a where a.id = x.article_id'
      when 'article_sections' then 'select a.site_id from public.articles a where a.id = x.article_id'
      when 'article_section_translations' then 'select a.site_id from public.article_sections s join public.articles a on a.id = s.article_id where s.id = x.section_id'
      else 'select x.site_id'
    end;
    loop
      execute format(
        'update public.%1$I x set %2$I = replace(x.%2$I::text, m.old_id::text, m.new_id::text)::jsonb
         from photo_map m
         where m.new_id <> m.old_id and m.site_id = (%3$s) and x.%2$I::text like ''%%'' || m.old_id::text || ''%%''',
        col.table_name, col.column_name, owner_sql);
      get diagnostics changed = row_count;
      exit when changed = 0;
    end loop;
  end loop;
end;
$$;

-- 1 (cont.). Same-website rule ---------------------------------------------------------------------------------------

-- A row's website: its own site_id, its trek's, its travel guide's; regions and adventures are the main site's.
create function public.photo_owner_site(p_table text, p_row jsonb)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  case p_table
    when 'treks', 'articles', 'site_pages', 'site_page_photos', 'site_settings', 'reviews', 'authors', 'trekking_guides' then
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
      return (select s.id from public.sites s where s.kind = 'main');
  end case;
end;
$$;

-- Refuses a photo of another website in the row's photo columns (the trigger's arguments) or texts (photoId). A
-- photo id that isn't in the library is left to the foreign keys, as before.
create function public.check_photo_website()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  row_json jsonb := to_jsonb(new);
  owner text := public.photo_owner_site(tg_table_name, row_json);
begin
  if owner is not null and exists (
    select 1
    from (
      select (row_json ->> c)::uuid as id from unnest(tg_argv) as c where row_json ->> c is not null
      union
      select public.photo_ids_in(row_json)
    ) as ids
    join public.photos p on p.id = ids.id
    where p.site_id <> owner
  ) then
    raise exception 'This photo belongs to another website' using errcode = '23503';
  end if;
  return new;
end;
$$;

revoke execute on function public.photo_owner_site(text, jsonb) from public, anon, authenticated;
revoke execute on function public.check_photo_website() from public, anon, authenticated;

create trigger treks_photos_same_website before insert or update on public.treks
  for each row execute function public.check_photo_website('cover_photo_id');
create trigger trek_translations_photos_same_website before insert or update on public.trek_translations
  for each row execute function public.check_photo_website('share_photo_id');
create trigger trek_photos_same_website before insert or update on public.trek_photos
  for each row execute function public.check_photo_website('photo_id');
create trigger trek_days_photos_same_website before insert or update on public.trek_days
  for each row execute function public.check_photo_website('photo_id');
create trigger trek_day_translations_photos_same_website before insert or update on public.trek_day_translations
  for each row execute function public.check_photo_website();
create trigger articles_photos_same_website before insert or update on public.articles
  for each row execute function public.check_photo_website('cover_photo_id');
create trigger article_translations_photos_same_website before insert or update on public.article_translations
  for each row execute function public.check_photo_website('share_photo_id');
create trigger article_sections_photos_same_website before insert or update on public.article_sections
  for each row execute function public.check_photo_website();
create trigger article_section_translations_photos_same_website before insert or update on public.article_section_translations
  for each row execute function public.check_photo_website();
create trigger article_section_photos_same_website before insert or update on public.article_section_photos
  for each row execute function public.check_photo_website('photo_id');
create trigger site_pages_photos_same_website before insert or update on public.site_pages
  for each row execute function public.check_photo_website('photo_id', 'share_photo_id');
create trigger site_page_photos_same_website before insert or update on public.site_page_photos
  for each row execute function public.check_photo_website('photo_id');
create trigger site_settings_photos_same_website before insert or update on public.site_settings
  for each row execute function public.check_photo_website('share_photo_id', 'certificate_photo_id', 'pan_certificate_photo_id');
create trigger reviews_photos_same_website before insert or update on public.reviews
  for each row execute function public.check_photo_website('photo_id');
create trigger authors_photos_same_website before insert or update on public.authors
  for each row execute function public.check_photo_website('photo_id');
create trigger trekking_guides_photos_same_website before insert or update on public.trekking_guides
  for each row execute function public.check_photo_website('photo_id');
create trigger regions_photos_same_website before insert or update on public.regions
  for each row execute function public.check_photo_website('cover_photo_id');
create trigger region_translations_photos_same_website before insert or update on public.region_translations
  for each row execute function public.check_photo_website('share_photo_id');
create trigger region_photos_same_website before insert or update on public.region_photos
  for each row execute function public.check_photo_website('photo_id');
create trigger adventures_photos_same_website before insert or update on public.adventures
  for each row execute function public.check_photo_website('photo_id');
create trigger adventure_section_photos_same_website before insert or update on public.adventure_section
  for each row execute function public.check_photo_website();

-- Nothing is mixed any more (else the migration stops here and changes nothing).
do $$
begin
  if exists (select 1 from photo_refs r join public.photos p on p.id = r.photo_id where p.site_id <> r.site_id) then
    raise exception 'A photo is still shown on another website than its own';
  end if;
end;
$$;

drop view photo_refs;

-- The "Choose a photo" window and the same-name question: the website's photos only.
drop function public.search_library_photos(text, uuid, uuid, integer, integer);

CREATE FUNCTION public.search_library_photos(p_query text DEFAULT ''::text, p_region_id uuid DEFAULT NULL::uuid, p_trek_id uuid DEFAULT NULL::uuid, p_limit integer DEFAULT 40, p_offset integer DEFAULT 0, p_site_id text DEFAULT 'ttn'::text)
 RETURNS TABLE(id uuid, width integer, height integer, variant_widths integer[], file_name text, placeholder text, place text, alt_text text, description text, original_name text, use_count integer)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
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
        and p.site_id = p_site_id
        and (btrim(coalesce(p_query, '')) = ''
          or p.place ilike pattern.value
          or p.alt_text ilike pattern.value
          or p.description ilike pattern.value
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
         page.alt_text, page.description, page.original_name, coalesce(counts.use_count, 0)
  from page left join counts on counts.photo_id = page.id
  order by page.created_at desc, page.id;
$function$;

revoke execute on function public.search_library_photos(text, uuid, uuid, integer, integer, text) from public, anon;
grant execute on function public.search_library_photos(text, uuid, uuid, integer, integer, text) to authenticated, service_role;

drop function public.photos_named(text[]);

CREATE FUNCTION public.photos_named(p_names text[], p_site_id text DEFAULT 'ttn'::text)
 RETURNS TABLE(id uuid, width integer, height integer, variant_widths integer[], file_name text, placeholder text, place text, alt_text text, description text, original_name text)
 LANGUAGE sql
 STABLE
 SET search_path TO ''
AS $function$
  select p.id, p.width, p.height, p.variant_widths, p.file_name, p.placeholder, p.place, p.alt_text, p.description,
         p.original_name
  from public.photos p
  where cardinality(p.variant_widths) > 0
    and p.site_id = p_site_id
    and lower(p.original_name) in (select lower(btrim(n)) from unnest(p_names) as n)
  order by p.created_at desc;
$function$;

revoke execute on function public.photos_named(text[], text) from public, anon;
grant execute on function public.photos_named(text[], text) to authenticated, service_role;

-- 3. copy_trek: the photos stay behind ------------------------------------------------------------------------------

-- A text without its photos: image blocks are dropped and any other photoId (a topic's photo) is emptied.
create function public.without_photos(p_value jsonb)
returns jsonb
language plpgsql
immutable
set search_path = ''
as $$
declare
  result jsonb;
begin
  case jsonb_typeof(p_value)
    when 'array' then
      select coalesce(jsonb_agg(public.without_photos(a.item) order by a.n), '[]'::jsonb) into result
      from jsonb_array_elements(p_value) with ordinality as a (item, n)
      where not (jsonb_typeof(a.item) = 'object' and a.item ->> 'type' = 'image');
      return result;
    when 'object' then
      select coalesce(jsonb_object_agg(e.key, case when e.key = 'photoId' then 'null'::jsonb else public.without_photos(e.value) end), '{}'::jsonb) into result
      from jsonb_each(p_value) as e;
      return result;
    else
      return p_value;
  end case;
end;
$$;

revoke execute on function public.without_photos(jsonb) from public, anon;
grant execute on function public.without_photos(jsonb) to authenticated;

CREATE OR REPLACE FUNCTION public.copy_trek(p_trek_id uuid, p_site_id text)
 RETURNS uuid
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  source public.treks%rowtype;
  new_id uuid := gen_random_uuid();
  new_slug text;
  n integer := 1;
  -- Old id → new id of the days and the group prices, so their texts follow them.
  day_ids jsonb;
  price_ids jsonb;
begin
  select * into source from public.treks where id = p_trek_id and site_id = 'ttn';
  if not found then
    raise exception 'No such trek on Travel To Nepal' using errcode = 'P0002';
  end if;
  if not exists (select 1 from public.sites s where s.id = p_site_id and s.kind = 'region') then
    raise exception 'Treks are copied to a region website' using errcode = '22023';
  end if;

  new_slug := source.slug;
  while exists (select 1 from public.treks t where t.site_id = p_site_id and t.slug = new_slug) loop
    n := n + 1;
    new_slug := left(source.slug, 76) || '-' || n;
  end loop;

  -- Every column as it is (new columns too), but these. Runs as the admin: Row Level Security applies. The photos are
  -- Travel To Nepal's, so they stay behind (20261111110000_photos_per_site.sql): the region website adds its own.
  insert into public.treks
  select (jsonb_populate_record(null::public.treks, to_jsonb(source) || jsonb_build_object(
    'id', new_id, 'site_id', p_site_id, 'slug', new_slug, 'status', 'draft', 'published_at', null, 'pdf_map_path', null,
    'cover_photo_id', null, 'created_at', now(), 'updated_at', now(), 'updated_by', auth.uid()
  ))).*;

  insert into public.trek_translations
  select (jsonb_populate_record(null::public.trek_translations, public.without_photos(to_jsonb(t)) || jsonb_build_object(
    'trek_id', new_id, 'canonical_path', '', 'hide_from_google', false, 'share_photo_id', null, 'updated_at', now()
  ))).*
  from public.trek_translations t where t.trek_id = p_trek_id;

  -- Days and group prices get new ids; their texts follow them.
  select coalesce(jsonb_object_agg(d.id, gen_random_uuid()), '{}') into day_ids from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_days
  select (jsonb_populate_record(null::public.trek_days, to_jsonb(d) || jsonb_build_object('id', day_ids -> d.id::text, 'trek_id', new_id, 'photo_id', null))).*
  from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_day_translations
  select (jsonb_populate_record(null::public.trek_day_translations, public.without_photos(to_jsonb(dt)) || jsonb_build_object('day_id', day_ids -> dt.day_id::text))).*
  from public.trek_day_translations dt where day_ids ? dt.day_id::text;

  select coalesce(jsonb_object_agg(p.id, gen_random_uuid()), '{}') into price_ids from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_prices
  select (jsonb_populate_record(null::public.trek_group_prices, to_jsonb(p) || jsonb_build_object('id', price_ids -> p.id::text, 'trek_id', new_id))).*
  from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_price_translations
  select (jsonb_populate_record(null::public.trek_group_price_translations, to_jsonb(pt) || jsonb_build_object('price_id', price_ids -> pt.price_id::text))).*
  from public.trek_group_price_translations pt where price_ids ? pt.price_id::text;

  insert into public.trek_regions (trek_id, region_id, position) select new_id, region_id, position from public.trek_regions where trek_id = p_trek_id;
  -- The trek's guides and photos stay behind: they belong to Travel To Nepal.

  return new_id;
end;
$function$;
