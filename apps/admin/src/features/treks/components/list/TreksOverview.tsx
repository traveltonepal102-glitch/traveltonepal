import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { primaryButton } from "@/components/ui/buttonStyles";

import { NEW_TREK_PATH } from "../../constants";
import type { TrekListItem } from "../../lib/trekListItem";
import type { RegionOption } from "../../types";
import { TrekList } from "./TrekList";

type TreksOverviewProps = {
  treks: TrekListItem[];
  regions: RegionOption[];
};

/** The Treks screen (design: Admin-treks): heading, "Add trek", filters and the list. */
export const TreksOverview = ({ treks, regions }: TreksOverviewProps) => (
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
          Every trek on every site. Click a trek to edit its basics and photos; days, prices and dates come next.
        </p>
      </div>
      <Link href={NEW_TREK_PATH} className={primaryButton}>
        <Icon name="add" />
        Add trek
      </Link>
    </div>

    {treks.length ? (
      <TrekList treks={treks} regions={regions} />
    ) : (
      <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-muted-foreground">
        No treks yet. Add the first one with “Add trek”.
      </p>
    )}
  </>
);
