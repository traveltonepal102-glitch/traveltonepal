import Link from "next/link";

import { ElevationChart } from "@/features/trek-detail/components/elevation/ElevationChart";
import { buildElevationProfile } from "@/features/trek-detail/elevation";
import { formatAltitude } from "@/features/treks/format";
import type { TrekSummary } from "@/features/treks/types";

import type { ArticleDay } from "../../types";
import { trekHref } from "../trekHref";
import { FOCUS } from "../styles";

type ArticleAltitudeProps = {
  heading: string;
  trek: TrekSummary;
  days: readonly ArticleDay[];
};

/** "Altitude chart": the trek's altitude day by day, drawn as on its trek page, with the high point and the highest night. */
export const ArticleAltitude = ({ heading, trek, days }: ArticleAltitudeProps) => {
  const profile = buildElevationProfile(days);
  if (!profile) return null;

  const { peak, highestNight } = profile;
  const title = heading || `${trek.name}: altitude day by day`;

  return (
    <figure className="flex flex-col gap-3 rounded-xl border border-line bg-surface p-4 md:p-5">
      <figcaption className="flex flex-wrap items-start justify-between gap-2.5">
        <span>
          <span className="block font-display text-lg font-bold text-ink">{title}</span>
          <span className="block text-xs text-muted-foreground">
            Highest night: {highestNight.place}, {formatAltitude(highestNight.altitudeM)}.{" "}
            <Link href={trekHref(trek)} className={`rounded-xs font-semibold text-brand underline underline-offset-2 hover:text-brand-hover ${FOCUS}`}>
              See the {trek.name}
            </Link>
          </span>
        </span>
        <span className="flex-none rounded-md border border-green-line bg-green-tint px-3 py-1 text-xs font-bold text-whatsapp">Peak: {formatAltitude(peak.altitudeM)}</span>
      </figcaption>
      {/* Phones scroll the chart sideways rather than shrinking its labels below reading size. */}
      <div role="region" aria-label="Altitude chart" tabIndex={0} className={`relative overflow-x-auto rounded-sm ${FOCUS}`}>
        <ElevationChart profile={profile} />
      </div>
    </figure>
  );
};
