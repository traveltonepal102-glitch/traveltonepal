-- Authors (design: Admin-people, tab "Authors"): the people who write the travel guides. They are picked as
-- "Written by" in the travel guide editor; trekking guides are picked as "Checked by".
-- Three kinds: office team, a trekking guide (photo, name and bio come from Trekking guides) or a guest writer.
-- authors holds what every language shares; author_translations the job title and bio.
-- Admins add and edit; only a Super admin removes an author.

create type public.author_kind as enum ('office', 'guide', 'guest');

create table public.authors (
  id uuid primary key default gen_random_uuid(),
  kind public.author_kind not null,
  -- Only for kind "guide", once per guide. A guide who is an author can't be removed before the author.
  guide_id uuid unique references public.trekking_guides (id) on delete restrict,
  -- Not for kind "guide" (theirs come from Trekking guides).
  name text not null default '' check (char_length(name) <= 80),
  photo_id uuid references public.photos (id) on delete restrict,
  -- The person agreed that we show their photo and name.
  photo_consent boolean not null default false,
  -- The languages of the travel guides they can be picked on.
  writes_in text[] not null default '{en}' check (cardinality(writes_in) between 1 and 2 and writes_in <@ array['en', 'de']::text[]),
  -- Suggests the author first in the travel guide editor; never on the website.
  topics text[] not null default '{}' check (cardinality(topics) <= 10),
  -- For Google only (the article's author "sameAs"); the first one is the main link.
  profile_links text[] not null default '{}' check (cardinality(profile_links) <= 5),
  show_author_box boolean not null default true,
  -- "Our guides and team" on the About page: office team only.
  show_on_about boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  check ((kind = 'guide') = (guide_id is not null)),
  check (kind = 'guide' or char_length(name) >= 1),
  check (kind <> 'guide' or (name = '' and photo_id is null and cardinality(profile_links) = 0)),
  check (not show_on_about or kind = 'office')
);

create index authors_photo_id_idx on public.authors (photo_id);

create table public.author_translations (
  author_id uuid not null references public.authors (id) on delete cascade,
  locale text not null check (locale in ('en', 'de')),
  -- Under the name in the byline: why they know the topic.
  job_title text not null check (char_length(job_title) between 1 and 80),
  -- The author box under the article (a guide's comes from Trekking guides).
  bio text not null default '' check (char_length(bio) <= 300),
  primary key (author_id, locale)
);

alter table public.authors enable row level security;
alter table public.author_translations enable row level security;

grant select, insert, update, delete on public.authors, public.author_translations to authenticated;

create policy "Admins read authors" on public.authors for select to authenticated using ((select public.is_admin()));
create policy "Admins add authors" on public.authors for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit authors" on public.authors
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Super admins remove authors" on public.authors for delete to authenticated using ((select public.is_super_admin()));

create policy "Admins read author text" on public.author_translations for select to authenticated using ((select public.is_admin()));
create policy "Admins add author text" on public.author_translations for insert to authenticated with check ((select public.is_admin()));
create policy "Admins edit author text" on public.author_translations
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins remove author text" on public.author_translations for delete to authenticated using ((select public.is_admin()));

-- Adds (p_author_id null) or updates an author and their text in p_locale, in one transaction. A trekking
-- guide can only be an author once they agreed to be shown (raises 22023 otherwise).
create function public.save_author(p_author_id uuid, p_locale text, p_author jsonb, p_text jsonb)
returns uuid
language plpgsql
set search_path = ''
as $$
declare
  saved_id uuid;
  guide uuid := nullif(p_author ->> 'guide_id', '')::uuid;
begin
  if guide is not null and not exists (select 1 from public.trekking_guides g where g.id = guide and g.photo_consent) then
    raise exception 'This trekking guide has not agreed to be shown' using errcode = '22023';
  end if;

  if p_author_id is null then
    insert into public.authors (
      kind, guide_id, name, photo_id, photo_consent, writes_in, topics, profile_links, show_author_box, show_on_about, updated_by
    )
    values (
      (p_author ->> 'kind')::public.author_kind, guide, p_author ->> 'name', nullif(p_author ->> 'photo_id', '')::uuid,
      (p_author ->> 'photo_consent')::boolean,
      array(select jsonb_array_elements_text(p_author -> 'writes_in')),
      array(select jsonb_array_elements_text(p_author -> 'topics')),
      array(select jsonb_array_elements_text(p_author -> 'profile_links')),
      (p_author ->> 'show_author_box')::boolean, (p_author ->> 'show_on_about')::boolean, auth.uid()
    )
    returning id into saved_id;
  else
    update public.authors
    set kind = (p_author ->> 'kind')::public.author_kind,
        guide_id = guide,
        name = p_author ->> 'name',
        photo_id = nullif(p_author ->> 'photo_id', '')::uuid,
        photo_consent = (p_author ->> 'photo_consent')::boolean,
        writes_in = array(select jsonb_array_elements_text(p_author -> 'writes_in')),
        topics = array(select jsonb_array_elements_text(p_author -> 'topics')),
        profile_links = array(select jsonb_array_elements_text(p_author -> 'profile_links')),
        show_author_box = (p_author ->> 'show_author_box')::boolean,
        show_on_about = (p_author ->> 'show_on_about')::boolean,
        updated_at = now(),
        updated_by = auth.uid()
    where id = p_author_id
    returning id into saved_id;

    if saved_id is null then
      raise exception 'Author not found' using errcode = 'P0002';
    end if;
  end if;

  insert into public.author_translations as t (author_id, locale, job_title, bio)
  values (saved_id, p_locale, p_text ->> 'job_title', p_text ->> 'bio')
  on conflict (author_id, locale) do update
  set job_title = excluded.job_title, bio = excluded.bio;

  return saved_id;
end;
$$;

revoke execute on function public.save_author(uuid, text, jsonb, jsonb) from public, anon;
grant execute on function public.save_author(uuid, text, jsonb, jsonb) to authenticated;
