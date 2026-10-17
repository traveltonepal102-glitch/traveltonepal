import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";

/** Navy "Looking for something specific?" band with the WhatsApp button. */
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
        <ButtonLink href={getWhatsAppUrl()} variant="whatsapp" icon="chat" isExternal className="flex-none">
          Ask on WhatsApp
        </ButtonLink>
      </div>
    </div>
  </section>
);
