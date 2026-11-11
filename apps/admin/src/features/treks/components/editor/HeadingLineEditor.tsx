import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import type { RichTextDoc } from "@/lib/richText/richText";

import { TREK_LIMITS as LIMIT } from "../../constants";

type HeadingLineEditorProps = {
  name: string;
  defaultValue: RichTextDoc;
  error?: string;
  onEdit: () => void;
  label?: string;
};

/** "Line under the heading" as rich text: a sentence or two that may link to other pages (internal links). Empty shows nothing. */
export const HeadingLineEditor = ({ name, defaultValue, error, onEdit, label = "Line under the heading" }: HeadingLineEditorProps) => (
  <RichTextEditor
    name={name}
    label={label}
    hint="A sentence or two. Select words and add a link to point to another page of this website."
    defaultValue={defaultValue}
    error={error}
    maxLength={LIMIT.headingLine}
    size="compact"
    onEdit={onEdit}
  />
);
