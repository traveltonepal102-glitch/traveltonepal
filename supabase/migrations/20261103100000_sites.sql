-- Sites (decided 2026-11-01 and 2026-11-02): the main site (traveltonepal.com) and the optional region sites, each
-- built from the same website code with its own SITE_ID (the row's id) and its own Vercel project. The admin's
-- "Working on" switcher lists them and Super admins add region sites (Sites › Add a site). Nothing else belongs
-- to a site yet: the content tables get their site_id in the next migrations.

create table public.sites (
  -- The website's SITE_ID: lowercase letters and digits with single dashes (@ttn/config/sites SITE_ID_PATTERN).
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(id) between 2 and 40),
  kind text not null check (kind in ('main', 'region')),
  -- A region site's region (one site per region); null for the main site.
  region_id uuid unique references public.regions (id) on delete restrict,
  -- The brand name; the switcher's tile shows its initials ("Manaslu Trek" → "MT").
  name text not null check (char_length(btrim(name)) between 1 and 60),
  -- The website's address without a path, e.g. https://manaslutrek.com; null until the domain is set up.
  url text unique check (url ~ '^https://[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$'),
  -- Off: the website tells Google to stay away (noindex) and is only for checking.
  is_live boolean not null default false,
  -- Order in the switcher, 1 first.
  position smallint not null default 1 check (position between 1 and 99),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  check ((kind = 'main') = (region_id is null)),
  check (not is_live or url is not null)
);

-- Exactly one main site.
create unique index sites_one_main_idx on public.sites (kind) where kind = 'main';

insert into public.sites (id, kind, name, url, is_live, position)
values ('ttn', 'main', 'Travel To Nepal', 'https://traveltonepal.com', true, 1);

alter table public.sites enable row level security;

grant select, insert, update on public.sites to authenticated;

create policy "Admins read sites" on public.sites for select to authenticated using ((select public.is_admin()));
create policy "Super admins add sites" on public.sites for insert to authenticated with check ((select public.is_super_admin()));
create policy "Super admins edit sites" on public.sites
  for update to authenticated using ((select public.is_super_admin())) with check ((select public.is_super_admin()));

-- Adds a region site (p_site_id null) or updates one; returns its id. The id, kind and region never change
-- (the website's SITE_ID and every address depend on them). Runs as the admin: Row Level Security applies.
create function public.save_site(p_site_id text, p_site jsonb)
returns text
language plpgsql
set search_path = ''
as $$
declare
  saved_id text;
begin
  if p_site_id is null then
    insert into public.sites (id, kind, region_id, name, url, position, updated_by)
    values (
      p_site ->> 'id',
      'region',
      (p_site ->> 'region_id')::uuid,
      p_site ->> 'name',
      nullif(p_site ->> 'url', ''),
      coalesce((select max(s.position) from public.sites s), 0) + 1,
      auth.uid()
    )
    returning id into saved_id;
    return saved_id;
  end if;

  update public.sites
  set name = p_site ->> 'name',
      url = nullif(p_site ->> 'url', ''),
      is_live = (p_site ->> 'is_live')::boolean,
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_site_id
  returning id into saved_id;

  if saved_id is null then
    raise exception 'Site not found' using errcode = 'P0002';
  end if;
  return saved_id;
end;
$$;

revoke execute on function public.save_site(text, jsonb) from public, anon;
grant execute on function public.save_site(text, jsonb) to authenticated;
