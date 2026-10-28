import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import type { ReactNode } from "react";

import { primaryButton } from "@/components/ui/buttonStyles";

import { NEW_ADVENTURE_PATH } from "../constants";
import type { Adventure, AdventureSectionValues } from "../types";
import { AdventureListCard } from "./AdventureListCard";
import { SectionTextCard } from "./SectionTextCard";

type AdventuresOverviewProps = {
  adventures: Adventure[];
  section: AdventureSectionValues;
  /** The adventure whose panel is open ("new" while adding). */
  openId: string | null;
  /** The edit drawer, when one is open (it shows over the list). */
  panel: ReactNode;
  /** What the last save did, e.g. "Adventure saved."; null when there is nothing to say. */
  savedNotice: string | null;
};

/** The Adventures screen: the section's words, then every card in carousel order, and the edit drawer. */
export const AdventuresOverview = ({ adventures, section, openId, panel, savedNotice }: AdventuresOverviewProps) => {
  const onWebsite = adventures.filter((adventure) => adventure.isShown).length;

  return (
    <>
      <div className="flex flex-wrap items-start gap-3.5">
        <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
          <Icon name="travel_explore" size={26} />
        </span>
        <div className="min-w-60 flex-1">
          <h1 className="m-0 flex items-center gap-2.5 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
            Adventures
            <span className="rounded-full bg-muted px-2.5 py-0.5 font-sans text-caption font-bold text-text">{onWebsite} on website</span>
          </h1>
          <p className="m-0 mt-1 max-w-195 text-muted-foreground">
            Experiences beyond trekking that you plan on request, shown in a carousel on the home page (“{section.heading}”). They have no page of their own:
            visitors ask on WhatsApp or by email. The section shows once at least one card is on the website.
          </p>
        </div>
        <Link href={NEW_ADVENTURE_PATH} scroll={false} className={primaryButton}>
          <Icon name="add" />
          Add adventure
        </Link>
      </div>

      {savedNotice && (
        <p role="status" className="m-0 inline-flex items-center gap-1.5 self-start rounded-full bg-green-tint px-3 py-1 text-caption font-bold text-whatsapp">
          <Icon name="check_circle" size={16} />
          {savedNotice} The website shows the change within seconds.
        </p>
      )}
      <SectionTextCard values={section} />

      <ul className="m-0 grid list-none gap-3.5 p-0 tablet:grid-cols-2 desktop:grid-cols-3">
        {adventures.map((adventure) => (
          <li key={adventure.id}>
            <AdventureListCard adventure={adventure} isOpen={adventure.id === openId} />
          </li>
        ))}
        {!adventures.length && (
          <li className="rounded-lg border border-dashed border-line-strong bg-surface px-6 py-10 text-center text-muted-foreground tablet:col-span-full">
            No adventures yet. Add the first one with “Add adventure”.
          </li>
        )}
      </ul>
      {panel}
    </>
  );
};
