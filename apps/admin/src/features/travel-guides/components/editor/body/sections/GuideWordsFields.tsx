import { TextField } from "@/components/ui/TextField";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../../lib/sectionContext";
import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";
import { GuidePickField } from "../pickers/GuidePickField";

type GuideWordsFieldsProps = {
  /** "tip": advice in an amber box; "gquote": the guide's own words, larger. */
  kind: "tip" | "gquote";
  guideId: string | null;
  text: string;
  context: SectionContext;
  /** e.g. "sections.3" for this section's errors. */
  field: string;
  errors: FieldErrors;
  onChange: (patch: { guideId?: string | null; text?: string }) => void;
};

/** "Guide's tip" and "Guide quote": a trekking guide (shown with photo and name) and their words. */
export const GuideWordsFields = ({ kind, guideId, text, context, field, errors, onChange }: GuideWordsFieldsProps) => (
  <>
    <GuidePickField label={kind === "tip" ? "Tip from" : "Quote from"} guideId={guideId} guides={context.guides} region={context.region} error={errors[`${field}.guideId`]} onChange={(next) => onChange({ guideId: next })} />
    <div className={kind === "tip" ? "rounded-lg border border-solid border-saffron-line bg-saffron-tint p-3" : ""}>
      <TextField
        name="sectionGuideWords"
        label={kind === "tip" ? "Guide’s tip" : "The guide’s words"}
        hint={kind === "tip" ? "Local advice that shows real experience." : "Ask the guide; don’t write it for them."}
        multiline
        rows={3}
        value={text}
        onValueChange={(next) => onChange({ text: next })}
        placeholder={kind === "tip" ? "Start walking at 7 am in spring. Clouds come in after lunch." : "I was born two days below Kyanjin Gompa."}
        maxLength={kind === "tip" ? LIMIT.tip : LIMIT.guideQuote}
        error={errors[`${field}.text`]}
      />
    </div>
  </>
);
