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
export const OtherTreks = ({ current, treks, eyebrow = "Weitere Treks in der Region", title = "Weitere Treks rund um die Annapurna" }: OtherTreksProps) => {
  if (treks.length === 0) return null;

  return (
    <section aria-labelledby="other-treks-h" id="other-treks" className="bg-cloud">
      <div className="wrap flex flex-col gap-8 py-20 max-md:py-14">
        <SectionHeading id="other-treks-h" eyebrow={eyebrow} title={title}>
          <p className="max-w-160">Jeder Trek ist privat und beginnt an dem Tag, den Sie wählen.</p>
        </SectionHeading>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6 max-sm:grid-cols-1">
          {treks.map((trek) => (
            <OtherTrekCard key={trek.slug} trek={trek} />
          ))}
          <article className="flex flex-col justify-between gap-5 rounded-2xl bg-navy-deep p-7 text-snow">
            <div className="flex flex-col gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-xl bg-white/10 text-sun">
                <TrailIcon name="route" size={24} />
              </span>
              <h3 className="text-2xl! leading-7.5! text-snow!">Unsicher, welcher Trek passt?</h3>
              <p className="text-base leading-6.25 text-on-navy-muted">Sagen Sie uns, wie viele Tage Sie haben und wie hoch Sie hinauswollen. Wir schlagen Ihnen eine Route vor und schicken einen Preis für Ihre Gruppe.</p>
            </div>
            <div className="flex flex-col gap-2.5">
              <a href={getWhatsAppUrl("Hallo! Welcher Annapurna-Trek passt zu mir?")} rel="nofollow" className={whatsAppButton}>
                <WhatsAppLogo />
                Per WhatsApp fragen
              </a>
              {current && (
                <a href="#compare" className={outlineOnDarkButton}>
                  Treks vergleichen
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
