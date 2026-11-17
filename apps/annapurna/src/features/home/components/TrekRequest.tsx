import { SectionHeading } from "@/components/shared/SectionHeading";

import { BookingRequestForm } from "./BookingRequestForm";

/** The request form, with a heading of its own. */
export const TrekRequest = ({ name, days }: { name: string; days: number }) => (
  <section aria-labelledby="booking-form-h" id="booking_form" className="flex flex-col gap-5 rounded-[14px] border border-solid border-line p-6 shadow-card">
    <SectionHeading id="booking-form-h" eyebrow="Schnelle Antwort per WhatsApp" title={`Ihren ${name} buchen`}>
      <p>Direkte Preise vom Team vor Ort, ohne Zwischenhändler. Füllen Sie das Formular aus – wir erstellen daraus eine fertige Nachricht, die Sie per WhatsApp oder E-Mail an uns senden.</p>
    </SectionHeading>
    <BookingRequestForm trekName={name} days={days} />
  </section>
);
