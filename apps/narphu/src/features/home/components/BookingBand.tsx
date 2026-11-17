import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { outlineOnDarkButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

/** The last call to book, as wide as the page, on deep maroon: WhatsApp or email (both open something). */
export const BookingBand = ({ name, shortName }: { name: string; shortName: string }) => (
  <section aria-labelledby="booking-band-h" id="booking_cta" className="bg-maroon-deep text-snow">
    <div className="wrap flex flex-wrap items-center justify-between gap-6 py-14">
      <div className="flex flex-[1_1_420px] flex-col gap-2.5">
        <span className="eyebrow eyebrow-dash text-saffron">Ready for the hidden valley?</span>
        <h2 id="booking-band-h" className="text-snow!">
          Book the {shortName} with us
        </h2>
        <p className="m-0 text-on-maroon-muted">Get a personal itinerary, packing advice and a confirmed price for your group, straight from our team.</p>
      </div>
      <div className="actions max-sm:w-full">
        <a href={getWhatsAppUrl(`Hello! I would like to book the ${name}.`)} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
          <WhatsAppLogo />
          Ask on WhatsApp
        </a>
        <a href={getEmailUrl({ subject: `Booking the ${name}` })} rel="nofollow" className={outlineOnDarkButton}>
          <TrailIcon name="mail" />
          Email us
        </a>
      </div>
    </div>
  </section>
);
