import type { GuideDay } from "@ttn/site-data/guideBlocks";
import Link from "next/link";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { AltitudeChart } from "@/features/home/components/AltitudeChart";
import { ItineraryDayCard } from "@/features/home/components/ItineraryDayCard";
import { trekFacts } from "@/features/home/trekFacts";
import type { HomeDay, HomeTrekCard } from "@/features/home/types";

const toHomeDay = ({ dayNumber, title, subtitle, duration, altitudeM, isHighPoint, body }: GuideDay): HomeDay => ({ number: dayNumber, title, subtitle, duration, altitudeM, isHighPoint, body });

/** A trek named in the blog, as one link. */
export const BlogTrekCard = ({ trek }: { trek: HomeTrekCard }) => {
  const inner = (
    <>
      <span className="relative block aspect-4/3 w-24 flex-none overflow-hidden rounded-[10px] bg-forest-tint sm:w-36">{trek.image && <SiteImage image={{ ...trek.image, alt: "" }} sizes="144px" className="object-cover" />}</span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="font-display text-xl leading-6.5 font-semibold text-ink">{trek.name}</span>
        <span className="text-[15px] leading-5.5 text-muted">{trekFacts(trek)}</span>
      </span>
    </>
  );
  const box = "flex items-center gap-4 rounded-2xl border border-solid border-line p-3 text-text no-underline";
  return trek.hasPage ? (
    <Link href={trek.href} className={`${box} shadow-card hover:border-forest`}>
      {inner}
      <TrailIcon name="arrow" size={18} className="mr-2 ml-auto flex-none text-forest max-sm:hidden" />
    </Link>
  ) : (
    <div className={box}>{inner}</div>
  );
};

/** Some days from a trek's plan, with their number in the trek, and the way to the whole plan. */
export const BlogDays = ({ trek, days }: { trek: HomeTrekCard; days: readonly GuideDay[] }) => (
  <section aria-label={`Days from the ${trek.name}`} className="flex flex-col gap-2">
    <ol>
      {days.map((day) => (
        <ItineraryDayCard key={day.dayNumber} day={toHomeDay(day)} />
      ))}
    </ol>
    {trek.hasPage && (
      <Link href={trek.href} className="inline-flex min-h-11 items-center gap-1.5 self-start font-semibold">
        See every day of the {trek.name}
        <TrailIcon name="arrow" size={16} />
      </Link>
    )}
  </section>
);

/** The altitude of a trek's whole plan. */
export const BlogAltitude = ({ heading, trek, days }: { heading: string; trek: HomeTrekCard; days: readonly GuideDay[] }) => (
  <section aria-label={heading || `Altitude on the ${trek.name}`} className="flex flex-col gap-3">
    {heading && <h3>{heading}</h3>}
    <AltitudeChart days={days.map(toHomeDay)} />
  </section>
);
