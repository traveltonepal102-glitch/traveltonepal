import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { outlineButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

const PROMISES = ["One-to-one local advice", "Free itinerary discussion", "Fast reply on WhatsApp"];

/** Ask the team personally about this trek, on WhatsApp or by email. */
export const TrekConsultation = ({ name }: { name: string }) => (
  <section aria-labelledby="consultation-h" id="consultation" className="flex flex-col gap-4 rounded-[14px] border border-solid border-cream-line bg-cream p-6">
    <div className="flex flex-col gap-1.5">
      {/* A paragraph, not a heading: the page's headings are kept for the trek's own keyword. */}
      <p id="consultation-h" className="font-display text-[22px] leading-7 font-semibold text-ink">
        Any questions you want to ask us personally?
      </p>
      <p className="text-base leading-6.5">Message us on WhatsApp or by email, and someone from our team answers you personally.</p>
    </div>
    <div className="actions">
      <a href={getWhatsAppUrl(`Hello! I have a question about the ${name}.`)} rel="nofollow" className={whatsAppButton}>
        <WhatsAppLogo />
        Chat on WhatsApp
      </a>
      <a href={getEmailUrl({ subject: `A question about the ${name}` })} rel="nofollow" className={`${outlineButton} bg-snow!`}>
        <TrailIcon name="mail" />
        Email us
      </a>
    </div>
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-solid border-cream-line pt-3 text-sm leading-5">
      {PROMISES.map((promise) => (
        <li key={promise} className="inline-flex items-center gap-1.5">
          <TrailIcon name="check" size={16} className="text-navy" />
          {promise}
        </li>
      ))}
    </ul>
  </section>
);
