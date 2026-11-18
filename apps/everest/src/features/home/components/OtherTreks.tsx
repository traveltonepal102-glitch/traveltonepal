import { getWhatsAppUrl } from "@ttn/config/contact";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeTrekCard } from "../types";
import { OtherTrekCard } from "./OtherTrekCard";

type OtherTreksProps = { current: HomeTrekCard | null; treks: readonly HomeTrekCard[]; eyebrow?: string; title?: string };

/** The website's other treks (design: Other treks we guide): a wide card each, one under another, then a band to ask which fits. Hidden while there are none. */
export const OtherTreks = ({ treks, eyebrow = "Weitere Treks", title = "Weitere Treks in der Everest-Region" }: OtherTreksProps) => {
  if (treks.length === 0) return null;

  return (
    <section aria-labelledby="other-treks-h" id="other-treks" className="bg-ice">
      <div className="wrap flex flex-col gap-8 py-20 max-md:py-14">
        <SectionHeading id="other-treks-h" eyebrow={eyebrow} title={title}>
          <p className="m-0">Jeder Trek ist privat und beginnt an dem Tag, den du wählst.</p>
        </SectionHeading>
        <div className="flex flex-col gap-5">
          {treks.map((trek) => (
            <OtherTrekCard key={trek.slug} trek={trek} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-solid border-glacier-line bg-glacier-tint px-6 py-5">
          <p className="m-0 flex max-w-none items-start gap-3.5">
            <span aria-hidden="true" className="inline-flex size-11 flex-none items-center justify-center rounded-xl bg-snow text-ocean">
              <TrailIcon name="route" size={20} />
            </span>
            <span className="flex flex-col">
              <strong className="text-lg leading-6 font-semibold text-ink">Unsicher, welcher Trek zu dir passt?</strong>
              <span>Sag uns, wann du Zeit hast und wie fit du bist. Wir schlagen dir ehrlich die Route vor, die zu dir passt.</span>
            </span>
          </p>
          <a href={getWhatsAppUrl("Hallo! Welcher Everest-Trek passt zu mir?")} target="_blank" rel="nofollow noopener" className={whatsAppButton}>
            <WhatsAppLogo />
            Per WhatsApp fragen
          </a>
        </div>
      </div>
    </section>
  );
};
