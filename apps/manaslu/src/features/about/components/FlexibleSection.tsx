import type { AboutFlexible } from "@ttn/site-data/aboutRows";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";

import { ABOUT_SECTIONS } from "../sections";
import { BeliefQuote } from "./BeliefQuote";

/** "We're flexible": a photo beside the text, then the stages of a trek in order, and where flexibility stops. */
export const FlexibleSection = ({ flexible }: { flexible: AboutFlexible }) => {
  if (!flexible.heading) return null;
  const { photo, limits } = flexible;

  return (
    <section id={ABOUT_SECTIONS.flexible} aria-labelledby="flexible-h" className="bg-stone py-14 md:py-18">
      <div className="wrap flex flex-col gap-10">
        <div className="grid items-center gap-x-12 gap-y-8 lg:grid-cols-2">
          {photo && (
            <figure className="flex flex-col gap-2">
              <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-forest-tint">
                <SiteImage image={photo} sizes="(min-width: 1024px) 680px, 100vw" className="object-cover object-[50%_25%]" />
              </div>
              {flexible.photoCaption && <figcaption className="text-sm leading-5 text-muted">{flexible.photoCaption}</figcaption>}
            </figure>
          )}
          <div className="flex flex-col gap-4">
            <SectionHeading id="flexible-h" eyebrow={flexible.card.title} title={flexible.heading} />
            {flexible.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <BeliefQuote quote={flexible.quote} note={flexible.quoteNote} />
          </div>
        </div>
        {flexible.stages.length > 0 && (
          <div className="flex flex-col gap-4.5">
            {flexible.stagesHeading && <h3>{flexible.stagesHeading}</h3>}
            <ol className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
              {flexible.stages.map((stage) => (
                <li key={stage.title} className="flex flex-col gap-1.5 rounded-2xl border border-solid border-line bg-snow p-5.5">
                  <span className="font-semibold text-ink">{stage.title}</span>
                  <span className="text-[15px] leading-5.75">{stage.text}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
        {(limits.lead || limits.text) && (
          <p className="rounded-[10px] border border-solid border-saffron-line bg-saffron-tint px-5 py-4 text-[15px] leading-6 text-saffron-ink">
            {limits.lead && <strong className="font-semibold">{limits.lead}</strong>} {limits.text}
          </p>
        )}
      </div>
    </section>
  );
};
