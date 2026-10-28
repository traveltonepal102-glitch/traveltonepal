import { Icon } from "@ttn/ui/icon";

import { SiteImage } from "@/components/ui/SiteImage";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutFlexible } from "../../types";
import { WRAP } from "../styles";
import { BELIEF_SECTION, BIG_QUOTE, BeliefHeading, Paragraphs } from "./BeliefParts";

/** 03 "Private and flexible" (design: About.dc.html): text and quote beside a photo, the trek's stages and where flexibility stops. */
export const FlexibleSection = ({ flexible }: { flexible: AboutFlexible }) => {
  if (!flexible.heading) return null;
  const { photo } = flexible;

  return (
    <section id={ABOUT_SECTION_IDS.flexible} aria-labelledby="about-flexible-title" className={`${BELIEF_SECTION} bg-muted`}>
      <div className={`${WRAP} flex flex-col gap-12`}>
        <div className="flex flex-wrap items-center gap-12">
          <div className="flex min-w-0 flex-[1.15_1_460px] flex-col gap-5">
            <BeliefHeading id="about-flexible-title" eyebrow={flexible.eyebrow} heading={flexible.heading} />
            <Paragraphs paragraphs={flexible.paragraphs} />
            {flexible.quote && (
              <blockquote className="mt-2 flex flex-col gap-1.5 rounded-xl bg-brand-tint px-6.5 py-5.5">
                <p className={`${BIG_QUOTE} text-brand`}>&ldquo;{flexible.quote}&rdquo;</p>
                {flexible.quoteNote && <p className="text-sm leading-[22px] text-text">{flexible.quoteNote}</p>}
              </blockquote>
            )}
          </div>
          {photo && (
            <figure className="relative aspect-[121/126] min-w-0 flex-[1_1_400px] overflow-hidden rounded-2xl">
              <SiteImage image={photo} sizes="(min-width: 1024px) 520px, 100vw" className="object-cover object-[50%_20%]" />
              {flexible.photoCaption && (
                <figcaption aria-hidden="true" className="absolute inset-x-0 bottom-0 bg-linear-to-b from-navy/0 to-navy/85 px-4.5 pt-10 pb-3.5 text-[13px] text-line">
                  {flexible.photoCaption}
                </figcaption>
              )}
            </figure>
          )}
        </div>

        {flexible.stages.length > 0 && (
          <div className="flex flex-col gap-5">
            {flexible.stagesHeading && <h3 className="font-display text-[22px] leading-7 font-extrabold">{flexible.stagesHeading}</h3>}
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {flexible.stages.map((stage) => (
                <li key={stage.title} className="flex flex-col gap-2.5 rounded-xl border border-line bg-surface p-5.5">
                  <span className="self-start rounded-full bg-navy px-2.5 py-1 text-xs leading-4 font-bold text-white">{stage.title}</span>
                  <span className="text-sm leading-[22px] text-text">{stage.text}</span>
                </li>
              ))}
            </ol>
            {(flexible.limits.lead || flexible.limits.text) && (
              <p className="flex items-start gap-3 rounded-xl border border-saffron-line bg-saffron-tint px-5 py-4 text-sm leading-[22px] text-saffron-ink">
                <Icon name="info" size={20} className="mt-px flex-none text-saffron-deep" />
                <span>
                  {flexible.limits.lead && <strong>{flexible.limits.lead}</strong>} {flexible.limits.text}
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
