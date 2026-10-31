import { Icon } from "@ttn/ui/icon";

import type { TrekDetail } from "../types";
import { ReadinessCallout } from "./ReadinessCallout";
import { CARD_TITLE, EYEBROW, PANEL } from "./styles";

/** "Is this trek for you?": an honest suitability checklist and an offer of a free readiness check. */
export const TrekSuitability = ({ trek }: { trek: TrekDetail }) => (
  <section aria-labelledby="trek-suitability-title" className={`${PANEL} flex flex-col gap-4.5 p-4.5 md:p-6`}>
    <div className="flex flex-col gap-3 border-b border-muted pb-3.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <p className={`${EYEBROW} inline-flex items-center gap-2`}>
          <Icon name="check_circle" />
          Trekker suitability guide
        </p>
        <h2 id="trek-suitability-title" className={CARD_TITLE}>
          {trek.headings.suitability}
        </h2>
        <p className="text-body-sm text-text">{trek.suitability.intro}</p>
      </div>
      <p className="inline-flex flex-none items-center gap-1.5 self-start rounded-full border border-green-line bg-green-tint px-3 py-1 text-xs font-bold text-whatsapp">
        <span aria-hidden="true" className="size-2 rounded-full bg-whatsapp" />
        Suitability checklist
      </p>
    </div>

    <ul className="flex flex-col gap-3.5 rounded-xl border border-line bg-page p-4.5 text-body-sm text-text md:p-5.5">
      {trek.suitability.points.map((point) => (
        <li key={point.title} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2 size-2 flex-none rounded-full bg-brand" />
          <p>
            <strong className="text-ink">{point.title}:</strong> {point.text}
          </p>
        </li>
      ))}
    </ul>

    <ReadinessCallout trekName={trek.name} />
  </section>
);
