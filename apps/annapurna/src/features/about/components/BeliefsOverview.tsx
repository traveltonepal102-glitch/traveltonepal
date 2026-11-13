import { SectionHeading } from "@/components/shared/SectionHeading";

import { ABOUT_SECTIONS } from "../sections";
import type { AboutContent } from "../types";

type BeliefsOverviewProps = Pick<AboutContent, "listen" | "honest" | "flexible" | "openMind" | "safetyLine">;

/** What the company believes, in four short cards that each lead to their section, and the one rule above them. */
export const BeliefsOverview = ({ listen, honest, flexible, openMind, safetyLine }: BeliefsOverviewProps) => {
  const cards = [
    { id: ABOUT_SECTIONS.listen, ...listen.card },
    { id: ABOUT_SECTIONS.honest, ...honest.card },
    { id: ABOUT_SECTIONS.flexible, ...flexible.card },
    { id: ABOUT_SECTIONS.openMind, ...openMind.card },
  ].filter((card) => card.title);
  if (cards.length === 0) return null;

  return (
    <section id={ABOUT_SECTIONS.beliefs} aria-labelledby="beliefs-h" className="wrap flex flex-col gap-8 py-14 md:py-18">
      <SectionHeading id="beliefs-h" title="What we believe">
        {(safetyLine.lead || safetyLine.text) && (
          <p>
            {safetyLine.lead} <strong className="font-semibold text-ink">{safetyLine.text}</strong>
          </p>
        )}
      </SectionHeading>
      <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <li key={card.id}>
            <a href={`#${card.id}`} className="flex h-full flex-col gap-2 rounded-2xl border border-solid border-line bg-snow p-6 text-text no-underline shadow-card hover:border-navy">
              <span className="font-display text-[22px] leading-7 font-semibold text-ink">{card.title}</span>
              {card.text && <span className="text-[15px] leading-5.75">{card.text}</span>}
              {card.link && <span className="mt-auto pt-2 text-[15px] font-semibold text-navy underline underline-offset-2">{card.link}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
