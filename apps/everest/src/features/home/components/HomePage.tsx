import { JsonLd } from "@/components/shared/JsonLd";

import { homeJsonLd } from "../homeJsonLd";
import type { HomeData } from "../types";
import { HomeAdventures } from "./HomeAdventures";
import { HomeGuides } from "./HomeGuides";
import { OtherTreks } from "./OtherTreks";
import { TrekPageBody } from "./TrekPageBody";
import { TrekTop } from "./TrekTop";

/**
 * The home page: the website's main trek at full length (design: canvas "Everest Trek Website", Home), under the top
 * typed in Pages › Home, then the website's other treks and its blogs. Until a main trek is published, only the top and
 * what else exists.
 */
export const HomePage = ({ data }: { data: HomeData }) => {
  const { top, trek, trekCard, otherTreks, reviews, rating, guides, company, adventures } = data;
  const hasReviews = Boolean(trek?.sections.includes("reviews")) && reviews.length > 0;
  const followers = (
    <>
      <OtherTreks current={trekCard} treks={otherTreks} />
      <HomeAdventures section={adventures} />
      <HomeGuides guides={guides} />
    </>
  );

  return (
    <main id="main">
      {trek && <JsonLd data={homeJsonLd(trek, data.seo)} />}
      {trek ? (
        <TrekPageBody trek={trek} company={company} reviews={reviews} rating={rating} top={<TrekTop top={top} trek={trek} rating={rating} hasReviews={hasReviews} mainPhoto={top.photo} />}>
          {followers}
        </TrekPageBody>
      ) : (
        <>
          <TrekTop top={top} trek={null} rating={rating} hasReviews={false} mainPhoto={top.photo} />
          {followers}
        </>
      )}
    </main>
  );
};
