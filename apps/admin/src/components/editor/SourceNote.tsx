"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { useEditorSectionLinks } from "./EditorSectionLinks";

/** Where a value that can't be typed here is changed. */
export type ValueSource =
  /** A section of this editor (its key), e.g. "itinerary". */
  | { section: string }
  /** Another admin screen, e.g. Trekking guides. */
  | { href: string; label: string }
  /** Not changed in the admin, e.g. "The same on every trek." */
  | { note: string };

type SourceNoteProps = {
  /** Where the value shows on the website, e.g. "the overview and under the heading". */
  shownIn?: string;
  from: ValueSource;
  className?: string;
};

const LINK =
  "m-0 inline-flex cursor-pointer items-center gap-0.5 rounded-sm border-0 bg-transparent p-0 font-sans text-[11px] font-bold text-brand no-underline hover:underline focus-visible:outline-2 focus-visible:outline-ring";

/** The place a section or screen is changed: a link where there is one. */
const SourceLink = ({ from }: { from: Exclude<ValueSource, { note: string }> }) => {
  const links = useEditorSectionLinks();
  if ("href" in from) {
    return (
      <Link href={from.href} className={LINK}>
        {from.label}
        <Icon name="arrow_forward" size={12} />
      </Link>
    );
  }

  const label = links?.labelOf(from.section) ?? from.section;
  if (!links) return <strong className="font-bold text-text">{label}</strong>;
  return (
    <button type="button" onClick={() => links.show(from.section)} className={LINK}>
      {label}
      <Icon name="arrow_forward" size={12} />
    </button>
  );
};

/**
 * Under a value that can't be typed here: where it shows on the website and where it is changed, e.g.
 * "Shown in the overview · change it in Day-by-day itinerary →".
 */
export const SourceNote = ({ shownIn, from, className }: SourceNoteProps) => (
  <p className={cn("m-0 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] leading-snug text-muted-foreground", className)}>
    <Icon name="lock" size={13} className="flex-none" />
    {shownIn && <span>Shown in {shownIn} ·</span>}
    {"note" in from ? (
      <span>{from.note}</span>
    ) : (
      <>
        <span>{shownIn ? "change it in" : "Change it in"}</span>
        <SourceLink from={from} />
      </>
    )}
  </p>
);
