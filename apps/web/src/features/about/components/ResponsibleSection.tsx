import { Icon } from "@ttn/ui/icon";
import Image from "next/image";

import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import { RESPONSIBLE_PRACTICES } from "../aboutContent";
import { WRAP } from "./styles";

/** "Responsible travel": navy band over a faint photo, four practices with their checklists. */
export const ResponsibleSection = () => (
  <section
    id={ABOUT_SECTION_IDS.responsibleTravel}
    aria-labelledby="about-responsible-title"
    className="relative scroll-mt-14 overflow-hidden bg-navy py-14 text-white md:py-16"
  >
    <Image src="/images/trekkers-on-trail.jpg" alt="" fill sizes="100vw" className="object-cover opacity-22" />
    <div className={`${WRAP} relative flex flex-col gap-6`}>
      <PageSectionHeading
        id="about-responsible-title"
        tone="onDark"
        eyebrow="Responsible travel"
        title="Good for the people and places you visit"
        text="Trekking keeps many mountain families going. We make sure the money and the respect go where they should."
      />
      <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {RESPONSIBLE_PRACTICES.map((practice) => (
          <li key={practice.title} className="flex flex-col gap-2.5 rounded-2xl border border-white/16 bg-white/8 p-5">
            <span aria-hidden="true" className="inline-flex size-10.5 items-center justify-center rounded-xl bg-saffron text-ink">
              <Icon name={practice.icon} size={22} />
            </span>
            <h3 className="text-[17px] font-bold text-white">{practice.title}</h3>
            <ul className="flex flex-col gap-1.5">
              {practice.points.map((point) => (
                <li key={point} className="flex gap-2 text-caption font-normal text-white/85">
                  <Icon name="check" size={16} className="mt-0.5 flex-none text-whatsapp-on-dark" />
                  {point}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
