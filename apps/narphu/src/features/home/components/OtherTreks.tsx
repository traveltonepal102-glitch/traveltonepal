import { getWhatsAppUrl } from "@ttn/config/contact";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeTrekCard } from "../types";
import { OtherTrekCard } from "./OtherTrekCard";

type OtherTreksProps = { current: HomeTrekCard | null; treks: readonly HomeTrekCard[]; eyebrow?: string; title?: string };

/** The website's other treks (design: Other treks we guide): a wide card each, one under another, then a band to ask which fits. Hidden while there are none. */
export const OtherTreks = ({ treks, eyebrow = "More treks", title = "Other treks we guide" }: OtherTreksProps) => {
  if (treks.length === 0) return null;

  return (
    <section aria-labelledby="other-treks-h" id="other-treks" className="bg-cream">
      <div className="wrap flex flex-col gap-8 py-20 max-md:py-14">
        <SectionHeading id="other-treks-h" eyebrow={eyebrow} title={title}>
          <p className="m-0">Every trek is private and starts on the day you choose.</p>
        </SectionHeading>
        <div className="flex flex-col gap-5">
          {treks.map((trek) => (
            <OtherTrekCard key={trek.slug} trek={trek} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-solid border-saffron-line bg-saffron-tint px-6 py-5">
          <p className="m-0 flex max-w-none items-start gap-3.5">
            <span aria-hidden="true" className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-snow text-maroon">
              <TrailIcon name="route" size={20} />
            </span>
            <span className="flex flex-col">
              <strong className="text-lg leading-6 font-semibold text-ink">Not sure which trek fits?</strong>
              <span>Tell us your dates and fitness. We suggest the route that suits you, honestly.</span>
            </span>
          </p>
          <a href={getWhatsAppUrl("Hello! Which trek fits me?")} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
            <WhatsAppLogo />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
};
