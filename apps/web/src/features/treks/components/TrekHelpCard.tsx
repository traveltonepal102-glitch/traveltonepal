import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

/** "Not sure which trek?" card under the Treks page filters. */
export const TrekHelpCard = () => (
  <a
    href={getWhatsAppUrl("Hello! I'm not sure which trek suits me. Can you help me choose?")}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-start gap-3 rounded-lg border border-saffron-line bg-saffron-tint p-4 text-ink transition-shadow hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <span className="inline-flex size-9 flex-none items-center justify-center rounded-md bg-saffron text-ink">
      <Icon name="support_agent" />
    </span>
    <span className="flex flex-col gap-0.5">
      <span className="font-display font-bold">Not sure which trek?</span>
      <span className="text-caption font-normal text-text">Tell us your dates and fitness. We suggest the right one.</span>
      <span className="mt-1 inline-flex items-center gap-1.5 text-caption font-bold text-whatsapp">
        <WhatsAppLogo size={16} />
        Ask on WhatsApp
      </span>
    </span>
  </a>
);
