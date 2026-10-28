import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { SITE_NAME } from "@/lib/site";

const ROUND_BUTTON =
  "inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const IDEA_MESSAGE = "Hi! I have an idea for an adventure in Nepal: ";

/**
 * The carousel's last card (design: "Something else in mind?"): any other idea, sent on WhatsApp or by email with
 * the first words already written.
 */
export const AskAdventureCard = ({ title, text }: { title: string; text: string }) => (
  <div className="flex h-full min-h-75 flex-col justify-between gap-4 rounded-xl border-2 border-dashed border-line-strong bg-page p-7">
    <div className="flex flex-col gap-3.5">
      <span className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-tint text-brand">
        <Icon name="travel_explore" size={22} />
      </span>
      <h3 className="text-h4">{title}</h3>
      {text && <p className="text-body-sm text-text">{text}</p>}
    </div>
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="font-bold text-brand">Share my idea</span>
        <a
          href={getWhatsAppUrl(IDEA_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share my idea on WhatsApp"
          className={`${ROUND_BUTTON} bg-whatsapp text-white hover:opacity-90`}
        >
          <WhatsAppLogo size={20} />
        </a>
        <a
          href={getEmailUrl({ subject: `My adventure idea for ${SITE_NAME}`, body: IDEA_MESSAGE })}
          aria-label="Share my idea by email"
          className={`${ROUND_BUTTON} border border-line-strong bg-surface text-ink hover:border-brand hover:text-brand`}
        >
          <Icon name="mail" size={18} />
        </a>
      </div>
      <p className="text-caption text-muted-foreground">We reply personally, as soon as we can.</p>
    </div>
  </div>
);
