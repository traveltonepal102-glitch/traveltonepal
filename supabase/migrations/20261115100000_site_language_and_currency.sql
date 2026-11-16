-- One language and one currency per website (decided 2026-11-15). Editors type a website's content in its language,
-- prices are typed in its currency, and the website writes its own fixed words in that language. Annapurna Trekking is
-- German with euro prices; Travel To Nepal and Manaslu Trek stay English with US dollars. Both are chosen in Sites
-- by a Super admin and are locked once the website is live (its addresses and content are then in that language).

alter table public.sites
  add column language text not null default 'en' check (language in ('en', 'de')),
  add column currency text not null default 'USD' check (currency in ('USD', 'EUR'));

update public.sites set language = 'de', currency = 'EUR' where id = 'annapurna';

-- The language and currency of a website, for views and functions. Security definer: views read them as the visitor
-- (anon), who may not read the sites table. Unknown site: English and dollars, like the main site.
create function public.site_language(p_site_id text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select s.language from public.sites s where s.id = p_site_id), 'en');
$$;

create function public.site_currency(p_site_id text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((select s.currency from public.sites s where s.id = p_site_id), 'USD');
$$;

revoke execute on function public.site_language(text) from public;
revoke execute on function public.site_currency(text) from public;
grant execute on function public.site_language(text) to anon, authenticated, service_role;
grant execute on function public.site_currency(text) to anon, authenticated, service_role;

-- save_site: a new website takes its language and currency (default English and dollars); an edit may change them
-- only while the website is not live.
create or replace function public.save_site(p_site_id text, p_site jsonb)
returns text
language plpgsql
set search_path = ''
as $$
declare
  saved_id text;
  current_site public.sites%rowtype;
begin
  if p_site_id is null then
    insert into public.sites (id, kind, region_id, name, url, position, language, currency, updated_by)
    values (
      p_site ->> 'id',
      'region',
      (p_site ->> 'region_id')::uuid,
      p_site ->> 'name',
      nullif(p_site ->> 'url', ''),
      coalesce((select max(s.position) from public.sites s), 0) + 1,
      coalesce(nullif(p_site ->> 'language', ''), 'en'),
      coalesce(nullif(p_site ->> 'currency', ''), 'USD'),
      auth.uid()
    )
    returning id into saved_id;
    return saved_id;
  end if;

  select * into current_site from public.sites where id = p_site_id;
  if not found then
    raise exception 'Site not found' using errcode = 'P0002';
  end if;
  if current_site.is_live and (
    coalesce(nullif(p_site ->> 'language', ''), current_site.language) <> current_site.language
    or coalesce(nullif(p_site ->> 'currency', ''), current_site.currency) <> current_site.currency
  ) then
    raise exception 'The language and currency of a live website can''t change' using errcode = '22023';
  end if;

  update public.sites
  set name = p_site ->> 'name',
      url = nullif(p_site ->> 'url', ''),
      is_live = case when kind = 'main' then true else (p_site ->> 'is_live')::boolean end,
      language = coalesce(nullif(p_site ->> 'language', ''), language),
      currency = coalesce(nullif(p_site ->> 'currency', ''), currency),
      updated_at = now(),
      updated_by = auth.uid()
  where id = p_site_id
  returning id into saved_id;
  return saved_id;
end;
$$;

-- web_site: the website asking, now with its language and currency (at the end, so running websites keep working).
create or replace view public.web_site as
 SELECT s.id,
    s.kind,
    s.name,
    s.url,
    s.is_live,
    r.slug AS region_slug,
    t.slug AS home_trek_slug,
    s.language,
    s.currency
   FROM sites s
     LEFT JOIN regions r ON r.id = s.region_id
     LEFT JOIN treks t ON t.id = s.home_trek_id AND t.status = 'published'::trek_status AND (EXISTS ( SELECT 1
           FROM trek_days d
          WHERE d.trek_id = t.id))
  WHERE s.id = web_site_id();
