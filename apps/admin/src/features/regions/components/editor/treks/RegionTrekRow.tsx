"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { secondaryButton } from "@/components/ui/buttonStyles";
import { PhotoImage } from "@/features/photos/components/PhotoImage";
import { difficultyOf, trekPath } from "@/features/treks/constants";
import type { SimilarTrekOption } from "@/features/treks/types";

type RegionTrekRowProps = {
  trek: SimilarTrekOption;
  /** null for a new region. */
  regionId: string | null;
  isFeatured: boolean;
  /** Ticked to show under the featured trek. */
  isShown: boolean;
  /** False once three are ticked (only unticking is possible then). */
  canShow: boolean;
  onFeature: () => void;
  onToggleShow: () => void;
};

const CHOICE = "flex cursor-pointer items-center gap-2 text-caption font-bold";

/** One of the region's treks: feature it, or tick it to show under the featured one. */
export const RegionTrekRow = ({ trek, regionId, isFeatured, isShown, canShow, onFeature, onToggleShow }: RegionTrekRowProps) => (
  <li className={cn("flex flex-wrap items-center gap-3 rounded-lg border border-solid p-2.5", isFeatured || isShown ? "border-brand/30 bg-brand-tint" : "border-border")}>
    <span className="inline-flex h-14 w-20 flex-none items-center justify-center overflow-hidden rounded-md bg-page text-subtle">
      {trek.cover ? <PhotoImage photo={trek.cover} alt="" sizes="80px" className="h-full w-full object-cover" /> : <Icon name="landscape" size={24} />}
    </span>
    <span className="min-w-0 flex-1">
      <span className="block truncate font-bold text-ink">{trek.name}</span>
      <span className="block text-caption text-muted-foreground">
        {trek.days} days · {difficultyOf(trek.difficulty).label}
        {trek.regionId !== regionId && ` · Passes through, starts in ${trek.regionName}`}
      </span>
    </span>
    <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
      {!isFeatured && (
        <label className={cn(CHOICE, !canShow && !isShown && "cursor-not-allowed opacity-50")}>
          <input type="checkbox" checked={isShown} disabled={!canShow && !isShown} onChange={onToggleShow} className="size-4 accent-brand" />
          <span className={isShown ? "text-brand" : "text-muted-foreground"}>{isShown ? "Shown under it" : "Also show"}</span>
        </label>
      )}
      <label className={CHOICE}>
        <input
          type="radio"
          // Not read on Save (the hidden featuredTrekId is): the shared name groups the radios for arrow keys.
          name="featuredTrekChoice"
          checked={isFeatured}
          onChange={onFeature}
          className="size-4 accent-brand"
        />
        <span className={isFeatured ? "text-brand" : "text-muted-foreground"}>{isFeatured ? "Featured trek" : "Feature this"}</span>
      </label>
      <Link href={trekPath(trek.id)} className={cn(secondaryButton, "min-h-8 px-3 text-caption max-tablet:hidden")}>
        Edit trek
      </Link>
    </span>
  </li>
);
