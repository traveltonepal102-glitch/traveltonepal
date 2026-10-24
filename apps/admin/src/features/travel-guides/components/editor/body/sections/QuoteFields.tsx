import { TextField } from "@/components/ui/TextField";

import { SECTION_LIMITS as LIMIT } from "../../../../sectionKinds";

type QuoteFieldsProps = {
  text: string;
  error?: string;
  onChange: (text: string) => void;
};

/** "Pull quote": one sentence in large type, to break up long text. */
export const QuoteFields = ({ text, error, onChange }: QuoteFieldsProps) => (
  <div className="border-l-4 border-solid border-saffron pl-3.5">
    <TextField
      name="sectionQuote"
      label="One sentence"
      multiline
      rows={2}
      value={text}
      onValueChange={onChange}
      placeholder="“The valley is quietest in the first week of November — and the views are the clearest.”"
      maxLength={LIMIT.quote}
      showCount
      error={error}
      inputClassName="font-display text-lg font-bold text-navy"
    />
  </div>
);
