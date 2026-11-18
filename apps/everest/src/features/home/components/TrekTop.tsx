import type { SiteImageSource } from "@ttn/site-data/images";
import type { ReactNode } from "react";

import { SiteImage } from "@/components/ui/SiteImage";

import type { HomeRating, HomeTop, HomeTrek } from "../types";
import { BookingCard } from "./BookingCard";
import { HeroAltitudeRibbon } from "./HeroAltitudeRibbon";
import { HomeGallery } from "./HomeGallery";
import { HomeTitle } from "./HomeTitle";
import { TrekFacts } from "./TrekFacts";

type TrekTopProps = {
  top: HomeTop;
  trek: HomeTrek | null;
  rating: HomeRating | null;
  hasReviews: boolean;
  /** The page's chosen photo: the hero's background. */
  mainPhoto?: SiteImageSource;
  /** Above the title on a trek's own page (its breadcrumbs); the home page has none. */
  before?: ReactNode;
};

/**
 * The hero photo fills the screen's width. Below lg it lies under an 80% navy veil, so a smaller file looks the same and
 * the page's first large paint (LCP) comes sooner on a phone.
 */
const HERO_SIZES = "(min-width: 1024px) 100vw, 50vw";

/**
 * The top of a trek's page (design: canvas "Everest Trek Website", Home top): the page's photo across the screen under
 * a navy veil, the words, the altitude ribbon and the booking card on it; then, on ice, the key facts and the photo
 * mosaic. The photo is the page's largest picture (LCP): preloaded and fetched first. Without a trek (a website still
 * being set up), only the words on the photo.
 */
export const TrekTop = ({ top, trek, rating, hasReviews, mainPhoto, before }: TrekTopProps) => {
  const heroPhoto = mainPhoto ?? top.photo ?? trek?.photos[0];
  const galleryPhotos = (trek?.photos ?? []).filter((photo) => photo.src !== heroPhoto?.src);

  return (
    <>
      <section aria-labelledby="top-title" className="relative isolate overflow-hidden bg-ink text-on-ocean-muted">
        {heroPhoto && (
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <SiteImage image={{ ...heroPhoto, alt: "" }} sizes={HERO_SIZES} isPriority className="hero-photo object-cover object-[50%_35%]" />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(11_37_69/0.94)_0%,rgb(11_37_69/0.78)_45%,rgb(11_37_69/0.35)_100%)] max-lg:bg-ink/80" />
          </div>
        )}
        <div className="wrap flex flex-col gap-7 pt-8 pb-12 lg:pt-12 lg:pb-16">
          {before && <div className="[&_a]:text-on-ink-label [&_a:hover]:text-snow [&_nav]:text-on-ink-label [&_[aria-current]]:text-snow">{before}</div>}
          <div className={`grid items-start gap-10 ${trek ? "lg:grid-cols-[minmax(0,1fr)_400px]" : ""}`}>
            <div className="flex min-w-0 flex-col gap-8 lg:pt-6">
              <HomeTitle top={top} trek={trek} rating={rating} hasReviews={hasReviews} />
              {trek && <HeroAltitudeRibbon days={trek.itinerary.days} />}
            </div>
            {trek && (
              <div id="book" className="scroll-mt-24">
                <BookingCard trekName={trek.name} shortName={trek.shortName} days={trek.days} />
              </div>
            )}
          </div>
        </div>
      </section>
      {trek && (trek.facts.length > 0 || galleryPhotos.length > 0) && (
        <section aria-label="Der Trek auf einen Blick" className="bg-ice">
          <div className="wrap flex flex-col gap-8 py-10">
            {trek.facts.length > 0 && <TrekFacts facts={trek.facts} />}
            <HomeGallery photos={galleryPhotos} title={trek.name} />
          </div>
        </section>
      )}
    </>
  );
};
