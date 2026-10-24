"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

import { secondaryButton } from "./buttonStyles";
import { FieldError } from "./FieldError";
import { inputClass, labelClass } from "./formStyles";

type TagListFieldProps = {
  label: string;
  /** Each tag is sent under this name. */
  name: string;
  initial: string[];
  /** Offered while typing; anything else can be typed too. */
  suggestions: string[];
  maxItems: number;
  maxLength: number;
  placeholder: string;
  hint?: string;
  error?: string;
  onEdit: () => void;
  /** The tags as they are now (e.g. for a preview). */
  onChange?: (tags: string[]) => void;
};

/**
 * Short words typed one at a time and shown as removable chips (e.g. languages, topics). Each is kept once,
 * ignoring case; Enter adds the word instead of saving the form.
 */
export const TagListField = ({ label, name, initial, suggestions, maxItems, maxLength, placeholder, hint, error, onEdit, onChange }: TagListFieldProps) => {
  const id = useId();
  const [tags, setTags] = useState(initial);
  const [draft, setDraft] = useState("");
  const isFull = tags.length >= maxItems;

  const change = (next: string[]) => {
    setTags(next);
    onChange?.(next);
    onEdit();
  };

  const add = () => {
    const tag = draft.trim();
    setDraft("");
    if (!tag || isFull || tags.some((known) => known.toLowerCase() === tag.toLowerCase())) return;
    change([...tags, tag]);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    add();
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={`${id}-input`} className={labelClass}>
        {label}
      </label>
      {tags.length > 0 && (
        <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {tags.map((tag) => (
            <li key={tag} className="inline-flex min-h-8 items-center gap-1 rounded-full bg-brand-tint py-0.5 pr-1 pl-3 text-caption font-semibold text-navy">
              {tag}
              <input type="hidden" name={name} value={tag} />
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                onClick={() => change(tags.filter((other) => other !== tag))}
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
          maxLength={maxLength}
          placeholder={isFull ? `Up to ${maxItems}` : placeholder}
          aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined}
          className={cn(inputClass, "max-w-60")}
        />
        <button type="button" onClick={add} disabled={isFull || !draft.trim()} className={cn(secondaryButton, "px-3")}>
          <Icon name="add" size={16} />
          Add
        </button>
      </div>
      <datalist id={`${id}-suggestions`}>
        {suggestions.filter((suggestion) => !tags.includes(suggestion)).map((suggestion) => (
          <option key={suggestion} value={suggestion} />
        ))}
      </datalist>
      {hint && (
        <span id={`${id}-hint`} className="text-xs text-muted-foreground">
          {hint}
        </span>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
};
