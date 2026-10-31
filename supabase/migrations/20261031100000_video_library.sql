-- The video library (decided 2026-10-31): YouTube links only, nothing uploaded. Each video is added once in the
-- admin's Photos and videos screen (its link and title) and then chosen by treks (their videos and guide topics)
-- and travel guides (video sections), which keep only the video's YouTube id, as before. A trigger refuses a trek
-- or guide video that isn't in the library, and a video still used can't be deleted (video_uses).

create table public.videos (
  id uuid primary key default gen_random_uuid(),
  -- From the pasted link; never changes (treks and guides refer to it). To change the link, add another video.
  youtube_id text not null unique check (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  -- Shown with the video on the website and in the admin.
  title text not null check (char_length(btrim(title)) between 1 and 100),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users (id) on delete set null default auth.uid(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.videos enable row level security;

grant select, insert, update, delete on public.videos to authenticated;

create policy "Admins read videos" on public.videos for select to authenticated using ((select public.is_admin()));
create policy "Admins add videos" on public.videos for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit videos" on public.videos
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Super admins delete videos" on public.videos for delete to authenticated using ((select public.is_super_admin()));

-- Adds (p_video_id null: youtube_id and title) or renames a video (only the title changes); returns its id.
-- A link already in the library raises 23505; a video that no longer exists raises P0002.
create function public.save_video(p_video_id uuid, p_video jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
begin
  if p_video_id is null then
    insert into public.videos (youtube_id, title, updated_by)
    values (p_video ->> 'youtube_id', p_video ->> 'title', auth.uid())
    returning id into saved_id;
    return saved_id;
  end if;

  update public.videos
  set title = p_video ->> 'title', updated_at = now(), updated_by = auth.uid()
  where id = p_video_id
  returning id into saved_id;

  if saved_id is null then
    raise exception 'Video not found' using errcode = 'P0002';
  end if;
  return saved_id;
end;
$$;

-- Where each video is used: what kind of thing, which one (id and English name) and where on it.
create function public.video_uses(p_youtube_id text default null)
returns table (youtube_id text, kind text, item_id text, item_label text, detail text)
language sql
stable
set search_path = ''
as $$
  with
    trek_names as (
      select t.id, coalesce(nullif(tt.name, ''), t.slug) as name
      from public.treks t left join public.trek_translations tt on tt.trek_id = t.id and tt.locale = 'en'
    ),
    guide_names as (
      select a.id, coalesce(nullif(at.title, ''), a.slug) as name
      from public.articles a left join public.article_translations at on at.article_id = a.id and at.locale = 'en'
    ),
    uses (youtube_id, kind, item_id, item_label, detail) as (
      select v ->> 'youtubeId', 'trek', tt.trek_id::text, n.name, 'Videos'
      from public.trek_translations tt
      join trek_names n on n.id = tt.trek_id
      cross join lateral jsonb_array_elements(tt.videos) as v
      union all
      select topic ->> 'videoId', 'trek', tt.trek_id::text, n.name, 'Trek guide: ' || coalesce(nullif(topic ->> 'title', ''), 'a topic')
      from public.trek_translations tt
      join trek_names n on n.id = tt.trek_id
      cross join lateral jsonb_array_elements(tt.know_topics) as topic
      where topic ->> 'videoId' is not null
      union all
      select s.settings ->> 'youtubeId', 'guide', s.article_id::text, n.name, 'Section ' || (s.position + 1)
      from public.article_sections s
      join guide_names n on n.id = s.article_id
      where s.type = 'video'
    )
  select distinct u.youtube_id, u.kind, u.item_id, u.item_label, u.detail
  from uses u
  where u.youtube_id is not null and (p_youtube_id is null or u.youtube_id = p_youtube_id);
$$;

-- Deletes a video nothing uses (Super admins only). False when it was already gone; hint video_in_use while used.
create function public.delete_unused_video(p_video_id uuid)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
  found_youtube_id text;
begin
  if not (select public.is_super_admin()) then
    raise exception 'Only a Super admin can delete videos.' using errcode = '42501';
  end if;

  select v.youtube_id into found_youtube_id from public.videos v where v.id = p_video_id for update;
  if found_youtube_id is null then
    return false;
  end if;

  if exists (select 1 from public.video_uses(found_youtube_id)) then
    raise exception 'This video is still used.' using errcode = 'P0001', hint = 'video_in_use';
  end if;

  delete from public.videos v where v.id = p_video_id;
  return true;
end;
$$;

-- Treks and guides use only library videos: a YouTube id not in the library raises 23503 (as a missing photo does).
create function public.check_videos_in_library(p_youtube_ids text[])
returns void
language plpgsql
stable
set search_path = ''
as $$
declare
  missing text;
begin
  select id into missing
  from unnest(p_youtube_ids) as ids (id)
  where id is not null and not exists (select 1 from public.videos v where v.youtube_id = ids.id)
  limit 1;
  if missing is not null then
    raise exception 'Video % is not in the video library', missing using errcode = '23503';
  end if;
end;
$$;

create function public.trek_videos_in_library()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform public.check_videos_in_library(array(
    select v ->> 'youtubeId' from jsonb_array_elements(new.videos) as v
    union
    select topic ->> 'videoId' from jsonb_array_elements(new.know_topics) as topic
  ));
  return new;
end;
$$;

create trigger trek_videos_in_library
  before insert or update of videos, know_topics on public.trek_translations
  for each row execute function public.trek_videos_in_library();

create function public.guide_video_in_library()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.type = 'video' then
    perform public.check_videos_in_library(array[new.settings ->> 'youtubeId']);
  end if;
  return new;
end;
$$;

create trigger guide_video_in_library
  before insert or update of type, settings on public.article_sections
  for each row execute function public.guide_video_in_library();

revoke execute on function public.save_video(uuid, jsonb), public.video_uses(text), public.delete_unused_video(uuid) from public, anon;
grant execute on function public.save_video(uuid, jsonb), public.video_uses(text), public.delete_unused_video(uuid) to authenticated;
revoke execute on function public.check_videos_in_library(text[]), public.trek_videos_in_library(), public.guide_video_in_library() from public, anon;
grant execute on function public.check_videos_in_library(text[]) to authenticated;
