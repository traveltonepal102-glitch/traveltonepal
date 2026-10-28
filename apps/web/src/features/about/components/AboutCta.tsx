import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";

import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";
import { SITE_NAME } from "@/lib/site";

import { FOCUS, WRAP } from "./styles";

const BUTTON = `inline-flex min-h-13 items-center justify-center gap-2 rounded-full px-6 font-bold ${FOCUS} focus-visible:outline-white`;

/** "Ready to plan your trek with us?" (design: About.dc.html): a blue box with WhatsApp and email. */
export const AboutCta = () => (
  <section aria-labelledby="about-cta-title" className="pt-10 pb-14 md:pt-18 md:pb-20">
    <div className={WRAP}>
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-brand p-7 text-white md:p-14">
        <div className="flex max-w-150 flex-col gap-2.5">
          <h2 id="about-cta-title" className="text-h1-sm tracking-tight text-white md:text-[40px] md:leading-11">
            Ready to plan your trek with us?
          </h2>
          <p className="text-[17px] leading-7 text-white/85">
            Tell us when you want to go and what you would like to see. We reply personally, usually within a few hours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 max-sm:w-full max-sm:flex-col">
          <a
            href={getWhatsAppUrl("Hello! I'd like to plan a trek with you.")}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BUTTON} bg-surface text-ink hover:bg-brand-tint`}
          >
            <WhatsAppLogo size={18} className="text-whatsapp" />
            Plan my trek my way
          </a>
          <a href={getEmailUrl({ subject: `Planning a trek with ${SITE_NAME}` })} className={`${BUTTON} border-[1.5px] border-white/55 text-white hover:bg-white/12`}>
            Email us
          </a>
        </div>
      </div>
    </div>
  </section>
);
