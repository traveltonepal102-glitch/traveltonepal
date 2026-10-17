import { Icon } from "@ttn/ui/icon";

import type { TrekDetail } from "../types";
import { SectionHeading } from "./SectionHeading";
import { PANEL } from "./styles";

/** "Practical field knowledge": season, teahouses, food and the emergency plan, from our trek leaders. */
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
          <div className="flex flex-col gap-2.5 text-xs text-text">
            {topic.points.map((point) => (
              <p key={point.title}>
                <strong className="text-ink">{point.title}:</strong> {point.text}
              </p>
            ))}
            {topic.note && <p className="text-muted-foreground italic">*{topic.note}</p>}
          </div>
        </div>
      ))}
    </div>
  </section>
);
