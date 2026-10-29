import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";

/** Navy "Looking for something specific?" band with a WhatsApp and an Email button. */
export const HelpBand = () => (
  <section className="pt-10 pb-16">
    <div className="mx-auto max-w-content px-4 md:px-6">
      <div className="flex items-center justify-between gap-5 rounded-xl bg-navy px-7 py-6 text-white max-md:flex-col max-md:items-stretch">
        <div className="flex items-start gap-4">
          <span className="inline-flex size-11.5 flex-none items-center justify-center rounded-md bg-saffron text-ink">
            <Icon name="support_agent" size={24} />
          </span>
          <div className="flex flex-col gap-1">
            <p className="font-display text-h3">Looking for something specific?</p>
            <p className="text-body-sm text-navy-text">
              Tell us what you were looking for. A real person from our Kathmandu team sends you the right link.
            </p>
          </div>
        </div>
        <div className="flex flex-none flex-col gap-2.5 sm:flex-row">
          <ButtonLink href={getWhatsAppUrl()} variant="whatsapp" icon="whatsapp" isExternal>
            Ask on WhatsApp
          </ButtonLink>
          <ButtonLink href={getEmailUrl({ subject: "Looking for a page on your website" })} variant="outlineOnDark" icon="mail">
            Email us
          </ButtonLink>
        </div>
      </div>
    </div>
  </section>
);
