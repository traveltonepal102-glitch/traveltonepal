import type { AboutHonest } from "@ttn/site-data/aboutRows";

import { SectionHeading } from "@/components/shared/SectionHeading";

import { ABOUT_SECTIONS } from "../sections";
import { BeliefQuote } from "./BeliefQuote";

/** "We're honest": the text, real advice we have given with who it was for, and when we speak up. */
export const HonestSection = ({ honest }: { honest: AboutHonest }) => {
  if (!honest.heading) return null;

  return (
    <section id={ABOUT_SECTIONS.honest} aria-labelledby="honest-h" className="wrap flex flex-col gap-10 py-14 md:py-18">
      <div className="grid items-center gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4">
          <SectionHeading id="honest-h" eyebrow={honest.card.title} title={honest.heading} />
          {honest.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <BeliefQuote quote={honest.quote} />
      </div>
      {honest.advice.length > 0 && (
        <div className="flex flex-col gap-4.5">
          {honest.adviceHeading && <h3>{honest.adviceHeading}</h3>}
          <ul className="grid gap-4.5 md:grid-cols-2">
            {honest.advice.map((advice) => (
              <li key={advice.quote}>
                <figure className="flex h-full flex-col gap-2 rounded-2xl border border-solid border-line bg-snow p-6 shadow-card">
                  <blockquote className="leading-6.5 font-semibold text-ink">“{advice.quote}”</blockquote>
                  {advice.who && <figcaption className="mt-auto text-sm leading-5 text-muted">{advice.who}</figcaption>}
                </figure>
              </li>
            ))}
          </ul>
        </div>
      )}
      {honest.points.length > 0 && (
        <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
          {honest.points.map((point) => (
            <div key={point.title} className="flex flex-col gap-1">
              <dt className="font-semibold text-ink">{point.title}</dt>
              <dd className="text-[15px] leading-5.75">{point.text}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
};
