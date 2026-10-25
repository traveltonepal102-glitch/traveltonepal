import { Icon } from "@ttn/ui/icon";

import { RichText } from "@/components/shared/RichText";

import type { RegionDetail } from "../types";
import { RegionSectionHeading } from "./RegionSectionHeading";
import { CARD, WRAP } from "./styles";

/**
 * "Questions": an accordion of native <details> sharing one name, so opening one closes the others
 * without any JavaScript, and every answer is in the HTML for search engines.
 */
export const RegionFaq = ({ region }: { region: RegionDetail }) => {
  if (region.faqs.length === 0) return null;

  return (
    <section id="faq" aria-labelledby="region-faq-title" className={`${WRAP} flex max-w-230 scroll-mt-14 flex-col gap-5.5 py-14`}>
      <RegionSectionHeading id="region-faq-title" kicker="Questions" title={`${region.name} questions, answered`} isCentered />
      <div className={`${CARD} overflow-hidden`}>
        {region.faqs.map((item, index) => (
          <details key={index} name="region-faq" open={index === 0} className="group border-b border-[#eef2f6] last:border-b-0 open:bg-[#f4f8fc]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3.5 px-5.5 py-4.5 text-base font-bold text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              {item.question}
              <span
                aria-hidden="true"
                className="inline-flex size-7.5 flex-none items-center justify-center rounded-full border border-brand/20 text-brand transition-transform group-open:rotate-180 group-open:bg-brand-tint"
              >
                <Icon name="keyboard_arrow_down" size={18} />
              </span>
            </summary>
            <RichText doc={item.answer} headingLevel="h4" className="flex flex-col gap-3 px-5.5 pb-4.5 text-text" />
          </details>
        ))}
      </div>
    </section>
  );
};
