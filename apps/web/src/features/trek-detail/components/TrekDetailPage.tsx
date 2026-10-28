import { JsonLd } from "@/components/shared/JsonLd";
import { NewsletterBand } from "@/features/newsletter/components/NewsletterBand";
import { getPublishedReviews } from "@/features/reviews/services/reviewsRepository";

import { defaultGroupIndex } from "../pricing";
import { trekPageReviews } from "../reviews";
import { trekBreadcrumbs, trekJsonLd } from "../seo";
import type { SharedSection, TrekDetail } from "../types";
import { BookingCard } from "./booking/BookingCard";
import { BookingSelectionProvider } from "./booking/BookingSelection";
import { DirectConsultationCard } from "./DirectConsultationCard";
import { TrekElevation } from "./elevation/TrekElevation";
import { TrekFaq } from "./faq/TrekFaq";
import { FounderStoryCard } from "./FounderStoryCard";
import { TrekGallery } from "./gallery/TrekGallery";
import { TrekGuides } from "./guides/TrekGuides";
import { TrekItinerary } from "./itinerary/TrekItinerary";
import { MobileBookingBar } from "./MobileBookingBar";
import { TrekPricing } from "./pricing/TrekPricing";
import { BookingCallout } from "./request/BookingCallout";
import { TrekRequestSection } from "./request/TrekRequestSection";
import { TrekRouteMap } from "./route/TrekRouteMap";
import { SimilarTreks } from "./SimilarTreks";
import { TrekCredentials } from "./TrekCredentials";
import { TrekDifferentiators } from "./TrekDifferentiators";
import { TrekFieldGuide } from "./TrekFieldGuide";
import { TrekHighlights } from "./TrekHighlights";
import { TrekInclusions } from "./TrekInclusions";
import { TrekIntroduction } from "./TrekIntroduction";
import { TrekOverview } from "./TrekOverview";
import { TrekPacking } from "./TrekPacking";
import { TrekReviews } from "./TrekReviews";
import { TrekSectionNav } from "./TrekSectionNav";
import { TrekSuitability } from "./TrekSuitability";
import { TrekTitle } from "./TrekTitle";
import { TrekTopBar } from "./TrekTopBar";
import { WhyBookWithUs } from "./WhyBookWithUs";

/**
 * Trek page (design: Trek.dc.html). The provider shares the chosen group size and start day between
 * the booking card, the pricing section and both request forms. Shared sections the trek hides are left out.
 */
export const TrekDetailPage = async ({ trek }: { trek: TrekDetail }) => {
  const shows = (section: SharedSection) => !trek.hiddenSections.includes(section);
  const published = await getPublishedReviews();
  const reviews = shows("reviews") ? trekPageReviews(published, trek.slug) : [];
  const requestProps = { name: trek.name, days: trek.days, groupPrices: trek.groupPrices };

  return (
    <>
      <JsonLd data={trekJsonLd(trek)} />
      <TrekTopBar breadcrumbs={trekBreadcrumbs(trek)} currentSeason={trek.currentSeason} />
      <TrekTitle trek={trek} />
      <TrekSectionNav hasReviews={reviews.length > 0} />

      <BookingSelectionProvider defaultGroupIndex={defaultGroupIndex(trek.groupPrices)} monthRatings={trek.monthRatings}>
        <div className="mx-auto grid max-w-content gap-8 px-4 pt-8 pb-12 md:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
          <div className="flex min-w-0 flex-col gap-6">
            <TrekGallery photos={trek.photos} badges={trek.photoBadges} title={trek.name} />
            <TrekIntroduction paragraphs={trek.intro} photos={trek.introPhotos} />
            <TrekOverview trek={trek} />
            {shows("founder") && <FounderStoryCard />}
            {shows("consultation") && <DirectConsultationCard trekName={trek.name} />}
            <TrekHighlights heading={trek.highlightsHeading} highlights={trek.highlights} />
            <TrekSuitability trek={trek} />
            <TrekItinerary trek={trek} />
            <TrekGuides guides={trek.guides} />
            <TrekInclusions inclusions={trek.inclusions} meals={trek.meals} hiddenSections={trek.hiddenSections} />
            <TrekElevation itinerary={trek.itinerary} trailhead={trek.trailhead} />
            <TrekRouteMap name={trek.name} routeMap={trek.routeMap} routeSketch={trek.routeSketch} itinerary={trek.itinerary} />
            {shows("why_book") && <WhyBookWithUs />}
            <TrekPricing name={trek.name} days={trek.days} region={trek.region} groupPrices={trek.groupPrices} />
            {shows("credentials") && <TrekCredentials />}
            {reviews.length > 0 && <TrekReviews reviews={reviews} rating={published.rating} />}
            {shows("differentiators") && <TrekDifferentiators differentiators={trek.differentiators} />}
            {shows("booking_form") && <TrekRequestSection {...requestProps} />}
            <TrekPacking shortName={trek.shortName} packing={trek.packing} />
            <TrekFieldGuide fieldGuide={trek.fieldGuide} />
          </div>
          <BookingCard trek={trek} />
        </div>

        <TrekFaq name={trek.name} faqs={trek.faqs} />
        {shows("booking_cta") && <BookingCallout {...requestProps} shortName={trek.shortName} />}
      </BookingSelectionProvider>

      <div className="border-t border-line bg-surface py-12">
        <div className="mx-auto flex max-w-content flex-col gap-10 px-4 md:px-6">
          <SimilarTreks treks={trek.similarTreks} />
          {shows("newsletter") && <NewsletterBand badge={`Free ${trek.shortName} packing checklist`} />}
        </div>
      </div>

      <MobileBookingBar trek={trek} />
    </>
  );
};
