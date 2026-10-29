-- Custom structured data (decided 2026-10-29): the SEO person adds their own schema.org JSON-LD blocks to any page,
-- several per page, on top of what the website writes by itself (TravelAgency, breadcrumbs, TouristTrip, FAQ…).
-- Edited in the admin's Structured data screen (Super admins save); the website reads web_page_schemas.

create table public.page_schemas (
  id uuid primary key default gen_random_uuid(),
  -- The page it is on: exactly one of these (a fixed page, a trek, a region or a travel guide).
  site_page_slug text references public.site_pages (slug) on delete cascade,
  trek_id uuid references public.treks (id) on delete cascade,
  region_id uuid references public.regions (id) on delete cascade,
  article_id uuid references public.articles (id) on delete cascade,
  -- Order on the page, 1 first.
  position smallint not null check (position between 1 and 20),
  -- For the admin only, e.g. "Everest video".
  label text not null check (char_length(btrim(label)) between 1 and 80),
  -- One schema.org object ("@type") or a group ("@graph"), without "@context": the website adds it.
  data jsonb not null check (
    jsonb_typeof(data) = 'object' and (data ? '@type' or data ? '@graph') and octet_length(data::text) <= 30000
  ),
  is_shown boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  check (num_nonnulls(site_page_slug, trek_id, region_id, article_id) = 1),
  unique nulls not distinct (site_page_slug, trek_id, region_id, article_id, position)
);

create index page_schemas_trek_id_idx on public.page_schemas (trek_id);
create index page_schemas_region_id_idx on public.page_schemas (region_id);
create index page_schemas_article_id_idx on public.page_schemas (article_id);

alter table public.page_schemas enable row level security;

grant select, insert, delete on public.page_schemas to authenticated;

create policy "Admins read page schemas" on public.page_schemas for select to authenticated using ((select public.is_admin()));
create policy "Super admins add page schemas" on public.page_schemas for insert to authenticated with check ((select public.is_super_admin()));
create policy "Super admins remove page schemas" on public.page_schemas for delete to authenticated using ((select public.is_super_admin()));

-- Replaces one page's blocks with p_schemas ([{ label, data, is_shown }], in order), as the admin (Row Level
-- Security applies). p_page_kind: 'page' (p_page_key a site page slug), 'trek', 'region' or 'guide' (an id).
create function public.save_page_schemas(p_page_kind text, p_page_key text, p_schemas jsonb)
returns void
language plpgsql
set search_path = ''
as $$
declare
  v_site_page text := case when p_page_kind = 'page' then p_page_key end;
  v_trek uuid := case when p_page_kind = 'trek' then p_page_key::uuid end;
  v_region uuid := case when p_page_kind = 'region' then p_page_key::uuid end;
  v_article uuid := case when p_page_kind = 'guide' then p_page_key::uuid end;
begin
  if num_nonnulls(v_site_page, v_trek, v_region, v_article) <> 1 then
    raise exception 'Unknown page %', p_page_kind using errcode = '22023';
  end if;

  delete from public.page_schemas s
  where s.site_page_slug is not distinct from v_site_page
    and s.trek_id is not distinct from v_trek
    and s.region_id is not distinct from v_region
    and s.article_id is not distinct from v_article;

  -- A page that no longer exists fails here (foreign key, 23503).
  insert into public.page_schemas (site_page_slug, trek_id, region_id, article_id, position, label, data, is_shown, updated_by)
  select v_site_page, v_trek, v_region, v_article, item.position::smallint, item.value ->> 'label', item.value -> 'data',
    (item.value ->> 'is_shown')::boolean, auth.uid()
  from jsonb_array_elements(p_schemas) with ordinality as item(value, position);
end;
$$;

revoke execute on function public.save_page_schemas(text, text, jsonb) from public, anon;
grant execute on function public.save_page_schemas(text, text, jsonb) to authenticated;

-- The blocks the website shows, for pages it shows: page_kind 'page' | 'trek' | 'region' | 'guide' and the page's
-- slug today (a renamed trek keeps its blocks).
create view public.web_page_schemas as
select 'page'::text as page_kind, s.site_page_slug as page_slug, s.position, s.data
from public.page_schemas s
where s.is_shown and s.site_page_slug is not null
union all
select 'trek', t.slug, s.position, s.data
from public.page_schemas s
join public.treks t on t.id = s.trek_id
where s.is_shown and exists (select 1 from public.web_trek_pages w where w.id = t.id)
union all
select 'region', r.slug, s.position, s.data
from public.page_schemas s
join public.regions r on r.id = s.region_id
where s.is_shown and exists (select 1 from public.web_region_pages w where w.id = r.id)
union all
select 'guide', a.slug, s.position, s.data
from public.page_schemas s
join public.articles a on a.id = s.article_id
where s.is_shown and exists (select 1 from public.web_travel_guide_pages w where w.id = a.id);

revoke all on public.web_page_schemas from public, authenticated;
grant select on public.web_page_schemas to anon;
