import type { TrekPageSection } from "@ttn/config/trekPageSections";
import type { ReactNode } from "react";

import { NewsletterBand } from "@/features/newsletter/components/NewsletterBand";
import type { RatingSummary, Review } from "@/features/reviews/types";

import type { SharedSection, TrekDetail } from "../types";
import { DirectConsultationCard } from "./DirectConsultationCard";
import { TrekElevation } from "./elevation/TrekElevation";
import { TrekFaq } from "./faq/TrekFaq";
import { FounderStoryCard } from "./FounderStoryCard";
import { TrekGuides } from "./guides/TrekGuides";
import { TrekItinerary } from "./itinerary/TrekItinerary";
import { TrekPricing } from "./pricing/TrekPricing";
import { TrekRouteRegions } from "./regions/TrekRouteRegions";
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
import { TrekSuitability } from "./TrekSuitability";
import { WhyBookWithUs } from "./WhyBookWithUs";

type SectionBlocksOptions = {
  trek: TrekDetail;
  /** This trek's published reviews (empty when hidden or none). */
  reviews: readonly Review[];
  rating: RatingSummary | null;
};

/** Every section of the trek page with a heading, by key, so the page can show them in the trek's order. */
export const trekSectionBlocks = ({ trek, reviews, rating }: SectionBlocksOptions): Record<TrekPageSection, ReactNode> => {
  const shows = (section: SharedSection) => !trek.hiddenSections.includes(section);
  const requestProps = { name: trek.name, days: trek.days, groupPrices: trek.groupPrices };

  return {
    intro: <TrekIntroduction body={trek.intro} />,
    overview: <TrekOverview trek={trek} />,
    founder: shows("founder") && <FounderStoryCard />,
    consultation: shows("consultation") && <DirectConsultationCard trekName={trek.name} />,
    highlights: <TrekHighlights heading={trek.highlightsHeading} highlights={trek.highlights} />,
    suitability: <TrekSuitability trek={trek} />,
    regions: <TrekRouteRegions routeStops={trek.routeStops} monthRatings={trek.monthRatings} />,
    itinerary: <TrekItinerary trek={trek} />,
    guides: <TrekGuides guides={trek.guides} />,
    inclusions: <TrekInclusions inclusions={trek.inclusions} meals={trek.meals} hiddenSections={trek.hiddenSections} />,
    elevation: <TrekElevation itinerary={trek.itinerary} trailhead={trek.trailhead} />,
    route_map: <TrekRouteMap name={trek.name} routeMap={trek.routeMap} routeSketch={trek.routeSketch} itinerary={trek.itinerary} />,
    why_book: shows("why_book") && <WhyBookWithUs />,
    pricing: <TrekPricing name={trek.name} days={trek.days} route={trek.route} groupPrices={trek.groupPrices} />,
    credentials: shows("credentials") && <TrekCredentials />,
    reviews: reviews.length > 0 && <TrekReviews reviews={reviews} rating={rating} />,
    differentiators: shows("differentiators") && <TrekDifferentiators differentiators={trek.differentiators} />,
    booking_form: shows("booking_form") && <TrekRequestSection {...requestProps} />,
    packing: <TrekPacking shortName={trek.shortName} packing={trek.packing} />,
    field_guide: <TrekFieldGuide fieldGuide={trek.fieldGuide} />,
    faq: <TrekFaq name={trek.name} faqs={trek.faqs} />,
    booking_cta: shows("booking_cta") && <BookingCallout {...requestProps} shortName={trek.shortName} />,
    similar: <SimilarTreks treks={trek.similarTreks} />,
    newsletter: shows("newsletter") && <NewsletterBand badge={`Free ${trek.shortName} packing checklist`} />,
  };
};
