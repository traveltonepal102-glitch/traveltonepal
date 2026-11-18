import type { SiteImageSource } from "@ttn/site-data/images";

import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import { BookingRequestForm } from "./BookingRequestForm";

const POINTS = ["Direkte Preise vom Team vor Ort, ohne Zwischenhändler", "Wir schreiben deine Anfrage für dich", "Auf dieser Website wird nichts gespeichert"];

/** The request form (design: Book your trek): a photo with the promises on it beside the form. */
export const TrekRequest = ({ name, days, photo }: { name: string; days: number; photo?: SiteImageSource }) => (
  <section aria-labelledby="booking-form-h" id="booking_form" className="flex flex-wrap overflow-hidden rounded-[28px] border border-solid border-line bg-snow shadow-card">
    <div className="relative flex min-h-105 flex-[1_1_380px] flex-col justify-end gap-3.5 bg-ink p-9 text-snow max-sm:min-h-70 max-sm:p-6">
      {photo && <SiteImage image={{ ...photo, alt: "" }} sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />}
      <span aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-ink/10 from-20% to-ink/85" />
      <span className="eyebrow relative text-glacier">Schnelle Antwort per WhatsApp</span>
      <h2 id="booking-form-h" className="relative text-[36px]! leading-10! text-snow!">
        Buche deinen {name}
      </h2>
      <ul className="relative m-0 flex list-none flex-col gap-1.5 p-0">
        {POINTS.map((point) => (
          <li key={point} className="flex items-center gap-2">
            <TrailIcon name="check" size={16} className="text-glacier" />
            {point}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex min-w-0 flex-[1.3_1_480px] flex-col justify-center p-9 max-sm:p-5">
      <BookingRequestForm trekName={name} days={days} />
    </div>
  </section>
);
