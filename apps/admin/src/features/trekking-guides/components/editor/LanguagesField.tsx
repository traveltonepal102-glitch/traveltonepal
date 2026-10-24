"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { inputClass, labelClass } from "@/components/ui/formStyles";

import { GUIDE_LIMITS, LANGUAGE_SUGGESTIONS, MAX_LANGUAGES } from "../../constants";

type LanguagesFieldProps = {
  initial: string[];
  error?: string;
  onEdit: () => void;
  /** The languages as they are now, for the card preview. */
  onChange?: (languages: string[]) => void;
};

/** The languages a guide speaks, as removable chips (design: "Languages spoken"). Each is sent as `language`. */
export const LanguagesField = ({ initial, error, onEdit, onChange }: LanguagesFieldProps) => {
  const id = useId();
  const [languages, setLanguages] = useState(initial);
  const [draft, setDraft] = useState("");
  const isFull = languages.length >= MAX_LANGUAGES;

  const change = (next: string[]) => {
    setLanguages(next);
    onChange?.(next);
    onEdit();
  };

  const add = () => {
    const language = draft.trim();
    setDraft("");
    if (!language || isFull || languages.some((known) => known.toLowerCase() === language.toLowerCase())) return;
    change([...languages, language]);
  };

  // Enter adds the language instead of saving the whole form.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    add();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`${id}-input`} className={labelClass}>
        Languages spoken
      </label>
      {languages.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {languages.map((language) => (
            <li key={language} className="inline-flex min-h-8 items-center gap-1 rounded-full bg-brand-tint py-0.5 pr-1 pl-3 text-caption font-semibold text-navy">
              {language}
              <input type="hidden" name="language" value={language} />
              <button
                type="button"
                aria-label={`Remove ${language}`}
                onClick={() => change(languages.filter((other) => other !== language))}
                className="m-0 inline-flex size-6 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-navy hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Icon name="close" size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <input
          id={`${id}-input`}
          list={`${id}-suggestions`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isFull}
          maxLength={GUIDE_LIMITS.language}
          placeholder={isFull ? `Up to ${MAX_LANGUAGES} languages` : "Type a language, e.g. German"}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClass, "max-w-60")}
        />
        <button type="button" onClick={add} disabled={isFull || !draft.trim()} className={cn(secondaryButton, "px-3")}>
          <Icon name="add" size={16} />
          Add
        </button>
      </div>
      <datalist id={`${id}-suggestions`}>
        {LANGUAGE_SUGGESTIONS.filter((language) => !languages.includes(language)).map((language) => (
          <option key={language} value={language} />
        ))}
      </datalist>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
};
