import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

type ContactCtaProps = {
  /** Id of the title, for the surrounding section's aria-labelledby. */
  titleId: string;
  title: string;
  text: string;
  /** How the WhatsApp message and the email start. */
  message: string;
  emailSubject: string;
  /** The WhatsApp button's words. */
  buttonLabel: string;
};

const BUTTON =
  "inline-flex min-h-12.5 flex-none items-center justify-center gap-2 rounded-xl px-5.5 text-caption font-bold tracking-wider uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Saffron "ask a local expert" box with a WhatsApp and an Email button (Regions and Travel guides pages). */
export const ContactCta = ({ titleId, title, text, message, emailSubject, buttonLabel }: ContactCtaProps) => (
  <div className="flex flex-col items-stretch gap-5 rounded-xl border border-saffron-line bg-linear-135 from-saffron-tint to-white to-65% p-4.5 sm:flex-row sm:items-center sm:justify-between md:p-7">
    <div className="flex max-w-155 flex-col gap-1.5">
      <h2 id={titleId} className="text-2xl font-extrabold">
        {title}
      </h2>
      <p className="text-body-sm text-text">{text}</p>
    </div>
    <div className="flex flex-none flex-col gap-2.5 sm:flex-row">
      <a href={getWhatsAppUrl(message)} target="_blank" rel="noopener noreferrer" className={`${BUTTON} bg-whatsapp text-white hover:bg-whatsapp/90`}>
        <WhatsAppLogo size={18} />
        {buttonLabel}
      </a>
      <a href={getEmailUrl({ subject: emailSubject, body: message })} className={`${BUTTON} border border-line-strong bg-surface text-ink hover:bg-page`}>
        <Icon name="mail" size={18} className="text-brand" />
        Email us
      </a>
    </div>
  </div>
);
