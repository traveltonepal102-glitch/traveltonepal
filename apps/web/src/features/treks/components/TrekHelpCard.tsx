import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

const HELP_MESSAGE = "Hello! I'm not sure which trek suits me. Can you help me choose?";
const ACTION = "inline-flex items-center gap-1.5 rounded-sm text-caption font-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** "Not sure which trek?" card under the Treks page filters: ask on WhatsApp or by email. */
export const TrekHelpCard = () => (
  <div className="flex items-start gap-3 rounded-lg border border-saffron-line bg-saffron-tint p-4 text-ink">
    <span className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-saffron text-ink">
      <Icon name="support_agent" />
    </span>
    <span className="flex flex-col gap-0.5">
      <span className="font-display font-bold">Not sure which trek?</span>
      <span className="text-caption font-normal text-text">Tell us your dates and fitness. We suggest the right one.</span>
      <span className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        <a href={getWhatsAppUrl(HELP_MESSAGE)} target="_blank" rel="noopener noreferrer" className={`${ACTION} text-whatsapp`}>
          <WhatsAppLogo size={16} />
          Ask on WhatsApp
        </a>
        <a href={getEmailUrl({ subject: "Which trek suits me?", body: HELP_MESSAGE })} className={`${ACTION} text-brand`}>
          <Icon name="mail" size={16} />
          Email us
        </a>
      </span>
    </span>
  </div>
);
