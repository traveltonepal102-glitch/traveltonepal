import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { TrekCard } from "@/features/treks/components/TrekCard";
import type { TrekSummary } from "@/features/treks/types";
import { ROUTES } from "@/lib/routes";

import { homeTrekFilters } from "../homeContent";
import { SeeAllTreksCard } from "./SeeAllTreksCard";
import { SwipeHint } from "./SwipeHint";
import { TrekFilterList } from "./TrekFilterList";

const ALL = "all";

const Heading = () => (
  <div className="flex flex-col gap-2.5">
    <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
      <Icon name="hiking" size={18} />
      Most loved
    </p>
    <h2 id="treks-title" className="text-h2 tracking-tight md:text-h1">
      Treks trekkers book first
    </h2>
  </div>
);

/** "Treks trekkers book first" (design: Main.dc.html): filter chips, trek cards, a way to all treks. */
export const TreksSection = ({ treks }: { treks: TrekSummary[] }) => {
  // Nothing published yet: no section, rather than an empty one.
  if (treks.length === 0) return null;
  const filters = homeTrekFilters(treks);

  return (
    <section id="treks" aria-labelledby="treks-title" className="bg-muted py-16 md:py-24">
      <div className="mx-auto flex max-w-content flex-col gap-8 px-4 md:px-6">
        <TrekFilterList
          heading={<Heading />}
          allKey={ALL}
          // No chip matches any trek: no chips, not a lone "All".
          filters={filters.length === 0 ? [] : [{ key: ALL, label: "All" }, ...filters.map(({ key, label }) => ({ key, label }))]}
          treks={treks.map((trek) => ({
            slug: trek.slug,
            filterKeys: filters.filter((filter) => filter.matches(trek)).map((filter) => filter.key),
            card: <TrekCard trek={trek} />,
          }))}
          endCard={<SeeAllTreksCard />}
        />
        <SwipeHint text="Swipe to see more treks" linkLabel="All treks" href={ROUTES.treks} />
        <ButtonLink href={ROUTES.treks} variant="outline" trailingIcon="arrow_forward" className="self-center max-md:hidden">
          See all treks in Nepal
        </ButtonLink>
      </div>
    </section>
  );
};
