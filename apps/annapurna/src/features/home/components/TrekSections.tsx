import type { ReactNode } from "react";

import type { HomeCompany, HomeRating, HomeReview, HomeSectionKey, HomeTrek } from "../types";
import { BestMonths } from "./BestMonths";
import { FounderStory } from "./FounderStory";
import { TrekConsultation } from "./TrekConsultation";
import { TrekCredentials } from "./TrekCredentials";
import { TrekFaq } from "./TrekFaq";
import { TrekFieldGuide } from "./TrekFieldGuide";
import { TrekGuides } from "./TrekGuides";
import { TrekHighlights } from "./TrekHighlights";
import { TrekInclusions } from "./TrekInclusions";
import { TrekIntro } from "./TrekIntro";
import { TrekItinerary } from "./TrekItinerary";
import { TrekPacking } from "./TrekPacking";
import { TrekRequest } from "./TrekRequest";
import { TrekReviews } from "./TrekReviews";
import { TrekRouteMap } from "./TrekRouteMap";
import { TrekSuitability } from "./TrekSuitability";
import { WhyBookWithUs } from "./WhyBookWithUs";

type TrekSectionsProps = { trek: HomeTrek; company: HomeCompany; reviews: readonly HomeReview[]; rating: HomeRating | null };

/**
 * A trek's sections in the order set in its editor, each in this website's design, one under the other. The altitude
 * chart ("elevation" on a trek page) is part of the itinerary here, and the "Other treks" band stands for the
 * similar treks.
 */
export const TrekSections = ({ trek, company, reviews, rating }: TrekSectionsProps) => {
  const blocks: Record<HomeSectionKey, ReactNode> = {
    intro: <TrekIntro intro={trek.intro} />,
    founder: <FounderStory company={company} />,
    consultation: <TrekConsultation name={trek.name} />,
    highlights: <TrekHighlights highlights={trek.highlights} />,
    suitability: <TrekSuitability suitability={trek.suitability} />,
    itinerary: <TrekItinerary name={trek.name} itinerary={trek.itinerary} />,
    guides: <TrekGuides guides={trek.guides} />,
    // The booking card beside the page has the group prices, so this section is the best months.
    pricing: trek.months && <BestMonths heading={trek.months.heading} line={trek.months.line} ratings={trek.months.ratings} />,
    inclusions: <TrekInclusions inclusions={trek.inclusions} meals={trek.meals} />,
    route_map: trek.routeMap && <TrekRouteMap name={trek.name} routeMap={trek.routeMap} />,
    why_book: <WhyBookWithUs company={company} />,
    credentials: <TrekCredentials />,
    packing: <TrekPacking packing={trek.packing} />,
    field_guide: <TrekFieldGuide fieldGuide={trek.fieldGuide} />,
    reviews: <TrekReviews reviews={reviews} rating={rating} />,
    booking_form: <TrekRequest name={trek.name} days={trek.days} />,
    faq: <TrekFaq faq={trek.faq} />,
    // As wide as the page: TrekPageBody shows it after these columns.
    booking_cta: null,
  };

  return trek.sections.map((section) => <div key={section} className="contents">{blocks[section]}</div>);
};
