import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { PhotoImage } from "@/features/photos/components/PhotoImage";

import { firstName, isVerified } from "../../lib/authorRules";
import type { AuthorKind, AuthorPerson } from "../../types";

type AuthorPreviewProps = {
  kind: AuthorKind;
  person: AuthorPerson;
  jobTitle: string;
  showAuthorBox: boolean;
};

const SHORT_BIO = 90;

const Avatar = ({ person, className }: { person: AuthorPerson; className: string }) => (
  <span className={cn("inline-flex flex-none items-center justify-center overflow-hidden rounded-full", className)}>
    {person.photo ? <PhotoImage photo={person.photo} alt="" sizes="44px" className="h-full w-full object-cover" /> : <Icon name="person" size={22} />}
  </span>
);

/**
 * "How it looks on a travel guide": the byline at the top and the author box under the article. Follows the
 * form as it is typed; a guide author's photo, name and bio come from Trekking guides.
 */
export const AuthorPreview = ({ kind, person, jobTitle, showAuthorBox }: AuthorPreviewProps) => {
  const name = person.name || "Full name";
  const bio = person.bio.length > SHORT_BIO ? `${person.bio.slice(0, SHORT_BIO - 2)}…` : person.bio;

  return (
    <section aria-label="Preview on a travel guide" className="flex flex-col gap-2 rounded-lg bg-page p-3">
      <span className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase">
        <Icon name="visibility" size={16} />
        How it looks on a travel guide
      </span>
      <div className="flex items-center gap-2.5 rounded-xl bg-navy px-3.5 py-3 text-white">
        <Avatar person={person} className="size-10 bg-saffron text-ink" />
        <span className="min-w-0 flex-1 leading-snug">
          <span className="flex items-center gap-1 font-display font-bold">
            {name}
            {isVerified(kind) && <Icon name="verified" size={15} label="Verified" className="flex-none text-sky-300" />}
          </span>
          <span className="block text-xs text-white/80">{jobTitle || "Job title"}</span>
          {kind !== "guide" && <span className="block text-xs text-white/80">Checked by the trekking guide picked on the article</span>}
        </span>
      </div>
      <div className={cn("flex gap-2.5 rounded-xl border border-solid border-border bg-surface px-3.5 py-3", !showAuthorBox && "opacity-50")}>
        <Avatar person={person} className="size-11 border-2 border-solid border-brand bg-brand-tint text-brand" />
        <span className="flex min-w-0 flex-col gap-0.5 text-caption">
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">Written by</span>
          <strong className="text-ink">{name}</strong>
          <span className="text-text">{bio || "Short bio"}</span>
          <span className="font-bold text-brand">More guides by {firstName(name)} →</span>
        </span>
      </div>
      <span className="text-xs text-muted-foreground">
        {showAuthorBox
          ? "“More guides by…” opens the Travel guides list showing only this author’s guides. There is no separate author page."
          : "The author box is switched off: articles show only the byline."}
      </span>
    </section>
  );
};
