import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

const PROMISES = ["Persönliche Beratung vom Team vor Ort", "Kostenlose Besprechung des Reiseverlaufs", "Schnelle Antwort per WhatsApp"];

/** Ask the team personally about this trek, on WhatsApp or by email. */
export const TrekConsultation = ({ name }: { name: string }) => (
  <section aria-labelledby="consultation-h" id="consultation" className="flex flex-col gap-4 rounded-[20px] border border-solid border-glacier-line bg-glacier-tint p-7 max-sm:p-5">
    <div className="flex flex-col gap-1.5">
      {/* A paragraph, not a heading: the page's headings are kept for the trek's own keyword. */}
      <p id="consultation-h" className="m-0 font-display text-[26px] leading-8 font-semibold text-ink">
        Hast du Fragen, die du uns persönlich stellen möchtest?
      </p>
      <p className="text-base leading-6.5">Schreib uns per WhatsApp oder E-Mail – jemand aus unserem Team antwortet dir persönlich.</p>
    </div>
    <div className="actions">
      <a href={getWhatsAppUrl(`Hallo! Ich habe eine Frage zum ${name}.`)} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
        <WhatsAppLogo />
        Per WhatsApp schreiben
      </a>
      <a href={getEmailUrl({ subject: `Eine Frage zum ${name}` })} rel="nofollow" className={`${outlineButton} bg-snow!`}>
        <TrailIcon name="mail" />
        E-Mail schreiben
      </a>
    </div>
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-solid border-glacier-line pt-3 text-sm leading-5">
      {PROMISES.map((promise) => (
        <li key={promise} className="inline-flex items-center gap-1.5">
          <TrailIcon name="check" size={16} className="text-ocean" />
          {promise}
        </li>
      ))}
    </ul>
  </section>
);
