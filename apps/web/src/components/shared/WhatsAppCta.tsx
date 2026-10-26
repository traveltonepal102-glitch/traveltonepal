import { getWhatsAppUrl } from "@ttn/config/contact";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

type WhatsAppCtaProps = {
  /** Id of the title, for the surrounding section's aria-labelledby. */
  titleId: string;
  title: string;
  text: string;
  /** Pre-filled WhatsApp message. */
  message: string;
  buttonLabel: string;
};

/** Saffron "ask a local expert" box with a WhatsApp button (Regions and Travel guides pages). */
export const WhatsAppCta = ({ titleId, title, text, message, buttonLabel }: WhatsAppCtaProps) => (
  <div className="flex flex-col items-stretch gap-5 rounded-xl border border-saffron-line bg-linear-135 from-saffron-tint to-white to-65% p-4.5 sm:flex-row sm:items-center sm:justify-between md:p-7">
    <div className="flex max-w-155 flex-col gap-1.5">
      <h2 id={titleId} className="text-2xl font-extrabold">
        {title}
      </h2>
      <p className="text-body-sm text-text">{text}</p>
    </div>
    <a
      href={getWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-12.5 flex-none items-center justify-center gap-2 rounded-xl bg-whatsapp px-5.5 text-caption font-bold tracking-wider text-white uppercase hover:bg-whatsapp/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <WhatsAppLogo size={18} />
      {buttonLabel}
    </a>
  </div>
);
