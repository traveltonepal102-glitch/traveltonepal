import { Icon } from "@ttn/ui/icon";

import { ICON_TONES } from "@/components/shared/iconTones";
import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutPromise, SectionHeading } from "../types";
import { BAND, SECTION, WRAP } from "./styles";

/** "Why travel with us": the promises from Pages › About, three across on desktop. */
export const PromisesSection = ({ promises, heading }: { promises: readonly AboutPromise[]; heading: SectionHeading }) => (
  <section id={ABOUT_SECTION_IDS.whyUs} aria-labelledby="about-why-title" className={`${SECTION} ${BAND}`}>
    <div className={`${WRAP} flex flex-col gap-5.5`}>
      <PageSectionHeading
        id="about-why-title"
        eyebrow="Why travel with us"
        title={heading.title || "What you can expect from us"}
        text={heading.text || "The promises we keep on every trek, whatever the region or group size."}
      />
      <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {promises.map((promise) => (
          <li key={promise.title} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-page p-5.5">
            <span aria-hidden="true" className={`inline-flex size-11 items-center justify-center rounded-xl ${ICON_TONES[promise.tone]}`}>
              <Icon name={promise.icon} size={24} />
            </span>
            <h3 className="text-lg font-bold">{promise.title}</h3>
            <p className="text-body-sm text-text">{promise.text}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
