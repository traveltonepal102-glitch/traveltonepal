import { Icon } from "@ttn/ui/icon";

import { ICON_TONES } from "@/components/shared/iconTones";
import { RichText } from "@/components/shared/RichText";

import type { RegionDetail } from "../types";
import { RegionLocationCard } from "./RegionLocationCard";
import { WRAP } from "./styles";

/** "About the region": what the valley is like and who it suits, beside the location card. */
export const RegionOverview = ({ region }: { region: RegionDetail }) => {
  const { overview } = region;

  return (
    <section id="overview" aria-labelledby="region-overview-title" className={`${WRAP} scroll-mt-14 py-14`}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4.5">
          <p className="text-eyebrow text-brand uppercase">About the region</p>
          <h2 id="region-overview-title" className="text-h2-sm md:text-h2">
            {overview.heading}
          </h2>
          <RichText doc={overview.introduction} className="flex flex-col gap-4.5 text-body-lg text-text" />
          {region.bestForTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-caption font-bold text-muted-foreground">Best for:</span>
              <ul className="contents">
                {region.bestForTags.map((item) => (
                  <li key={item} className="rounded-full bg-brand-tint px-3 py-1.5 text-caption font-bold text-navy">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {overview.points.length > 0 && (
            <ul className="mt-1.5 grid gap-4.5 sm:grid-cols-2">
              {overview.points.map((point) => (
                <li key={point.title} className="flex items-start gap-3">
                  <span aria-hidden="true" className={`inline-flex size-10.5 flex-none items-center justify-center rounded-xl ${ICON_TONES[point.tone]}`}>
                    <Icon name={point.icon} size={22} />
                  </span>
                  <div>
                    <h3 className="text-base font-bold">{point.title}</h3>
                    {point.text && <p className="text-body-sm text-muted-foreground">{point.text}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <RegionLocationCard region={region} />
      </div>
    </section>
  );
};
