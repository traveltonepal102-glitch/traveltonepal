import { TextField } from "@/components/ui/TextField";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type HtmlFieldsProps = {
  html: string;
  error?: string;
  onChange: (html: string) => void;
};

/** "Custom HTML": the admin's own markup, cleaned on Save (the website shows what is left, in the article's style). */
export const HtmlFields = ({ html, error, onChange }: HtmlFieldsProps) => (
  <TextField
    name="sectionHtml"
    label="HTML"
    hint="Text, headings, lists, links, tables, details and style=“…” are kept. Scripts, frames, forms and images are not: use “Embed” for maps and videos and “Photo” for photos."
    multiline
    rows={10}
    value={html}
    onValueChange={onChange}
    placeholder={"<details>\n  <summary>What does a teahouse room have?</summary>\n  <p>Two beds, a blanket and a shared toilet.</p>\n</details>"}
    maxLength={LIMIT.customHtml}
    showCount
    error={error}
    inputClassName="font-mono text-caption"
  />
);
