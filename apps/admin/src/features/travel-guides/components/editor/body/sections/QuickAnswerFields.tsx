import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import type { RichTextDoc } from "@/lib/richText/richText";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type QuickAnswerFieldsProps = {
  body: RichTextDoc;
  error?: string;
  onChange: (body: RichTextDoc) => void;
};

/** "Quick answer": a short answer in a blue box, right under the title. */
export const QuickAnswerFields = ({ body, error, onChange }: QuickAnswerFieldsProps) => (
  <div className="flex flex-col gap-2 rounded-lg border-l-4 border-solid border-brand bg-brand-tint px-3.5 py-3">
    <RichTextEditor
      name="sectionQuickAnswer"
      label="Quick answer"
      hint="Answer the title’s question in 2–3 sentences. Google often shows this as the top answer."
      defaultValue={body}
      maxLength={LIMIT.quickAnswer}
      size="compact"
      error={error}
      onChange={onChange}
    />
  </div>
);
