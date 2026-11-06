import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { ROUTES } from "@/lib/routes";

import { homeJsonLd } from "../homeJsonLd";
import type { HomeData } from "../types";
import { HomeAdventures } from "./HomeAdventures";
import { HomeGallery } from "./HomeGallery";
import { HomeGuides } from "./HomeGuides";
import { HomeTitle } from "./HomeTitle";
import { OtherTreks } from "./OtherTreks";
import { TrekPageBody } from "./TrekPageBody";

/**
 * The home page: the region's main trek at full length (design: Manaslu-Home), under the top typed in Pages › Home, then
 * the website's other treks and its travel guides. Until a main trek is published, only the top and what else exists.
 */
export const HomePage = ({ data }: { data: HomeData }) => {
  const { top, trek, trekCard, otherTreks, reviews, rating, guides, company, adventures } = data;

  return (
    <main id="main">
      {trek && <JsonLd data={homeJsonLd(trek, data.seo)} />}
      <section aria-label="Top of the page" className="wrap flex flex-col gap-5 pt-7">
        {trek && <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, ...(trekCard ? [{ label: trekCard.region }] : []), { label: trek.name }]} />}
        <HomeTitle top={top} trek={trek} rating={rating} hasReviews={Boolean(trek?.sections.includes("reviews")) && reviews.length > 0} />
        <HomeGallery main={top.photo} photos={trek?.photos ?? []} />
      </section>

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
