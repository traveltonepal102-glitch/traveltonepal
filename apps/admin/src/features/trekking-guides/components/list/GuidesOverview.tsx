"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";

import { NEW_GUIDE_PATH } from "../../constants";
import { NO_GUIDE_FILTERS, filterGuides, licenceStatus, spokenLanguages } from "../../lib/guideRules";
import type { TrekkingGuide } from "../../types";
import { GuideCard } from "./GuideCard";
import { GuideFilterBar } from "./GuideFilterBar";

type GuidesOverviewProps = {
  guides: TrekkingGuide[];
  regions: { id: string; name: string }[];
  /** The guide whose panel is open ("new" while adding). */
  openId: string | null;
  /** "YYYY-MM-DD" in Nepal, to mark expired licences. */
  today: string;
  /** The edit panel, when one is open. */
  panel: ReactNode;
};

/** The Trekking guides screen (design: Admin-people, tab "Trekking guides"): cards, filters and the edit panel. */
export const GuidesOverview = ({ guides, regions, openId, today, panel }: GuidesOverviewProps) => {
  const [filters, setFilters] = useState(NO_GUIDE_FILTERS);
  const shown = filterGuides(guides, filters);
  const regionName = new Map(regions.map((region) => [region.id, region.name]));
  const countLabel = shown.length === guides.length ? `${guides.length} trekking guide${guides.length === 1 ? "" : "s"}` : `${shown.length} of ${guides.length} guides`;

  return (
    <>
      <div className="flex flex-wrap items-start gap-3.5">
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Icon name="hiking" size={26} />
        </span>
        <div className="min-w-60 flex-1">
          <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
            Trekking guides
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{guides.length}</span>
          </h1>
          <p className="m-0 mt-1 max-w-195 text-muted-foreground">Add each guide once. Then pick them from a list on treks, regions and the About page.</p>
        </div>
        <Link href={NEW_GUIDE_PATH} scroll={false} className={primaryButton}>
          <Icon name="add" />
          Add trekking guide
        </Link>
      </div>

      <GuideFilterBar filters={filters} onChange={setFilters} regions={regions} languages={spokenLanguages(guides)} countLabel={countLabel} />

      <div className={cn("grid items-start gap-5", panel && "desktop:grid-cols-[minmax(0,1fr)_460px]")}>
        <ul className={cn("m-0 grid list-none gap-3.5 p-0 tablet:grid-cols-2", !panel && "desktop:grid-cols-3")}>
          {shown.map((guide) => (
            <li key={guide.id}>
              <GuideCard
                guide={guide}
                regionNames={guide.regionIds.flatMap((id) => regionName.get(id) ?? [])}
                licence={licenceStatus(guide, today)}
                isOpen={guide.id === openId}
              />
            </li>
          ))}
          {!shown.length && (
            <li className="rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground tablet:col-span-full">
              {guides.length ? "No guide matches these filters." : "No guides yet. Add the first one with “Add trekking guide”."}
            </li>
          )}
        </ul>
        {panel}
      </div>
    </>
  );
};
