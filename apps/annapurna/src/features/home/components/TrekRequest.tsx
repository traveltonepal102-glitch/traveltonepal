import { SectionHeading } from "@/components/shared/SectionHeading";

import { BookingRequestForm } from "./BookingRequestForm";

/** The request form, with a heading of its own. */
export const TrekRequest = ({ name, days }: { name: string; days: number }) => (
  <section aria-labelledby="booking-form-h" id="booking_form" className="flex flex-col gap-5 rounded-[14px] border border-solid border-line p-6 shadow-card">
    <SectionHeading id="booking-form-h" eyebrow="Fast reply on WhatsApp" title={`Book your ${name}`}>
      <p>Direct local prices, no middlemen. Fill this in and your request is written for you.</p>
    </SectionHeading>
    <BookingRequestForm trekName={name} days={days} />
  </section>
);
