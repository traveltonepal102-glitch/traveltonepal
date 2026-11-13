import { JsonLd } from "@/components/shared/JsonLd";
import { ROUTES } from "@/lib/routes";

import { homeJsonLd } from "../homeJsonLd";
import type { HomeData } from "../types";
import { HomeAdventures } from "./HomeAdventures";
import { HomeGuides } from "./HomeGuides";
import { OtherTreks } from "./OtherTreks";
import { TrekPageBody } from "./TrekPageBody";
import { TrekTop } from "./TrekTop";

/**
 * The home page: the region's main trek at full length (design: canvas "Annapurna Trekking Home Page"), under the top
 * typed in Pages › Home, then the website's other treks and its blogs. Until a main trek is published, only the top
 * and what else exists.
 */
export const HomePage = ({ data }: { data: HomeData }) => {
  const { top, trek, trekCard, otherTreks, reviews, rating, guides, company, adventures } = data;
  const breadcrumbs = trek ? [{ label: "Home", href: ROUTES.home }, ...(trekCard ? [{ label: trekCard.region }] : []), { label: trek.name }] : [];

  return (
    <main id="main">
      {trek && <JsonLd data={homeJsonLd(trek, data.seo)} />}
      <TrekTop breadcrumbs={breadcrumbs} top={top} trek={trek} rating={rating} hasReviews={Boolean(trek?.sections.includes("reviews")) && reviews.length > 0} />

      {trek ? (
        <TrekPageBody trek={trek} company={company} reviews={reviews} rating={rating}>
          <OtherTreks current={trekCard} treks={otherTreks} />
          <HomeAdventures section={adventures} />
          <HomeGuides guides={guides} />
        </TrekPageBody>
      ) : (
        <div className="pt-10">
          <OtherTreks current={null} treks={otherTreks} />
          <HomeAdventures section={adventures} />
          <HomeGuides guides={guides} />
        </div>
      )}
    </main>
  );
};
