import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";

import type { HomeTrek } from "../types";

/**
 * What the trek leaders want you to know: seasons, teahouses, food and safety. Each topic opens in place (no
 * JavaScript; the first starts open), with a photo beside a topic that has one. The closed text is still in the page,
 * so search engines read it all.
 */
export const TrekFieldGuide = ({ fieldGuide }: { fieldGuide: HomeTrek["fieldGuide"] }) => (
  <section aria-labelledby="field-guide-h" id="field_guide" className="flex flex-col gap-5">
    <SectionHeading id="field-guide-h" eyebrow="Good to know" title={fieldGuide.heading}>
      {fieldGuide.intro && <p>{fieldGuide.intro}</p>}
    </SectionHeading>
    <div className="flex flex-col gap-3">
      {fieldGuide.topics.map((topic, index) => (
        <details key={topic.title} open={index === 0} className="group rounded-[14px] border border-solid border-line open:bg-stone">
          <summary className="flex min-h-15 cursor-pointer list-none items-center justify-between gap-4 rounded-[14px] px-4 py-4 sm:px-6 [&::-webkit-details-marker]:hidden">
            <h3 className="text-xl! leading-6.5!">{topic.title}</h3>
            <span aria-hidden="true" className="inline-flex size-7 flex-none items-center justify-center rounded-full bg-forest-tint font-semibold text-forest">
              <span className="group-open:hidden">+</span>
              <span className="hidden group-open:inline">−</span>
            </span>
          </summary>
          <div className="flex flex-wrap items-start gap-5 px-4 pb-5 sm:px-6 sm:pb-6">
            <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
              {/* The text sits under the topic's h3, so its own headings are h4. */}
              <RichText doc={topic.body} className="flex flex-col gap-2.5 text-base leading-6.5" headingLevel={4} />
              {topic.note && <p className="text-sm leading-5 text-muted italic">*{topic.note}</p>}
            </div>
            {topic.photo && (
              <div className="relative aspect-4/3 min-w-0 flex-[0_1_224px] overflow-hidden rounded-[10px] bg-forest-tint max-sm:flex-[1_1_100%]">
                <SiteImage image={topic.photo} sizes="(min-width: 640px) 224px, 100vw" className="object-cover" />
              </div>
            )}
          </div>
        </details>
      ))}
    </div>
  </section>
);
