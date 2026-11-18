import { ClampedText } from "@/components/shared/ClampedText";
import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeTrek } from "../types";

const topicId = (index: number) => `guide-${index + 1}`;

/**
 * "Good to know" (design: the field guide, after Travel To Nepal's): an index of the topics that stays in view on a wide
 * screen, and a card per topic with its icon, its text folded after nine lines behind "Read more" (the whole text is in
 * the page for search engines), its note and its photo beside it.
 */
export const TrekFieldGuide = ({ fieldGuide }: { fieldGuide: HomeTrek["fieldGuide"] }) => (
  <section aria-labelledby="field-guide-h" id="field_guide" className="flex flex-col gap-8">
    <SectionHeading id="field-guide-h" eyebrow="Gut zu wissen" title={fieldGuide.heading}>
      {fieldGuide.intro && <p className="m-0">{fieldGuide.intro}</p>}
    </SectionHeading>
    <div className="flex flex-wrap items-start gap-7">
      {fieldGuide.topics.length > 3 && (
        <nav aria-label="Themen in diesem Ratgeber" className="flex flex-[0_0_300px] flex-col gap-0.5 rounded-[20px] border border-solid border-line bg-snow p-3.5 max-lg:hidden lg:sticky lg:top-24">
          <span className="px-2.5 pt-1.5 pb-2.5 text-xs leading-none font-semibold tracking-[0.14em] text-muted uppercase">In diesem Ratgeber</span>
          {fieldGuide.topics.map((topic, index) => (
            <a key={topic.title} href={`#${topicId(index)}`} className="flex min-h-11 items-center gap-2.5 rounded-[10px] px-2.5 py-1.5 text-[15px] leading-5 font-medium text-ink no-underline hover:bg-ice hover:text-ocean">
              <span className="inline-flex size-7 flex-none items-center justify-center rounded-lg bg-ice text-ocean">
                <TrailIcon name={topic.icon} size={16} />
              </span>
              {topic.title}
            </a>
          ))}
        </nav>
      )}
      <div className="flex min-w-0 flex-[1_1_620px] flex-col gap-4">
        {fieldGuide.topics.map((topic, index) => (
          <article key={topic.title} id={topicId(index)} aria-labelledby={`${topicId(index)}-h`} className="flex flex-col gap-4 rounded-[20px] border border-solid border-line bg-snow px-6.5 py-6 max-sm:px-4.5">
            <h3 id={`${topicId(index)}-h`} className="flex items-center gap-3 border-0 border-b border-solid border-ice pb-3.5 text-[21px]! leading-6.5!">
              <span className="inline-flex size-10 flex-none items-center justify-center rounded-xl bg-ice text-ocean">
                <TrailIcon name={topic.icon} size={20} />
              </span>
              {topic.title}
            </h3>
            <div className="flex flex-wrap items-start gap-6">
              <ClampedText lines={9} className="min-w-0 flex-[1_1_380px] text-base leading-6.5">
                <div className="flex flex-col gap-3">
                  {/* The text sits under the topic's h3, so its own headings are h4. */}
                  <RichText doc={topic.body} className="flex flex-col gap-3" headingLevel={4} />
                  {topic.note && <p className="m-0 text-sm leading-5 text-muted italic">*{topic.note}</p>}
                </div>
              </ClampedText>
              {topic.photo && (
                <div className="relative aspect-4/3 w-65 max-w-full flex-none overflow-hidden rounded-[14px] bg-ocean-tint max-sm:w-full">
                  <SiteImage image={topic.photo} sizes="(min-width: 640px) 260px, 100vw" className="object-cover" />
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
