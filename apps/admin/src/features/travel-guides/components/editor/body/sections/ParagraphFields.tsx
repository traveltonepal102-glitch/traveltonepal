import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import type { RichTextDoc } from "@/lib/richText/richText";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type ParagraphFieldsProps = {
  body: RichTextDoc;
  error?: string;
  onChange: (body: RichTextDoc) => void;
};

/** "Text": paragraphs with no heading (not in the "In this guide" contents). */
export const ParagraphFields = ({ body, error, onChange }: ParagraphFieldsProps) => (
  <RichTextEditor name="sectionParagraph" label="Text" defaultValue={body} maxLength={LIMIT.text} error={error} onChange={onChange} />
);
