import { Icon } from "@ttn/ui/icon";

import { regionInquiryUrl } from "@/features/regions/inquiry";

import { PILL, WRAP } from "./styles";

/** "Ready for …?": the closing WhatsApp call to action. */
export const RegionCta = ({ regionName }: { regionName: string }) => (
  <section aria-labelledby="region-cta-title" className={`${WRAP} pb-16`}>
    <div className="flex flex-col items-start gap-5 rounded-xl bg-linear-120 from-navy to-brand p-5 text-white md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex flex-col gap-1.5">
        <h2 id="region-cta-title" className="text-[28px] leading-tight font-extrabold text-white">
          Ready for {regionName}?
        </h2>
        <p className="text-base text-white/85">Tell us your dates and fitness. A local planner replies on WhatsApp within a few hours.</p>
      </div>
      <a
        href={regionInquiryUrl(regionName)}
        target="_blank"
        rel="noopener noreferrer"
        className={`${PILL} bg-whatsapp text-white hover:bg-whatsapp/90 focus-visible:outline-white max-md:w-full`}
      >
        <Icon name="chat" />
        Plan {regionName} on WhatsApp
      </a>
    </div>
  </section>
);
