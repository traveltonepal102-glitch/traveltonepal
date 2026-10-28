import { Icon } from "@ttn/ui/icon";

import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutHonest } from "../../types";
import { WRAP } from "../styles";
import { BELIEF_SECTION, BeliefHeading, BeliefIntro, Paragraphs } from "./BeliefParts";

/** 02 "Honest and proactive" (design: About.dc.html): the text and quote, advice we give, and when we tell you. */
export const HonestSection = ({ honest }: { honest: AboutHonest }) => {
  if (!honest.heading) return null;

  return (
    <section id={ABOUT_SECTION_IDS.honest} aria-labelledby="about-honest-title" className={`${BELIEF_SECTION} border-t border-line bg-surface`}>
      <div className={`${WRAP} flex flex-col gap-11`}>
        <BeliefIntro quote={honest.quote}>
          <BeliefHeading id="about-honest-title" eyebrow={honest.eyebrow} heading={honest.heading} />
          <Paragraphs paragraphs={honest.paragraphs} />
        </BeliefIntro>

        {honest.advice.length > 0 && (
          <div className="flex flex-col gap-4.5">
            {honest.adviceHeading && <h3 className="font-display text-[22px] leading-7 font-extrabold">{honest.adviceHeading}</h3>}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {honest.advice.map((advice) => (
                <li key={advice.quote}>
                  <figure className="flex h-full flex-col gap-3.5 rounded-xl border border-line bg-page p-6 transition-shadow hover:shadow-raised">
                    <Icon name="chat" size={28} className="text-brand/60" />
                    <blockquote className="font-display text-lg leading-[26px] font-bold text-ink">&ldquo;{advice.quote}&rdquo;</blockquote>
                    {advice.who && <figcaption className="mt-auto text-[13px] text-muted-foreground">{advice.who}</figcaption>}
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        )}

        {honest.points.length > 0 && (
          <ul className="grid gap-6 rounded-2xl bg-brand-tint p-7 sm:grid-cols-2 lg:grid-cols-4">
            {honest.points.map((point) => (
              <li key={point.title} className="flex flex-col gap-1.5">
                <span className="font-display text-[17px] leading-[22px] font-bold text-ink">{point.title}</span>
                <span className="text-sm leading-[22px] text-text">{point.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
