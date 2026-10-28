import { Icon } from "@ttn/ui/icon";

import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutPageContent } from "../../types";
import { FOCUS, WRAP } from "../styles";

type BeliefsOverviewProps = Pick<AboutPageContent, "listen" | "honest" | "flexible" | "openMind" | "safetyLine">;

/**
 * The four beliefs as cards over the bottom of the hero (design: About.dc.html), each leading down to its section,
 * with the one rule under them. The menu's "Why travel with us" lands here.
 */
export const BeliefsOverview = ({ listen, honest, flexible, openMind, safetyLine }: BeliefsOverviewProps) => {
  const cards = [
    { id: ABOUT_SECTION_IDS.listen, ...listen.card },
    { id: ABOUT_SECTION_IDS.honest, ...honest.card },
    { id: ABOUT_SECTION_IDS.flexible, ...flexible.card },
    { id: ABOUT_SECTION_IDS.openMind, ...openMind.card },
  ].filter((card) => card.title);
  if (!cards.length) return null;

  return (
    <div id={ABOUT_SECTION_IDS.whyUs} className={`${WRAP} relative z-10 -mt-28 scroll-mt-14`}>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-raised">
        {/* The 1px gaps show the line colour behind the cards: a line between cards in any number of columns. */}
        <ul className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card, index) => (
            <li key={card.id} className="bg-surface">
              <a href={`#${card.id}`} className={`flex h-full flex-col gap-2 p-6.5 text-text hover:bg-page ${FOCUS} focus-visible:-outline-offset-2`}>
                <span className="font-display text-sm font-extrabold tracking-[0.08em] text-saffron">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-display text-[22px] leading-7 font-extrabold text-ink">{card.title}</span>
                {card.text && <span className="text-[15px]">{card.text}</span>}
                {card.link && <span className="mt-auto pt-1 text-sm font-bold text-brand">{card.link} →</span>}
              </a>
            </li>
          ))}
        </ul>
        {(safetyLine.lead || safetyLine.text) && (
          <p className="flex flex-wrap items-center justify-center gap-2.5 bg-navy px-6 py-3.5 text-center text-sm text-navy-text">
            <Icon name="health_and_safety" size={18} className="text-saffron" />
            <span>
              {safetyLine.lead && <strong className="text-white">{safetyLine.lead}</strong>} {safetyLine.text}
            </span>
          </p>
        )}
      </div>
    </div>
  );
};
