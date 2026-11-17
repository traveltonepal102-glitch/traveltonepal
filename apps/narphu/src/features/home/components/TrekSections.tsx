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
import { TrekPrices } from "./TrekPrices";
import { TrekRequest } from "./TrekRequest";
import { TrekReviews } from "./TrekReviews";
import { TrekRouteMap } from "./TrekRouteMap";
import { TrekSuitability } from "./TrekSuitability";
import { WhyBookWithUs } from "./WhyBookWithUs";

type TrekSectionsProps = { trek: HomeTrek; company: HomeCompany; reviews: readonly HomeReview[]; rating: HomeRating | null };

/** The bands with a fixed dark ground (design: the itinerary on ink, "Why book with us" on maroon); the others alternate cream and paper. */
const DARK_BANDS: Partial<Record<HomeSectionKey, string>> = { itinerary: "bg-ink", why_book: "bg-maroon" };
const LIGHT_BANDS = ["bg-paper", "bg-cream"] as const;

/** Sections with nothing to show render nothing: their band is left out with them (see `isShown`). */
const isShown = (section: HomeSectionKey, trek: HomeTrek, company: HomeCompany, reviews: readonly HomeReview[]) => {
  if (section === "booking_cta") return false;
  if (section === "route_map") return Boolean(trek.routeMap);
  if (section === "reviews") return reviews.length > 0;
  if (section === "founder") return Boolean(company.storyTeaser);
  if (section === "why_book") return company.promises.length > 0;
  return true;
};

/**
 * A trek's sections in the order set in its editor, each as a band as wide as the page (design: canvas "Nar Phu Trek
 * Website", Home). Light bands alternate between paper and cream in that order, so two of the same colour never meet;
 * the dark ones keep theirs. The altitude chart is part of the itinerary, and the "Other treks" band stands for the
 * similar treks.
 */
export const TrekSections = ({ trek, company, reviews, rating }: TrekSectionsProps) => {
  const blocks: Record<HomeSectionKey, ReactNode> = {
    intro: <TrekIntro intro={trek.intro} photo={trek.photos[1] ?? trek.photos[0]} guide={trek.guides.team.find((guide) => guide.quote)} />,
    founder: <FounderStory company={company} />,
    consultation: <TrekConsultation name={trek.name} />,
    highlights: <TrekHighlights highlights={trek.highlights} photos={trek.photos} />,
    suitability: <TrekSuitability suitability={trek.suitability} />,
    itinerary: <TrekItinerary name={trek.name} itinerary={trek.itinerary} />,
    guides: <TrekGuides guides={trek.guides} />,
    // The best months follow the prices: both are about when and how much.
    pricing: (
      <div className="flex flex-col gap-16">
        {trek.pricing.prices.length > 0 && <TrekPrices pricing={trek.pricing} trekName={trek.name} days={trek.days} />}
        {trek.months && <BestMonths heading={trek.months.heading} line={trek.months.line} ratings={trek.months.ratings} />}
      </div>
    ),
    inclusions: <TrekInclusions inclusions={trek.inclusions} meals={trek.meals} />,
    route_map: trek.routeMap && <TrekRouteMap name={trek.name} routeMap={trek.routeMap} days={trek.itinerary.days} />,
    why_book: <WhyBookWithUs company={company} />,
    credentials: <TrekCredentials />,
    packing: <TrekPacking packing={trek.packing} />,
    field_guide: <TrekFieldGuide fieldGuide={trek.fieldGuide} />,
    reviews: <TrekReviews reviews={reviews} rating={rating} />,
    booking_form: <TrekRequest name={trek.name} days={trek.days} photo={trek.photos[2] ?? trek.photos[0]} />,
    faq: <TrekFaq faq={trek.faq} trekName={trek.name} />,
    // As wide as the page: TrekPageBody shows it after these bands.
    booking_cta: null,
  };

  let light = 0;
  return trek.sections
    .filter((section) => isShown(section, trek, company, reviews))
    .map((section) => {
      const ground = DARK_BANDS[section] ?? LIGHT_BANDS[light++ % LIGHT_BANDS.length];
      return (
        <div key={section} className={`${ground} py-20 max-md:py-14`}>
          <div className="wrap">{blocks[section]}</div>
        </div>
      );
    });
};
