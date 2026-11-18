import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { outlineOnDarkButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

/** The last call to book, as wide as the page, on deep ocean: WhatsApp or email (both open something). */
export const BookingBand = ({ name, shortName }: { name: string; shortName: string }) => (
  <section aria-labelledby="booking-band-h" id="booking_cta" className="bg-ocean-deep text-snow">
    <div className="wrap flex flex-wrap items-center justify-between gap-6 py-14">
      <div className="flex flex-[1_1_420px] flex-col gap-2.5">
        <span className="eyebrow eyebrow-dash text-glacier">Bereit für den Khumbu?</span>
        <h2 id="booking-band-h" className="text-snow!">
          Buche den {shortName} mit uns
        </h2>
        <p className="m-0 text-on-ocean-muted">Du bekommst einen persönlichen Reiseverlauf, Tipps zur Packliste und einen verbindlichen Preis für deine Gruppe – direkt von unserem Team.</p>
      </div>
      <div className="actions max-sm:w-full">
        <a href={getWhatsAppUrl(`Hallo! Ich möchte den ${name} buchen.`)} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
          <WhatsAppLogo />
          Per WhatsApp fragen
        </a>
        <a href={getEmailUrl({ subject: `Buchung: ${name}` })} rel="nofollow" className={outlineOnDarkButton}>
          <TrailIcon name="mail" />
          Schreib uns eine E-Mail
        </a>
      </div>
    </div>
  </section>
);
