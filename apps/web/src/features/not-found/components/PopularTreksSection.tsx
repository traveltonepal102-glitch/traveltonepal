import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { TrekCard } from "@/features/treks/components/TrekCard";
import { POPULAR_TREKS } from "@/features/treks/popularTreks";
import { ROUTES } from "@/lib/routes";

const CARD_COUNT = 3;

export const PopularTreksSection = () => (
  <section aria-labelledby="popular-treks-title" className="pt-12 pb-2">
    <div className="mx-auto flex max-w-content flex-col gap-5 px-4 md:px-6">
      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="popular-treks-title" className="text-h2-sm md:text-h2">
            Popular treks
          </h2>
          <p>The treks most people come here for.</p>
        </div>
        <Link
          href={ROUTES.treks}
          className="inline-flex flex-none items-center gap-1 rounded-sm font-bold text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          All treks
          <Icon name="arrow_forward" size={18} />
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {POPULAR_TREKS.slice(0, CARD_COUNT).map((trek) => (
          <TrekCard key={trek.slug} trek={trek} />
        ))}
      </div>
    </div>
  </section>
);
