-- Trek guide topics ("Practical field knowledge") get one free rich text ("body") instead of fixed "lead-in: text"
-- points, so a topic can hold paragraphs, lists or the old bold lead-ins. Saved points become paragraphs that
-- start with the bold lead-in, so pages read the same. The topic is now
-- { "icon", "title", "body": <rich text doc>, "note", "photoId", "videoId" }; web_trek_pages passes it through.

create function pg_temp.point_paragraph(p_point jsonb) returns jsonb
language sql immutable as $$
  select jsonb_build_object(
    'type', 'paragraph',
    'content',
    jsonb_build_array(jsonb_build_object('type', 'text', 'text', (p_point ->> 'title') || ':', 'marks', jsonb_build_array(jsonb_build_object('type', 'bold'))))
      || case when coalesce(p_point ->> 'text', '') = '' then '[]'::jsonb
         else jsonb_build_array(jsonb_build_object('type', 'text', 'text', ' ' || (p_point ->> 'text'))) end
  )
$$;

update public.trek_translations tt
set know_topics = (
  select coalesce(jsonb_agg(
    (topic.item - 'points') || jsonb_build_object('body', jsonb_build_object(
      'type', 'doc',
      'content', coalesce(
        (
          select jsonb_agg(pg_temp.point_paragraph(point.item) order by point.position)
          from jsonb_array_elements(topic.item -> 'points') with ordinality as point (item, position)
          where coalesce(point.item ->> 'title', '') <> ''
        ),
        '[{"type": "paragraph"}]'::jsonb
      )
    ))
    order by topic.position
  ), '[]'::jsonb)
  from jsonb_array_elements(tt.know_topics) with ordinality as topic (item, position)
)
where exists (
  select 1 from jsonb_array_elements(tt.know_topics) as topic (item)
  where jsonb_typeof(topic.item -> 'points') = 'array'
);
