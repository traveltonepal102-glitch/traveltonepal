import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { primaryButton } from "@/components/ui/buttonStyles";

import { NEW_TREK_PATH } from "../../constants";
import type { TrekListItem } from "../../lib/trekListItem";
import type { RegionOption } from "../../types";
import type { CopyTrekProps } from "./CopyTrekButton";
import { CopyTrekButton } from "./CopyTrekButton";
import { TrekList } from "./TrekList";

type TreksOverviewProps = {
  /** The website "Working on" shows, e.g. "Manaslu Trek". */
  siteName: string;
  treks: TrekListItem[];
  regions: RegionOption[];
  /** On a region website: "Copy a trek from Travel To Nepal". */
  copy: CopyTrekProps | null;
};

/** The Treks screen (design: Admin-treks): heading, "Add trek" (and "Copy a trek" on a region website), filters and the list. */
export const TreksOverview = ({ siteName, treks, regions, copy }: TreksOverviewProps) => (
  <>
    <div className="flex flex-wrap items-start gap-3.5">
      <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
        <Icon name="landscape" size={26} />
      </span>
      <div className="min-w-60 flex-1">
        <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
          Treks
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{treks.length}</span>
        </h1>
        <p className="m-0 mt-1 max-w-195 text-muted-foreground">
          The treks of {siteName}. Click a trek to edit it; each website has its own treks and words.
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {copy && <CopyTrekButton {...copy} />}
        <Link href={NEW_TREK_PATH} className={primaryButton}>
          <Icon name="add" />
          Add trek
        </Link>
      </div>
    </div>

    {treks.length ? (
      <TrekList treks={treks} regions={regions} />
    ) : (
      <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-muted-foreground">
        {siteName} has no treks yet. Add the first one with “Add trek”{copy ? ", or copy one from Travel To Nepal" : ""}.
      </p>
    )}
  </>
);
