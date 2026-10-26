import { Icon } from "@ttn/ui/icon";

import { TREK_SECTION_IDS } from "../../sections";
import type { TrekDetail } from "../../types";
import { CARD_TITLE, EYEBROW, PANEL } from "../styles";
import { GuideCard } from "./GuideCard";

/** "Meet your trek guide": the guides who lead this trek, in a row that scrolls sideways. */
export const TrekGuides = ({ guides }: Pick<TrekDetail, "guides">) => {
  const { team } = guides;
  if (team.length === 0) return null;

  return (
    <section
      id={TREK_SECTION_IDS.guides}
      aria-labelledby="trek-guides-title"
      className={`${PANEL} mt-3 flex scroll-mt-16 flex-col gap-4.5 rounded-xl p-4.5 md:p-6.5`}
    >
      <div className="flex flex-col gap-3 border-b border-muted pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <p className={`${EYEBROW} inline-flex items-center gap-2`}>
            <Icon name="shield_person" size={18} />
            Local expertise and safety first
          </p>
          <h2 id="trek-guides-title" className={CARD_TITLE}>
            Meet your trek guide
          </h2>
          <p className="max-w-160 text-body-sm text-text">{guides.intro}</p>
        </div>
        {team.length > 1 && (
          <p aria-hidden="true" className="inline-flex flex-none items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            Scroll to see the team
            <Icon name="arrow_forward" size={18} />
          </p>
        )}
      </div>

      {/* Focusable so keyboard users can scroll the row with the arrow keys. */}
      <div
        role="region"
        aria-label="Trek guides"
        tabIndex={0}
        className="snap-x snap-mandatory overflow-x-auto rounded-md px-0.5 pt-0.5 pb-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <ul className="flex gap-5">
          {team.map((guide) => (
            // Phones: a bit narrower than the row, so the next card peeks in and shows the row scrolls.
            <li key={guide.id} className="w-[85%] max-w-75 flex-none snap-start">
              <GuideCard guide={guide} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
