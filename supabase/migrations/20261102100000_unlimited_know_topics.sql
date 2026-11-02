-- A trek's guide topics ("Trek guide: season, facilities and safety") have no maximum any more: the admin decides how
-- many. The column was added with an inline check (array, at most 8); its generated name isn't spelled out anywhere,
-- so drop whichever check on trek_translations reads know_topics, then keep only "it is an array".
do $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.trek_translations'::regclass
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) like '%know_topics%'
  loop
    execute format('alter table public.trek_translations drop constraint %I', constraint_name);
  end loop;
end
$$;

alter table public.trek_translations
  add constraint trek_translations_know_topics_check check (jsonb_typeof(know_topics) = 'array');
