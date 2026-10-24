"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { inputClass } from "@/components/ui/formStyles";

import { AUTHOR_KINDS, AUTHOR_LANGUAGES } from "../../constants";
import type { AuthorFilters } from "../../lib/authorRules";

type AuthorFilterBarProps = {
  filters: AuthorFilters;
  onChange: (filters: AuthorFilters) => void;
  /** e.g. "4 authors" or "1 of 4 authors". */
  countLabel: string;
};

const selectClass = cn(inputClass, "w-auto min-w-40 cursor-pointer pr-8");

/** The option picked ("" for all). */
const kindOf = (value: string) => AUTHOR_KINDS.find((kind) => kind.value === value)?.value ?? "";
const languageOf = (value: string) => AUTHOR_LANGUAGES.find((language) => language.value === value)?.value ?? "";

/** Search by name, job title or topic, and filter by kind and language (design: the toolbar above the cards). */
export const AuthorFilterBar = ({ filters, onChange, countLabel }: AuthorFilterBarProps) => (
  <div className="flex flex-wrap items-center gap-2.5 max-tablet:flex-col max-tablet:items-stretch">
    <label className="relative block min-w-55 flex-1 tablet:max-w-90">
      <span className="sr-only">Search authors</span>
      <Icon name="search" size={20} className="pointer-events-none absolute top-2.5 left-3 text-muted-foreground" />
      <input
        type="search"
        value={filters.query}
        onChange={(event) => onChange({ ...filters, query: event.target.value })}
        placeholder="Search authors"
        className={cn(inputClass, "pl-10.5")}
      />
    </label>
    <select aria-label="Filter by kind" value={filters.kind} onChange={(event) => onChange({ ...filters, kind: kindOf(event.target.value) })} className={selectClass}>
      <option value="">Everyone</option>
      {AUTHOR_KINDS.map((kind) => (
        <option key={kind.value} value={kind.value}>
          {kind.label}
        </option>
      ))}
    </select>
    <select
      aria-label="Filter by language"
      value={filters.language}
      onChange={(event) => onChange({ ...filters, language: languageOf(event.target.value) })}
      className={selectClass}
    >
      <option value="">Any language</option>
      {AUTHOR_LANGUAGES.map((language) => (
        <option key={language.value} value={language.value}>
          Writes {language.label}
        </option>
      ))}
    </select>
    <span className="flex-1 max-tablet:hidden" />
    <span role="status" className="text-xs text-muted-foreground">
      {countLabel}
    </span>
  </div>
);
