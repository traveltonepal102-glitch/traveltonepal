import type { ReactNode } from "react";

import type { HomeCompany, HomeRating, HomeReview, HomeTrek } from "../types";
import { BookingBand } from "./BookingBand";
import { BookingCard } from "./BookingCard";
import { BookingProvider } from "./BookingContext";
import { BookingPromises } from "./BookingPromises";
import { MobileBookingBar } from "./MobileBookingBar";
import { SectionMenu } from "./SectionMenu";
import { TrekFacts } from "./TrekFacts";
import { TrekSections } from "./TrekSections";

type TrekPageBodyProps = { trek: HomeTrek; company: HomeCompany; reviews: readonly HomeReview[]; rating: HomeRating | null; children: ReactNode };

/**
 * A trek at full length under its page's top, on the home page and on a trek's own page: the promises band, the menu
 * that appears at the top on scrolling, its sections beside the booking card (which stays in view), and what follows
 * them (`children`).
 */
export const TrekPageBody = ({ trek, company, reviews, rating, children }: TrekPageBodyProps) => (
  <BookingProvider prices={trek.pricing.prices}>
    <BookingPromises />
    <SectionMenu sections={reviews.length ? trek.sections : trek.sections.filter((section) => section !== "reviews")} />
    <div className="wrap flex flex-wrap items-start gap-12 pt-14 pb-20 max-md:pt-10 max-md:pb-14 lg:flex-nowrap">
      {/* Never wider than the page beside the card, so its text fills it (no 72ch gap before the card). */}
      <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-16 [--text-measure:none] max-md:gap-12">
        {trek.facts.length > 0 && <TrekFacts facts={trek.facts} />}
        <TrekSections trek={trek} company={company} reviews={reviews} rating={rating} />
      </div>
      <section aria-labelledby="book-h" className="max-w-105 min-w-0 flex-[1_1_340px] self-stretch max-lg:order-first max-lg:max-w-none">
        {/* Stays in view beside the trek. On a screen shorter than the card it scrolls by itself (never squashed), so the buttons can always be reached; the side padding keeps its shadow from being cut off. */}
        <div id="book" className="lg:sticky lg:top-21 lg:-mx-6 lg:max-h-[calc(100dvh-96px)] lg:overflow-y-auto lg:px-6 lg:pb-12 lg:scrollbar-thin">
          <BookingCard trekName={trek.name} shortName={trek.shortName} days={trek.days} />
        </div>
      </section>
    </div>
    {trek.sections.includes("booking_cta") && <BookingBand name={trek.name} shortName={trek.shortName} />}
    {children}
    <MobileBookingBar trekName={trek.name} days={trek.days} />
  </BookingProvider>
);
