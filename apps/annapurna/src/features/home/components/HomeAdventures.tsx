import { getWhatsAppUrl } from "@ttn/config/contact";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeAdventures as HomeAdventuresSection } from "../types";

/** This website's own adventure section (admin › Adventures, each website has its own), and the card to ask for your own idea. Hidden while it has no cards. */
export const HomeAdventures = ({ section }: { section: HomeAdventuresSection }) =>
  section.cards.length > 0 && (
    <section aria-labelledby="adventures-h" className="wrap flex flex-col gap-7 pt-22 max-md:pt-14">
      <SectionHeading id="adventures-h" eyebrow={section.eyebrow} title={section.heading}>
        {section.intro && <p className="max-w-190">{section.intro}</p>}
      </SectionHeading>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-5">
        {section.cards.map((adventure) => (
          <article key={adventure.id} className="relative flex min-h-80 items-end overflow-hidden rounded-[14px] bg-navy-deep">
            <SiteImage image={adventure.photo} sizes="(min-width: 1024px) 300px, 100vw" className="object-cover" />
            <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-navy-deep/10 via-navy-deep/75 via-55% to-navy-deep/95" />
            <div className="relative flex flex-col gap-1.5 p-5.5">
              <h3 className="text-[21px]! leading-6.75! text-snow!">{adventure.title}</h3>
              {adventure.summary && <p className="text-base leading-6 text-on-navy-muted">{adventure.summary}</p>}
            </div>
          </article>
        ))}
        <article className="flex min-h-80 flex-col justify-between gap-4 rounded-[14px] border border-solid border-line bg-snow p-6.5">
          <span className="inline-flex size-12 items-center justify-center rounded-xl bg-cream text-cream-ink">
            <TrailIcon name="sun" size={24} />
          </span>
          <h3 className="text-2xl! leading-7.5!">{section.askTitle}</h3>
          <p className="text-base leading-6.25">{section.askText}</p>
          <a href={getWhatsAppUrl("Hello! I have an idea for something to do in Nepal.")} rel="nofollow" className={whatsAppButton}>
            <WhatsAppLogo />
            Ask on WhatsApp
          </a>
        </article>
      </div>
    </section>
  );
