import { TagListField } from "@/components/ui/TagListField";

import { GUIDE_LIMITS, LANGUAGE_SUGGESTIONS, MAX_LANGUAGES } from "../../constants";

type LanguagesFieldProps = {
  initial: string[];
  error?: string;
  onEdit: () => void;
  /** The languages as they are now, for the card preview. */
  onChange?: (languages: string[]) => void;
};

/** The languages a guide speaks, as removable chips (design: "Languages spoken"). Each is sent as `language`. */
export const LanguagesField = ({ initial, error, onEdit, onChange }: LanguagesFieldProps) => (
  <TagListField
    label="Languages spoken"
    name="language"
    initial={initial}
    suggestions={LANGUAGE_SUGGESTIONS}
    maxItems={MAX_LANGUAGES}
    maxLength={GUIDE_LIMITS.language}
    placeholder="Type a language, e.g. German"
    error={error}
    onEdit={onEdit}
    onChange={onChange}
  />
);
