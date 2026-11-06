import { TrailIcon } from "@/components/ui/TrailIcon";

import type { HomeTrek } from "../types";

/** "What you'll remember", on warm stone. */
export const TrekHighlights = ({ highlights }: { highlights: HomeTrek["highlights"] }) => (
  <section aria-labelledby="highlights-h" className="flex flex-col gap-3.5 rounded-[14px] bg-stone p-6">
    <h2 id="highlights-h" className="text-xl! leading-6.5!">
      {highlights.heading}
    </h2>
    <ul className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-7 gap-y-3.5">
      {highlights.points.map((point) => (
        <li key={point.title} className="flex items-start gap-3 text-base leading-6">
          <span className="mt-px inline-flex size-5.5 flex-none items-center justify-center rounded-full bg-forest text-snow">
            <TrailIcon name="check" size={14} />
          </span>
          <span>
            <strong className="font-semibold text-ink">{point.title}.</strong> {point.text}
          </span>
        </li>
      ))}
    </ul>
  </section>
);
