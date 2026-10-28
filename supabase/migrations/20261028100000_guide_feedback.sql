-- "Was this guide helpful?" (decided 2026-10-28): each Yes / Not really at the end of a travel guide is one row.
-- Nothing about the visitor is kept (no IP, no cookie, no account), only the guide, the answer and when.
-- The website's one write: anon may call record_guide_feedback and nothing else that changes data. Admins read
-- the totals per guide with guide_feedback_totals (the list and the editor).

create table public.article_feedback (
  id bigint generated always as identity primary key,
  article_id uuid not null references public.articles (id) on delete cascade,
  is_helpful boolean not null,
  created_at timestamptz not null default now()
);

create index article_feedback_article_id_created_at_idx on public.article_feedback (article_id, created_at);

alter table public.article_feedback enable row level security;

grant select on public.article_feedback to authenticated;

create policy "Admins read guide feedback" on public.article_feedback for select to authenticated using ((select public.is_admin()));

-- Adds one vote to a guide that is live on the website (web_travel_guides). Returns false for any other address,
-- and while one guide already got 20 votes in the last minute (a script hammering it, not readers).
-- Runs as its owner: anon has no rights on the table itself.
create function public.record_guide_feedback(p_slug text, p_is_helpful boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  guide_id uuid;
begin
  if p_is_helpful is null then
    return false;
  end if;

  select g.id into guide_id from public.web_travel_guides g where g.slug = p_slug limit 1;
  if guide_id is null then
    return false;
  end if;

  if (select count(*) from public.article_feedback f where f.article_id = guide_id and f.created_at > now() - interval '1 minute') >= 20 then
    return false;
  end if;

  insert into public.article_feedback (article_id, is_helpful) values (guide_id, p_is_helpful);
  return true;
end;
$$;

revoke execute on function public.record_guide_feedback(text, boolean) from public, authenticated;
grant execute on function public.record_guide_feedback(text, boolean) to anon;

-- The votes per guide (all guides, or one), counted in the database. Runs as the caller: the policy above lets only
-- admins see any.
create function public.guide_feedback_totals(p_article_id uuid default null)
returns table (article_id uuid, helpful_count integer, not_helpful_count integer, last_vote_at timestamptz)
language sql
stable
set search_path = ''
as $$
  select
    f.article_id,
    (count(*) filter (where f.is_helpful))::integer,
    (count(*) filter (where not f.is_helpful))::integer,
    max(f.created_at)
  from public.article_feedback f
  where p_article_id is null or f.article_id = p_article_id
  group by f.article_id;
$$;

revoke execute on function public.guide_feedback_totals(uuid) from public, anon;
grant execute on function public.guide_feedback_totals(uuid) to authenticated;
