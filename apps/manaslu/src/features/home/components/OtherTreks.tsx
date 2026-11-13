import { getWhatsAppUrl } from "@ttn/config/contact";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { outlineOnDarkButton, whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeTrekCard } from "../types";
import { CompareTreks } from "./CompareTreks";
import { OtherTrekCard } from "./OtherTrekCard";

type OtherTreksProps = { current: HomeTrekCard | null; treks: readonly HomeTrekCard[]; eyebrow?: string; title?: string };

/** The website's other treks on warm stone, a card to ask for advice, and the comparison. Hidden while there are none. */
export const OtherTreks = ({ current, treks, eyebrow = "More treks in the region", title = "Other treks around Manaslu" }: OtherTreksProps) => {
  if (treks.length === 0) return null;

  return (
    <section aria-labelledby="other-treks-h" id="other-treks" className="bg-stone">
      <div className="wrap flex flex-col gap-8 py-20 max-md:py-14">
        <SectionHeading id="other-treks-h" eyebrow={eyebrow} title={title}>
          <p className="max-w-160">Every trek is private and starts on the day you choose.</p>
        </SectionHeading>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 max-sm:grid-cols-1">
          {treks.map((trek) => (
            <OtherTrekCard key={trek.slug} trek={trek} />
          ))}
          <article className="flex flex-col justify-between gap-5 rounded-2xl bg-forest-deep p-7 text-snow">
            <div className="flex flex-col gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/10 text-saffron">
                <TrailIcon name="route" size={24} />
              </span>
              <h3 className="text-2xl! leading-7.5! text-snow!">Not sure which trek fits?</h3>
              <p className="text-base leading-6.25 text-on-forest-muted">Tell us how many days you have and how high you want to go. We suggest a route and send a price for your group.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a href={getWhatsAppUrl("Hello! Which Manaslu trek fits me?")} rel="nofollow" className={whatsAppButton}>
                <WhatsAppLogo />
                Ask on WhatsApp
              </a>
              {current && (
                <a href="#compare" className={outlineOnDarkButton}>
                  Compare the treks
                </a>
              )}
            </div>
          </article>
        </div>
        {current && <CompareTreks current={current} others={treks} />}
      </div>
    </section>
  );
};
