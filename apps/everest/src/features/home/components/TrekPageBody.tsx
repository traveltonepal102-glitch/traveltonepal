import type { ReactNode } from "react";

import type { HomeCompany, HomeRating, HomeReview, HomeTrek } from "../types";
import { BookingBand } from "./BookingBand";
import { BookingProvider } from "./BookingContext";
import { MobileBookingBar } from "./MobileBookingBar";
import { SectionMenu } from "./SectionMenu";
import { TrekSections } from "./TrekSections";

type TrekPageBodyProps = {
  trek: HomeTrek;
  company: HomeCompany;
  reviews: readonly HomeReview[];
  rating: HomeRating | null;
  /** The page's top (TrekTop): inside the booking, as its card chooses the group the rest of the page follows. */
  top: ReactNode;
  children: ReactNode;
};

/**
 * A trek at full length, on the home page and on a trek's own page: its top with the booking card, the menu that stays
 * in view, its sections as full-width bands in the trek's own order, and what follows them (`children`).
 */
export const TrekPageBody = ({ trek, company, reviews, rating, top, children }: TrekPageBodyProps) => (
  <BookingProvider prices={trek.pricing.prices}>
    {top}
    <SectionMenu sections={reviews.length ? trek.sections : trek.sections.filter((section) => section !== "reviews")} trekName={trek.name} days={trek.days} />
    <TrekSections trek={trek} company={company} reviews={reviews} rating={rating} />
    {trek.sections.includes("booking_cta") && <BookingBand name={trek.name} shortName={trek.shortName} />}
    {children}
    {trek.pricing.prices.length > 0 && <MobileBookingBar trekName={trek.name} days={trek.days} />}
  </BookingProvider>
);
