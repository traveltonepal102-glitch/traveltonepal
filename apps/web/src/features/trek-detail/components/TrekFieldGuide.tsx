import { Icon } from "@ttn/ui/icon";

import { RichText } from "@/components/shared/RichText";
import { SiteImage } from "@/components/ui/SiteImage";

import type { TrekDetail } from "../types";
import { SectionHeading } from "./SectionHeading";
import { PANEL } from "./styles";

/** "Practical field knowledge": season, teahouses, food and the emergency plan, from our trek leaders (with a photo beside a topic that has one). */
export const TrekFieldGuide = ({ fieldGuide }: Pick<TrekDetail, "fieldGuide">) => (
  <section aria-labelledby="trek-field-guide-title" className="flex flex-col gap-4 pt-2">
    <SectionHeading
      id="trek-field-guide-title"
      eyebrow="Practical field knowledge"
      title={fieldGuide.heading}
      description="Essential insights from our local trek leaders."
    />
    <div className="flex flex-col gap-4">
      {fieldGuide.topics.map((topic) => (
        <div key={topic.title} className={`${PANEL} flex flex-col gap-3 p-5`}>
          <h3 className="flex items-center gap-2 border-b border-line pb-2 text-[15px] font-bold">
            <Icon name={topic.icon} className="flex-none text-brand" />
            {topic.title}
          </h3>
          <div className="flex flex-col gap-4 md:flex-row md:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-2.5 text-body-sm text-text">
              <RichText doc={topic.body} headingLevel="h4" className="flex flex-col gap-2.5" />
              {topic.note && <p className="text-xs text-muted-foreground italic">*{topic.note}</p>}
            </div>
            {topic.photo && (
              <div className="relative aspect-4/3 w-full flex-none overflow-hidden rounded-md border border-line md:w-56">
                <SiteImage image={topic.photo} sizes="(min-width: 768px) 224px, 100vw" className="object-cover" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </section>
);
