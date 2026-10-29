-- Button click counts (decided 2026-10-29; Privacy policy › "Button click counts"): every WhatsApp and email button
-- on the website leads through its /whatsapp or /email address, which adds one to that day's count for the page the
-- click came from. No cookie, no IP address, nothing about the visitor: only day, channel, page and a number.
-- The website's second write (after record_guide_feedback): anon may call record_contact_click. Admins read the
-- totals with contact_click_totals (Dashboard).

create table public.contact_clicks (
  day date not null,
  channel text not null check (channel in ('whatsapp', 'email')),
  -- The website page the click came from, e.g. "/treks/langtang-valley"; '' when the browser didn't say.
  page_path text not null check (page_path = '' or (page_path ~ '^/' and char_length(page_path) <= 200)),
  clicks integer not null default 0 check (clicks >= 0),
  primary key (day, channel, page_path)
);

alter table public.contact_clicks enable row level security;

grant select on public.contact_clicks to authenticated;

create policy "Admins read contact clicks" on public.contact_clicks for select to authenticated using ((select public.is_admin()));

-- Adds one click (today in Nepal). Returns false for anything that isn't a click from one of our pages.
-- Runs as its owner: anon has no rights on the table itself.
create function public.record_contact_click(p_channel text, p_page_path text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  page text := coalesce(p_page_path, '');
begin
  if p_channel is null or p_channel not in ('whatsapp', 'email') then
    return false;
  end if;
  if page <> '' and (page !~ '^/' or char_length(page) > 200) then
    return false;
  end if;

  insert into public.contact_clicks (day, channel, page_path, clicks)
  values ((now() at time zone 'Asia/Kathmandu')::date, p_channel, page, 1)
  on conflict (day, channel, page_path) do update set clicks = public.contact_clicks.clicks + 1;
  return true;
end;
$$;

revoke execute on function public.record_contact_click(text, text) from public, authenticated;
grant execute on function public.record_contact_click(text, text) to anon;

-- The clicks of the last p_days days (Nepal time) per channel and page, most clicked first. Runs as the caller: the
-- policy above lets only admins see any.
create function public.contact_click_totals(p_days integer default 30)
returns table (channel text, page_path text, clicks integer)
language sql
stable
set search_path = ''
as $$
  select c.channel, c.page_path, sum(c.clicks)::integer
  from public.contact_clicks c
  where c.day > (now() at time zone 'Asia/Kathmandu')::date - greatest(p_days, 1)
  group by c.channel, c.page_path
  order by 3 desc, 2;
$$;

revoke execute on function public.contact_click_totals(integer) from public, anon;
grant execute on function public.contact_click_totals(integer) to authenticated;
