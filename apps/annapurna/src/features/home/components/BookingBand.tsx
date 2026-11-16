import { getWhatsAppUrl } from "@ttn/config/contact";

import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

const SECOND_BUTTON = "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-solid border-white/50 px-5 font-semibold text-snow no-underline hover:bg-white/10 hover:text-snow";

/** The last call to book, as wide as the page. */
export const BookingBand = ({ name, shortName }: { name: string; shortName: string }) => (
  <section aria-labelledby="booking-band-h" id="booking_cta" className="bg-navy-deep text-snow">
    <div className="wrap flex flex-wrap items-center justify-between gap-6 py-12">
      <div className="flex flex-[1_1_420px] flex-col gap-2">
        <span className="text-eyebrow font-semibold tracking-[0.12em] text-sun uppercase">Bereit für den Himalaya?</span>
        <h2 id="booking-band-h" className="text-snow!">
          Buchen Sie den {shortName} mit uns
        </h2>
        <p className="text-on-navy-muted">Sie erhalten einen persönlichen Reiseverlauf, Tipps zur Packliste und einen verbindlichen Preis für Ihre Gruppe – direkt von unserem Team.</p>
      </div>
      <div className="actions max-sm:w-full">
        <a href={getWhatsAppUrl(`Hallo! Ich möchte den ${name} buchen.`)} rel="nofollow" className={whatsAppButton}>
          <WhatsAppLogo />
          Per WhatsApp fragen
        </a>
        <a href="#book" className={SECOND_BUTTON}>
          Termin wählen
          <TrailIcon name="arrow" />
        </a>
      </div>
    </div>
  </section>
);
