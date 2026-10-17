import Image from "next/image";
import Link from "next/link";

import { RegionTileArt } from "@/features/regions/components/RegionTileArt";
import { treksFilterPath } from "@/features/treks/filters";
import { formatAltitude } from "@/features/treks/format";
import { ROUTES, regionPath } from "@/lib/routes";

import { hasRegionPage, regionDaysLabel, regionsToCompare } from "../regionDetails";
import { RegionSectionHeading } from "./RegionSectionHeading";
import { CARD, WRAP } from "./styles";

/** "Compare with other regions": each card opens the region's page, or its treks while it has no page. */
export const OtherRegions = ({ slugs }: { slugs: readonly string[] }) => {
  const regions = regionsToCompare(slugs);
  if (regions.length === 0) return null;

  return (
    <section aria-labelledby="region-others-title" className="pb-14">
      <div className={`${WRAP} flex flex-col gap-5.5`}>
        <RegionSectionHeading
          id="region-others-title"
          kicker="Other regions"
          title="Compare with other regions"
          link={{ href: ROUTES.regions, label: "All regions" }}
        />
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {regions.map((region) => (
            <li key={region.slug}>
              <Link
                href={hasRegionPage(region.slug) ? regionPath(region.slug) : treksFilterPath({ region: region.slug })}
                className={`${CARD} block overflow-hidden text-inherit transition-shadow hover:shadow-raised focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`}
              >
                <span className="relative block h-37.5 bg-navy">
                  {region.image ? (
                    <Image src={region.image.src} alt="" fill sizes="(min-width: 1280px) 300px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  ) : (
                    <RegionTileArt />
                  )}
                  <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy/0 from-40% to-navy/80" />
                  <span className="absolute bottom-2.5 left-3.5 font-display text-xl font-bold text-white">{region.name}</span>
                </span>
                <span className="flex justify-between gap-2 px-3.5 py-3 text-caption font-normal text-text">
                  <span>{regionDaysLabel(region.slug) ?? "Custom routes"}</span>
                  <span>max {formatAltitude(region.maxAltitudeM)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
