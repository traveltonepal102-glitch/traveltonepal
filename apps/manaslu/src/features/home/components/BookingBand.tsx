import { getWhatsAppUrl } from "@ttn/config/contact";

import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

const SECOND_BUTTON = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-solid border-white/50 px-5 font-semibold text-snow no-underline hover:bg-white/10 hover:text-snow";

/** The last call to book, as wide as the page. */
export const BookingBand = ({ name, shortName }: { name: string; shortName: string }) => (
  <section aria-labelledby="booking-band-h" id="booking_cta" className="bg-forest-deep text-snow">
    <div className="wrap flex flex-wrap items-center justify-between gap-6 py-12">
      <div className="flex flex-[1_1_420px] flex-col gap-2">
        <span className="text-eyebrow font-semibold tracking-[0.12em] text-saffron uppercase">Ready for the Himalaya?</span>
        <h2 id="booking-band-h" className="text-snow!">
          Book the {shortName} with us
        </h2>
        <p className="text-on-forest-muted">Get a personal itinerary, packing advice and a confirmed price for your group, straight from our team.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <a href={getWhatsAppUrl(`Hello! I would like to book the ${name}.`)} className={whatsAppButton}>
          <WhatsAppLogo />
          Ask on WhatsApp
        </a>
        <a href="#book" className={SECOND_BUTTON}>
          Check dates
          <TrailIcon name="arrow" />
        </a>
      </div>
    </div>
  </section>
);
