import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { RichTextEditor } from "@/components/ui/richText/RichTextEditor";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import type { RichTextDoc } from "@/lib/richText/richText";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type Tone = "note" | "warning";

type CalloutFieldsProps = {
  tone: Tone;
  body: RichTextDoc;
  error?: string;
  onChange: (patch: { tone?: Tone; body?: RichTextDoc }) => void;
};

const TONES: { value: Tone; label: string }[] = [
  { value: "warning", label: "Warning" },
  { value: "note", label: "Note" },
];

/** "Note or warning": a coloured box that stands out from the text. Start it with a bold lead, e.g. "Permit rule:". */
export const CalloutFields = ({ tone, body, error, onChange }: CalloutFieldsProps) => (
  <>
    <SegmentedControl label="Note or warning" options={TONES} value={tone} onChange={(next) => onChange({ tone: next })} />
    <div className={cn("flex gap-2.5 rounded-lg border border-solid p-3", tone === "warning" ? "border-saffron-line bg-saffron-tint" : "border-brand-tint bg-brand-tint")}>
      <Icon name={tone === "warning" ? "warning" : "info"} size={22} className={cn("mt-7 flex-none", tone === "warning" ? "text-saffron-deep" : "text-brand")} />
      <div className="min-w-0 flex-1">
        <RichTextEditor
          name="sectionCallout"
          label={tone === "warning" ? "Warning" : "Note"}
          hint="Short. Start with a bold lead, e.g. “Permit rule:”."
          defaultValue={body}
          maxLength={LIMIT.calloutText}
          size="compact"
          error={error}
          onChange={(next) => onChange({ body: next })}
        />
      </div>
    </div>
  </>
);
