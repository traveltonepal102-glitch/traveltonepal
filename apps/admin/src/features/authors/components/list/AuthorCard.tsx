import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { PhotoImage } from "@/features/photos/components/PhotoImage";

import { AUTHOR_LANGUAGES, authorPath } from "../../constants";
import { isVerified, kindLabel } from "../../lib/authorRules";
import type { Author, AuthorPerson } from "../../types";

type AuthorCardProps = {
  author: Author;
  person: AuthorPerson;
  isOpen: boolean;
};

/** One author in the list (design: people card). Opens the edit panel. */
export const AuthorCard = ({ author, person, isOpen }: AuthorCardProps) => (
  <Link
    href={authorPath(author.id)}
    scroll={false}
    aria-current={isOpen ? "true" : undefined}
    className={cn(
      "flex h-full flex-col gap-3 rounded-lg border border-solid bg-surface p-4 text-text no-underline hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
      isOpen ? "border-brand ring-3 ring-brand/15" : "border-border",
    )}
  >
    <span className="flex items-center gap-3">
      <span className="inline-flex size-13 flex-none items-center justify-center overflow-hidden rounded-full bg-brand-tint text-brand">
        {person.photo ? <PhotoImage photo={person.photo} alt="" sizes="52px" className="h-full w-full object-cover" /> : <Icon name="person" size={26} />}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 font-bold text-ink">
          <span className="truncate">{person.name || "Trekking guide not found"}</span>
          {isVerified(author.kind) && <Icon name="verified" size={16} aria-label="Verified" className="flex-none text-brand" />}
        </span>
        <span className="block truncate text-caption text-muted-foreground">{author.jobTitle}</span>
      </span>
    </span>

    {author.topics.length > 0 && (
      <span className="flex flex-wrap gap-1.5">
        {author.topics.map((topic) => (
          <span key={topic} className="rounded-full bg-saffron-tint px-2.5 py-0.5 text-xs font-semibold text-saffron-ink">
            {topic}
          </span>
        ))}
      </span>
    )}
    <span className="flex items-center gap-1.5 text-caption">
      <Icon name="translate" size={16} className="flex-none text-muted-foreground" />
      Writes in {AUTHOR_LANGUAGES.filter((language) => author.writesIn.includes(language.value)).map((language) => language.label).join(" and ")}
    </span>

    <span className="mt-auto flex items-center justify-between gap-2 border-t border-solid border-border pt-2.5 text-xs">
      <span className="text-muted-foreground">{kindLabel(author.kind)}</span>
      {author.showOnAbout && <span className="font-bold text-brand">On the About page</span>}
    </span>
  </Link>
);
