import type { SiteImageSource } from "@ttn/site-data/images";
import type { ReactNode } from "react";

import { SITE_NAME } from "@/lib/site";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { BookingCard } from "./BookingCard";
import { HomeGallery } from "./HomeGallery";
import { HomeTitle } from "./HomeTitle";
import { TrekFacts } from "./TrekFacts";

type TrekTopProps = {
  top: HomeTop;
  trek: HomeTrek | null;
  rating: HomeRating | null;
  hasReviews: boolean;
  /** The page's chosen photo, shown first. */
  mainPhoto?: SiteImageSource;
  /** Above the title on a trek's own page (its breadcrumbs); the home page has none. */
  before?: ReactNode;
};

/**
 * The top of a trek's page (design: Home, top): on cream, the words and the photo mosaic in one column with the booking
 * card beside them, the photos filling the height down to the card's end; then the key facts across the page. Without
 * a trek (a website still being set up), only the words and photos.
 */
export const TrekTop = ({ top, trek, rating, hasReviews, mainPhoto, before }: TrekTopProps) => (
  <section aria-label="Top of the page" className="bg-cream">
    <div className="wrap flex flex-col gap-8 pt-11 pb-12 max-md:pt-7">
      {before}
      <div className={`grid gap-8 lg:gap-10 ${trek ? "lg:grid-cols-[minmax(0,1fr)_400px]" : ""}`}>
        <div className="flex min-w-0 flex-col gap-8">
          <HomeTitle top={top} trek={trek} rating={rating} hasReviews={hasReviews} />
          <HomeGallery main={mainPhoto} photos={trek?.photos ?? []} title={trek?.name ?? SITE_NAME} />
        </div>
        {trek && (
          <div id="book" className="self-start scroll-mt-24">
            <BookingCard trekName={trek.name} shortName={trek.shortName} days={trek.days} />
          </div>
        )}
      </div>
      {trek && trek.facts.length > 0 && <TrekFacts facts={trek.facts} />}
    </div>
  </section>
);
