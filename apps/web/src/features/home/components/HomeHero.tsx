import { getWhatsAppUrl } from "@ttn/config/contact";
import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/routes";

import { HeroBackdrop } from "./HeroBackdrop";

/**
 * Home hero (design: Main.dc.html). The overlay header sits on top of it (see app/page.tsx), so the
 * top padding includes the header height: 76px on phones, 112px from md up (utility bar + main bar).
 * `intro` is the line under the heading (homeIntro: it counts the regions).
 */
export const HomeHero = ({ intro }: { intro: string }) => (
  <section aria-labelledby="home-hero-title" className="relative bg-navy text-white">
    <HeroBackdrop />

    <div className="relative mx-auto flex max-w-content flex-col gap-5.5 px-4 pt-29 pb-42.5 md:px-6 md:pt-46 md:pb-52.5">
      <p className="inline-flex items-center gap-2 self-start rounded-full bg-saffron/18 px-3.5 py-1.5 text-caption font-bold text-saffron">
        <Icon name="calendar_today" size={16} />
        Spring and autumn 2027 departures open
      </p>
      <h1 id="home-hero-title" className="max-w-205 text-h1-sm tracking-tight text-white md:text-h1 lg:text-display">
        Walk the Himalaya with people who call it home.
      </h1>
      <p className="max-w-145 text-body-lg text-navy-text">
        {intro}
      </p>
      <div className="flex flex-wrap gap-3 pt-1">
        <ButtonLink href={ROUTES.treks} variant="accent" size="lg" trailingIcon="arrow_forward" className="max-md:w-full">
          Explore treks
        </ButtonLink>
        <ButtonLink
          href={getWhatsAppUrl()}
          variant="outlineOnDark"
          size="lg"
          icon="chat"
          isExternal
          className="max-md:w-full"
        >
          Chat on WhatsApp
        </ButtonLink>
      </div>
    </div>

    <p className="absolute right-6 bottom-24 hidden items-center gap-1.5 text-xs text-white/85 md:inline-flex">
      <Icon name="location_on" size={14} />
      Kyanjin Gompa, Langtang
    </p>
  </section>
);
