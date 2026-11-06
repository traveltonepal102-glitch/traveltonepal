import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { JsonLd } from "@/components/shared/JsonLd";
import { ROUTES } from "@/lib/routes";

import { homeJsonLd } from "../homeJsonLd";
import type { HomeData } from "../types";
import { BookingBand } from "./BookingBand";
import { BookingCard } from "./BookingCard";
import { BookingProvider } from "./BookingContext";
import { BookingPromises } from "./BookingPromises";
import { HomeAdventures } from "./HomeAdventures";
import { HomeGallery } from "./HomeGallery";
import { HomeGuides } from "./HomeGuides";
import { HomeTitle } from "./HomeTitle";
import { MobileBookingBar } from "./MobileBookingBar";
import { OtherTreks } from "./OtherTreks";
import { SectionMenu } from "./SectionMenu";
import { TrekFacts } from "./TrekFacts";
import { TrekSections } from "./TrekSections";

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
        <BookingProvider prices={trek.pricing.prices}>
          <SectionMenu sections={reviews.length ? trek.sections : trek.sections.filter((section) => section !== "reviews")} priceFromUsd={trek.priceFromUsd} />
          <div className="wrap flex flex-wrap items-start gap-12 pt-10 pb-22 max-md:pb-14 lg:flex-nowrap">
            <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-16 max-md:gap-12">
              {trek.facts.length > 0 && <TrekFacts facts={trek.facts} />}
              <TrekSections trek={trek} company={company} reviews={reviews} rating={rating} />
            </div>
            <section aria-labelledby="book-h" className="max-w-105 min-w-0 flex-[1_1_340px] self-stretch max-lg:order-first max-lg:max-w-none">
              {/* Stays in view beside the trek. On a screen shorter than the card it scrolls by itself (never squashed), so the buttons can always be reached; the side padding keeps its shadow from being cut off. */}
              <div id="book" className="flex flex-col gap-3 lg:sticky lg:top-21 lg:-mx-6 lg:max-h-[calc(100dvh-96px)] lg:overflow-y-auto lg:px-6 lg:pb-12 lg:[scrollbar-width:thin] *:flex-none">
                <BookingCard trekName={trek.name} shortName={trek.shortName} days={trek.days} />
                {/* On a screen too short for both, the card with its buttons comes first. */}
                <div className="[@media(max-height:999px)]:lg:hidden">
                  <BookingPromises />
                </div>
              </div>
            </section>
          </div>
          {trek.sections.includes("booking_cta") && <BookingBand name={trek.name} shortName={trek.shortName} />}
          <OtherTreks current={trekCard} treks={otherTreks} />
          <HomeAdventures section={adventures} />
          <HomeGuides guides={guides} />
          <MobileBookingBar />
        </BookingProvider>
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
