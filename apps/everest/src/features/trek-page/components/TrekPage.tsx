import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { HomeAdventures } from "@/features/home/components/HomeAdventures";
import { HomeGuides } from "@/features/home/components/HomeGuides";
import { OtherTreks } from "@/features/home/components/OtherTreks";
import { TrekPageBody } from "@/features/home/components/TrekPageBody";
import { TrekTop } from "@/features/home/components/TrekTop";
import { ROUTES } from "@/lib/routes";

import { trekPageJsonLd } from "../seo";
import type { TrekPageData } from "../types";

/** One of the website's other treks at full length: the same layout as the home page's main trek, under the trek's own top and its breadcrumbs. */
export const TrekPage = ({ data }: { data: TrekPageData }) => {
  const { top, trek, card, others, reviews, rating, company, adventures, guides } = data;
  const hasReviews = trek.sections.includes("reviews") && reviews.length > 0;

  return (
    <main id="main">
      <JsonLd data={trekPageJsonLd(data)} />
      <TrekPageBody
        trek={trek}
        company={company}
        reviews={reviews}
        rating={rating}
        top={<TrekTop top={top} trek={trek} rating={rating} hasReviews={hasReviews} before={<Breadcrumbs items={[{ label: "Startseite", href: ROUTES.home }, { label: trek.name }]} />} />}
      >
        <OtherTreks current={card} treks={others} eyebrow="Mehr entdecken" title="Weitere Treks in der Everest-Region" />
        <HomeAdventures section={adventures} />
        <HomeGuides guides={guides} />
      </TrekPageBody>
    </main>
  );
};
