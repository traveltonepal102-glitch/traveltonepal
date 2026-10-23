import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { primaryButton } from "@/components/ui/buttonStyles";

import { NEW_REGION_PATH } from "../../constants";
import type { RegionCardItem } from "../../lib/regionCard";
import { RegionGrid } from "./RegionGrid";

type RegionsOverviewProps = {
  regions: RegionCardItem[];
  canAddRegion: boolean;
};

/** The Regions screen (design: Admin-regions): heading, note, search and the region cards. */
export const RegionsOverview = ({ regions, canAddRegion }: RegionsOverviewProps) => (
  <>
    <div className="flex flex-wrap items-start gap-3.5">
      <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
        <Icon name="map" size={26} />
      </span>
      <div className="min-w-60 flex-1">
        <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
          Regions
          <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{regions.length}</span>
        </h1>
        <p className="m-0 mt-1 max-w-195 text-muted-foreground">
          Each region has a page on the main site. Here you write the region text, best months, map pin and facts.
        </p>
      </div>
      {canAddRegion && (
        <Link href={NEW_REGION_PATH} className={primaryButton}>
          <Icon name="add" />
          Add region
        </Link>
      )}
    </div>

    <p className="m-0 flex items-start gap-3 rounded-xl bg-brand-tint px-3.5 py-3 text-navy">
      <Icon name="info" className="flex-none text-brand" />
      A region&apos;s own website (like a Langtang-only site) is set up by your developer. The website doesn&apos;t show what
      you save here yet: that comes when the site is connected to the admin.
    </p>

    {regions.length ? (
      <RegionGrid regions={regions} />
    ) : (
      <p className="m-0 rounded-lg border border-dashed border-line-strong bg-surface px-6 py-12 text-center text-muted-foreground">
        No regions yet.{canAddRegion ? " Add the first one with “Add region”." : ""}
      </p>
    )}
  </>
);
