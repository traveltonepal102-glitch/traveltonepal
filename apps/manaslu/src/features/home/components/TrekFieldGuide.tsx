import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";

import type { HomeTrek } from "../types";

/** What the trek leaders want you to know: seasons, teahouses, food and safety, with a photo beside a topic that has one. */
export const TrekFieldGuide = ({ fieldGuide }: { fieldGuide: HomeTrek["fieldGuide"] }) => (
  <section aria-labelledby="field-guide-h" id="field_guide" className="flex flex-col gap-5">
    <SectionHeading id="field-guide-h" eyebrow="Good to know" title={fieldGuide.heading}>
      {fieldGuide.intro && <p>{fieldGuide.intro}</p>}
    </SectionHeading>
    <div className="flex flex-col gap-4">
      {fieldGuide.topics.map((topic) => (
        <article key={topic.title} className="flex flex-wrap items-start gap-5 rounded-[14px] border border-solid border-line p-6">
          <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-3">
            <h3 className="text-xl! leading-6.5!">{topic.title}</h3>
            <RichText doc={topic.body} className="flex flex-col gap-2.5 text-base leading-6.5" />
            {topic.note && <p className="text-sm leading-5 text-muted italic">*{topic.note}</p>}
          </div>
          {topic.photo && (
            <div className="relative aspect-4/3 min-w-0 flex-[0_1_224px] overflow-hidden rounded-[10px] bg-forest-tint max-sm:flex-[1_1_100%]">
              <SiteImage image={topic.photo} sizes="(min-width: 640px) 224px, 100vw" className="object-cover" />
            </div>
          )}
        </article>
      ))}
    </div>
  </section>
);
