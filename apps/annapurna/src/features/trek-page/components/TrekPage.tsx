import { JsonLd } from "@/components/shared/JsonLd";
import { HomeAdventures } from "@/features/home/components/HomeAdventures";
import { HomeGuides } from "@/features/home/components/HomeGuides";
import { OtherTreks } from "@/features/home/components/OtherTreks";
import { TrekPageBody } from "@/features/home/components/TrekPageBody";
import { TrekTop } from "@/features/home/components/TrekTop";
import { ROUTES } from "@/lib/routes";

import { trekPageJsonLd } from "../seo";
import type { TrekPageData } from "../types";

/** One of the website's other treks at full length: the same layout as the home page's main trek, under the trek's own top. */
export const TrekPage = ({ data }: { data: TrekPageData }) => {
  const { top, trek, card, others, reviews, rating, company, adventures, guides } = data;

  return (
    <main id="main">
      <JsonLd data={trekPageJsonLd(data)} />
      <TrekTop
        breadcrumbs={[{ label: "Home", href: ROUTES.home }, { label: trek.name }]}
        top={top}
        trek={trek}
        rating={rating}
        hasReviews={trek.sections.includes("reviews") && reviews.length > 0}
      />
      <TrekPageBody trek={trek} company={company} reviews={reviews} rating={rating}>
        <OtherTreks current={card} treks={others} eyebrow="More treks" title="Other treks we guide" />
        <HomeAdventures section={adventures} />
        <HomeGuides guides={guides} />
      </TrekPageBody>
    </main>
  );
};
