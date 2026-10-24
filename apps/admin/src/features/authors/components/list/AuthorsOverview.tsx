"use client";

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";

import { NEW_AUTHOR_PATH } from "../../constants";
import { NO_AUTHOR_FILTERS, authorPerson, filterAuthors } from "../../lib/authorRules";
import type { Author, AuthorGuide } from "../../types";
import { AuthorCard } from "./AuthorCard";
import { AuthorFilterBar } from "./AuthorFilterBar";

type AuthorsOverviewProps = {
  authors: Author[];
  guides: AuthorGuide[];
  /** The author whose panel is open ("new" while adding). */
  openId: string | null;
  /** The edit drawer, when one is open (it shows over the list). */
  panel: ReactNode;
};

/** The Authors screen (design: Admin-people, tab "Authors"): cards, filters and the edit drawer. */
export const AuthorsOverview = ({ authors, guides, openId, panel }: AuthorsOverviewProps) => {
  const [filters, setFilters] = useState(NO_AUTHOR_FILTERS);
  const shown = filterAuthors(authors, guides, filters);
  const countLabel = shown.length === authors.length ? `${authors.length} author${authors.length === 1 ? "" : "s"}` : `${shown.length} of ${authors.length} authors`;

  return (
    <>
      <div className="flex flex-wrap items-start gap-3.5">
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Icon name="person" size={26} />
        </span>
        <div className="min-w-60 flex-1">
          <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
            Authors
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{authors.length}</span>
          </h1>
          <p className="m-0 mt-1 max-w-195 text-muted-foreground">
            The people who write your travel guides. Pick them as “Written by” in the travel guide editor. Trekking guides are picked as “Checked by”.
          </p>
        </div>
        <Link href={NEW_AUTHOR_PATH} scroll={false} className={primaryButton}>
          <Icon name="add" />
          Add author
        </Link>
      </div>

      <AuthorFilterBar filters={filters} onChange={setFilters} countLabel={countLabel} />

      <ul className="m-0 grid list-none gap-3.5 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
        {shown.map((author) => (
          <li key={author.id}>
            <AuthorCard author={author} person={authorPerson(author, guides)} isOpen={author.id === openId} />
          </li>
        ))}
        {!shown.length && (
          <li className="rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground tablet:col-span-full">
            {authors.length ? "No author matches these filters." : "No authors yet. Add the first one with “Add author”."}
          </li>
        )}
      </ul>
      {panel}
    </>
  );
};
