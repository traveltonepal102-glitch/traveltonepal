import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import type { GuideHelpBox } from "@ttn/config/guideHelpBox";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

type GuideHelpCardProps = {
  box: GuideHelpBox;
  /** The email's subject names the guide the question is about. */
  guideTitle: string;
};

const BUTTON =
  "inline-flex min-h-10 items-center gap-1.5 rounded-full px-3.5 text-caption font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * Navy help box beside a guide: a local expert on WhatsApp or by email, both messages starting with the same words
 * (worded for the guide in the admin, or the default).
 */
export const GuideHelpCard = ({ box, guideTitle }: GuideHelpCardProps) => (
  <section aria-labelledby="guide-help-title" className="flex flex-col gap-2 rounded-2xl bg-navy p-4 text-white">
    <h2 id="guide-help-title" className="text-base font-bold text-white">
      {box.heading}
    </h2>
    <p className="text-caption font-normal text-navy-text">{box.text}</p>
    <div className="mt-1 flex flex-wrap gap-2">
      <a href={getWhatsAppUrl(box.message)} target="_blank" rel="noopener noreferrer" className={`${BUTTON} bg-whatsapp text-white hover:bg-whatsapp/90`}>
        <WhatsAppLogo size={16} />
        WhatsApp
      </a>
      <a href={getEmailUrl({ subject: `Question about: ${guideTitle}`, body: box.message })} className={`${BUTTON} border border-white/40 text-white hover:border-white`}>
        <Icon name="mail" size={16} />
        Email
      </a>
    </div>
  </section>
);
