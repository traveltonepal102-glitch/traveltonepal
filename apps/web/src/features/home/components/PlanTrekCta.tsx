import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { ButtonLink } from "@/components/ui/ButtonLink";

/** "Not sure which trek is yours?" closing band (design: Main.dc.html), just above the footer. */
export const PlanTrekCta = () => (
  <section aria-labelledby="plan-cta-title" className="px-4 pb-22 md:px-5">
    <div className="relative mx-auto max-w-300 overflow-hidden rounded-xl bg-brand px-6 pt-10 pb-27.5 text-white md:px-14 md:pt-16 md:pb-32">
      <svg
        aria-hidden="true"
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 block h-25 w-full"
      >
        <path
          d="M0 120 L0 70 L40 45 L70 62 L110 20 L150 55 L190 35 L230 60 L270 15 L320 50 L360 38 L400 58 L400 120 Z"
          className="fill-white/15"
        />
        <path d="M0 120 L0 95 L60 82 L120 98 L180 80 L250 96 L310 84 L400 100 L400 120 Z" className="fill-navy" />
      </svg>

      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div className="flex max-w-160 grow basis-90 flex-col gap-3">
          <h2 id="plan-cta-title" className="text-h2 tracking-tight text-white md:text-h1">
            Not sure which trek is yours?
          </h2>
          {/* 90% white, not navy-text: that is under 4.5:1 contrast on the brand blue. */}
          <p className="text-body-lg text-white/90">
            Send us your dates, fitness and budget. We reply on WhatsApp or email with a route and a clear price.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 max-md:w-full">
          <ButtonLink
            href={getWhatsAppUrl()}
            variant="light"
            size="lg"
            icon="whatsapp"
            isExternal
            className="text-whatsapp max-md:w-full"
          >
            Chat on WhatsApp
          </ButtonLink>
          <ButtonLink href={getEmailUrl()} variant="outlineOnDark" size="lg" icon="mail" className="max-md:w-full">
            Email us
          </ButtonLink>
        </div>
      </div>
    </div>
  </section>
);
