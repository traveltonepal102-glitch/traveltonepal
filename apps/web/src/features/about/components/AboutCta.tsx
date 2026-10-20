import { getWhatsAppUrl } from "@ttn/config/contact";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/routes";

import { WRAP } from "./styles";

/** "Ready to plan your trek with us?": browse treks or start planning on WhatsApp. */
export const AboutCta = () => (
  <section aria-labelledby="about-cta-title" className="pb-14">
    <div className={WRAP}>
      <div className="flex flex-col gap-5 rounded-2xl border border-saffron-line bg-linear-135 from-saffron-tint to-white to-65% p-5 md:flex-row md:items-center md:justify-between md:p-7">
        <div className="flex max-w-155 flex-col gap-1.5">
          <h2 id="about-cta-title" className="text-2xl font-extrabold">
            Ready to plan your trek with us?
          </h2>
          <p className="text-body-sm text-text">
            Tell us when you want to go and what you would like to see. We reply personally, usually within a few hours.
          </p>
        </div>
        <div className="flex flex-none flex-col gap-2.5 sm:flex-row">
          <ButtonLink href={ROUTES.treks} variant="secondary" shape="rounded">
            Browse treks
          </ButtonLink>
          <ButtonLink href={getWhatsAppUrl("Hello! I'd like to plan a trek with you.")} variant="whatsapp" icon="chat" shape="rounded" isExternal>
            Plan my trek
          </ButtonLink>
        </div>
      </div>
    </div>
  </section>
);
