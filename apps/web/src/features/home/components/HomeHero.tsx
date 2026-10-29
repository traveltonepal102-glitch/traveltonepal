import { getEmailUrl, getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";
import type { SitePageTop } from "@/features/site-pages/types";
import { ROUTES } from "@/lib/routes";
import { SITE_NAME } from "@/lib/site";

import { HeroBackdrop } from "./HeroBackdrop";

/**
 * Home hero (design: Main.dc.html). The overlay header sits on top of it (see app/page.tsx), so the
 * top padding includes the header height: 76px on phones, 112px from md up (utility bar + main bar).
 * The label, heading and text come from Pages › List pages › Home.
 */
export const HomeHero = ({ top }: { top: SitePageTop }) => (
  <section aria-labelledby="home-hero-title" className="relative bg-navy text-white">
    <HeroBackdrop />

    <div className="relative mx-auto flex max-w-content flex-col gap-5.5 px-4 pt-29 pb-42.5 md:px-6 md:pt-46 md:pb-52.5">
      {top.eyebrow && (
        <p className="inline-flex items-center gap-2 self-start rounded-full border border-saffron/50 bg-saffron/18 px-3.5 py-1.5 text-xs font-bold tracking-[0.08em] text-saffron-line uppercase">
          <Icon name="person" size={16} />
          {top.eyebrow}
        </p>
      )}
      <h1 id="home-hero-title" className="max-w-205 text-h1-sm tracking-tight text-white md:text-h1 lg:text-display">
        {top.heading}
      </h1>
      {top.intro && <p className="max-w-150 text-[19px] leading-[30px] text-line">{top.intro}</p>}
      <div className="flex flex-wrap gap-3 pt-1">
        <ButtonLink href={ROUTES.treks} variant="accent" size="lg" trailingIcon="arrow_forward" className="max-md:w-full">
          Explore treks
        </ButtonLink>
        <ButtonLink href={getWhatsAppUrl("Hi! I'd like to plan a private trek in Nepal.")} variant="whatsapp" size="lg" icon="whatsapp" isExternal className="max-md:w-full">
          Personalize on WhatsApp
        </ButtonLink>
        <ButtonLink href={getEmailUrl({ subject: `Planning a private trek with ${SITE_NAME}` })} variant="outlineOnDark" size="lg" icon="mail" className="max-md:w-full">
          Personalize via email
        </ButtonLink>
      </div>
    </div>

    <p className="absolute right-6 bottom-24 hidden items-center gap-1.5 text-xs text-white/85 md:inline-flex">
      <Icon name="location_on" size={14} />
      Gokyo Lake from Gokyo Ri, Everest region
    </p>
  </section>
);
