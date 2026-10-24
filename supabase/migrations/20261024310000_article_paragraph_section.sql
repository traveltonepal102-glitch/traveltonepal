-- Travel guides: a "Text" section, paragraphs with no heading (content: { body }, a rich text document).
-- save_article needs no change: it stores any section type's content as it comes.
alter type public.article_section_type add value 'paragraph' after 'text';
