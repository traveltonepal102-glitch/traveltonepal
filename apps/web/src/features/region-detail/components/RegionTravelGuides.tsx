import { GuideCard } from "@/features/guides/components/GuideCard";
import type { GuideSummary } from "@/features/guides/types";
import { ROUTES } from "@/lib/routes";

import { RegionSectionHeading } from "./RegionSectionHeading";
import { WRAP } from "./styles";

type RegionTravelGuidesProps = { regionName: string; articles: readonly GuideSummary[] };

/** "Before you go": travel guides about the region, as on the Travel guides page. */
export const RegionTravelGuides = ({ regionName, articles }: RegionTravelGuidesProps) => {
  if (articles.length === 0) return null;

  return (
    <section id="travel-guides" aria-labelledby="region-articles-title" className="scroll-mt-14 border-y border-line bg-surface py-14">
      <div className={`${WRAP} flex flex-col gap-5.5`}>
        <RegionSectionHeading
          id="region-articles-title"
          kicker="Travel guides"
          title={`Before you go to ${regionName}`}
          link={{ href: ROUTES.guides, label: "All travel guides" }}
        />
        <ul className="grid gap-4.5 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <GuideCard guide={article} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
