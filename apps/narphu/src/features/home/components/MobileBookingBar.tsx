import { BookingWhatsAppButton } from "./BookingWhatsAppButton";
import { SectionMenuPrice } from "./SectionMenuPrice";

/** A phone's bar at the bottom of the screen: the per-person price for the group chosen, and "Book on WhatsApp". */
export const MobileBookingBar = ({ trekName, days }: { trekName: string; days: number }) => (
  <section aria-label="Your booking" className="sticky bottom-0 z-30 flex items-center justify-between gap-3 border-0 border-t border-solid border-line bg-snow px-(--gutter) py-2.5 shadow-[0_-8px_24px_-12px_rgba(42,29,26,0.3)] lg:hidden">
    <SectionMenuPrice />
    <BookingWhatsAppButton trekName={trekName} days={days} className="min-h-11 px-4 text-[15px]" />
  </section>
);
