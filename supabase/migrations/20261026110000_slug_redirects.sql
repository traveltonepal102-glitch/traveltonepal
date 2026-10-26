-- Redirects when an address changes (TRD: "redirects are created automatically when a slug changes"). When a trek,
-- region or travel guide gets a new slug, its old address answers with a permanent redirect to the new one, so links
-- and Google rankings to the old address keep working.

-- One row per old address, pointing at the thing itself (not at a slug), so renaming twice still lands on today's
-- address. Only the triggers below write it; nobody reads it directly (the website reads web_redirects).
create table public.slug_redirects (
  kind text not null check (kind in ('trek', 'region', 'guide')),
  old_slug text not null check (char_length(old_slug) between 1 and 100),
  target_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (kind, old_slug)
);

alter table public.slug_redirects enable row level security;

-- After a save: remember the old slug when it changed, and forget a redirect whose old address is in use again.
-- Runs as its owner, so the admin's own rights (Row Level Security) don't need to cover this table.
create function public.remember_old_slug()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  redirect_kind text := tg_argv[0];
begin
  if tg_op = 'UPDATE' and new.slug is distinct from old.slug then
    insert into public.slug_redirects (kind, old_slug, target_id)
    values (redirect_kind, old.slug, new.id)
    on conflict (kind, old_slug) do update set target_id = excluded.target_id, created_at = now();
  end if;

  delete from public.slug_redirects where kind = redirect_kind and old_slug = new.slug;
  return new;
end;
$$;

revoke all on function public.remember_old_slug() from public, anon, authenticated;

create trigger treks_remember_old_slug
after insert or update of slug on public.treks
for each row execute function public.remember_old_slug('trek');

create trigger regions_remember_old_slug
after insert or update of slug on public.regions
for each row execute function public.remember_old_slug('region');

create trigger articles_remember_old_slug
after insert or update of slug on public.articles
for each row execute function public.remember_old_slug('guide');

-- The redirects the website follows: only to a page that exists today (a published trek or guide, a region with a
-- page), so a redirect never ends on a 404.
create view public.web_redirects as
select distinct 'trek' as kind, s.old_slug as from_slug, w.slug as to_slug
from public.slug_redirects s
join public.web_treks w on w.id = s.target_id and w.has_page
where s.kind = 'trek'
union
select distinct 'region', s.old_slug, w.slug
from public.slug_redirects s
join public.web_regions w on w.id = s.target_id and w.has_page
where s.kind = 'region'
union
select distinct 'guide', s.old_slug, w.slug
from public.slug_redirects s
join public.web_travel_guides w on w.id = s.target_id
where s.kind = 'guide';

revoke all on public.web_redirects from public, authenticated;
grant select on public.web_redirects to anon;
