import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { guideListHref } from "../guideFiltering";
import type { RegionOption } from "../guideLists";

/** "Guides by region": one chip per region with guides, each opening the list filtered to it. */
export const GuideRegionLinks = ({ regions }: { regions: readonly RegionOption[] }) => (
  <section aria-labelledby="guide-regions-title" className="rounded-xl border border-line bg-surface p-5 shadow-card md:p-6">
    <h2 id="guide-regions-title" className="text-h4">
      Guides by region
    </h2>
    <ul className="mt-3.5 flex flex-wrap gap-2">
      {regions.map((region) => (
        <li key={region.slug}>
          <Link
            href={guideListHref({ region: region.slug })}
            className="inline-flex min-h-9.5 items-center gap-1.5 rounded-full border border-line bg-brand-tint px-3.5 text-caption font-bold text-ink transition-colors hover:border-brand hover:text-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Icon name="landscape" size={16} className="text-brand" />
            {region.name}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);
