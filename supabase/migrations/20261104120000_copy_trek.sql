-- "Copy a trek from Travel To Nepal" (decided 2026-11-04): a region website gets a trek by copying the values of one
-- of Travel To Nepal's treks, to save typing. The copy is a new trek with new ids for everything (the trek, its days,
-- group prices…) and no link back: afterwards the two are unrelated, and the copy's words are rewritten.
--
-- Copied: the trek's fields, its English and other texts, days with their texts, group prices with their texts,
-- gallery photos, the regions on the route and the trekking guides (library photos, videos and guides are shared
-- items, so the copy points to the same ones). Not copied: similar treks (Travel To Nepal's), old departure dates,
-- the printable PDF map (a file belongs to one trek: replacing it deletes it), the canonical address and "Hide from
-- Google". The copy is a draft; its web address is the original's, or with "-2", "-3"… when that is taken there.

create function public.copy_trek(p_trek_id uuid, p_site_id text)
returns uuid
language plpgsql
set search_path = ''
as $$
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

  -- Every column as it is (new columns too), but these. Runs as the admin: Row Level Security applies.
  insert into public.treks
  select (jsonb_populate_record(null::public.treks, to_jsonb(source) || jsonb_build_object(
    'id', new_id, 'site_id', p_site_id, 'slug', new_slug, 'status', 'draft', 'published_at', null, 'pdf_map_path', null,
    'created_at', now(), 'updated_at', now(), 'updated_by', auth.uid()
  ))).*;

  insert into public.trek_translations
  select (jsonb_populate_record(null::public.trek_translations, to_jsonb(t) || jsonb_build_object(
    'trek_id', new_id, 'canonical_path', '', 'hide_from_google', false, 'updated_at', now()
  ))).*
  from public.trek_translations t where t.trek_id = p_trek_id;

  -- Days and group prices get new ids; their texts follow them.
  select coalesce(jsonb_object_agg(d.id, gen_random_uuid()), '{}') into day_ids from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_days
  select (jsonb_populate_record(null::public.trek_days, to_jsonb(d) || jsonb_build_object('id', day_ids -> d.id::text, 'trek_id', new_id))).*
  from public.trek_days d where d.trek_id = p_trek_id;
  insert into public.trek_day_translations
  select (jsonb_populate_record(null::public.trek_day_translations, to_jsonb(dt) || jsonb_build_object('day_id', day_ids -> dt.day_id::text))).*
  from public.trek_day_translations dt where day_ids ? dt.day_id::text;

  select coalesce(jsonb_object_agg(p.id, gen_random_uuid()), '{}') into price_ids from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_prices
  select (jsonb_populate_record(null::public.trek_group_prices, to_jsonb(p) || jsonb_build_object('id', price_ids -> p.id::text, 'trek_id', new_id))).*
  from public.trek_group_prices p where p.trek_id = p_trek_id;
  insert into public.trek_group_price_translations
  select (jsonb_populate_record(null::public.trek_group_price_translations, to_jsonb(pt) || jsonb_build_object('price_id', price_ids -> pt.price_id::text))).*
  from public.trek_group_price_translations pt where price_ids ? pt.price_id::text;

  insert into public.trek_photos (trek_id, photo_id, position) select new_id, photo_id, position from public.trek_photos where trek_id = p_trek_id;
  insert into public.trek_regions (trek_id, region_id, position) select new_id, region_id, position from public.trek_regions where trek_id = p_trek_id;
  insert into public.trek_guides (trek_id, guide_id, position) select new_id, guide_id, position from public.trek_guides where trek_id = p_trek_id;

  return new_id;
end;
$$;

revoke execute on function public.copy_trek(uuid, text) from public, anon;
grant execute on function public.copy_trek(uuid, text) to authenticated;
