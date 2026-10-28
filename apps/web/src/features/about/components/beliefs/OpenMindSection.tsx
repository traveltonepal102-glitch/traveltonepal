import { SiteImage } from "@/components/ui/SiteImage";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutOpenMind } from "../../types";
import { WRAP } from "../styles";
import { BELIEF_SECTION, BIG_QUOTE, BeliefHeading, Paragraphs } from "./BeliefParts";

/**
 * 04 "An open mind" (design: About.dc.html), a dark band: the text in two columns, three villages with photos, how
 * we invite you in, and the closing quote.
 */
export const OpenMindSection = ({ openMind }: { openMind: AboutOpenMind }) => {
  if (!openMind.heading) return null;

  return (
    <section id={ABOUT_SECTION_IDS.openMind} aria-labelledby="about-open-mind-title" className={`${BELIEF_SECTION} bg-navy text-white`}>
      <div className={`${WRAP} flex flex-col gap-12`}>
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <div className="flex min-w-0 flex-[1.1_1_480px] flex-col gap-5">
            <BeliefHeading id="about-open-mind-title" eyebrow={openMind.eyebrow} heading={openMind.heading} tone="dark" />
            <Paragraphs paragraphs={openMind.paragraphs} tone="dark" />
          </div>
          {openMind.more.length > 0 && (
            <div className="flex min-w-0 flex-[1_1_400px] flex-col gap-4 lg:pt-8.5">
              <Paragraphs paragraphs={openMind.more} tone="dark" size="md" />
            </div>
          )}
        </div>

        {openMind.places.length > 0 && (
          <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
            {openMind.places.map((place) => (
              <li key={place.title}>
                <figure className="flex h-full flex-col overflow-hidden rounded-xl bg-white/6">
                  <div className="relative h-55">
                    <SiteImage image={place.photo} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                  </div>
                  <figcaption className="flex flex-col gap-1 px-5 pt-4.5 pb-5">
                    <span className="font-display text-lg leading-6 font-bold text-white">{place.title}</span>
                    {place.text && <span className="text-sm leading-[22px] text-navy-text">{place.text}</span>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-stretch gap-8">
          {openMind.invites.length > 0 && (
            <div className="flex min-w-0 flex-[1.3_1_480px] flex-col gap-4 rounded-2xl bg-white/6 p-7">
              {openMind.inviteHeading && <h3 className="font-display text-xl leading-[26px] font-bold text-white">{openMind.inviteHeading}</h3>}
              <ul className="flex flex-col gap-3">
                {openMind.invites.map((invite) => (
                  <li key={invite.title} className="flex gap-3 text-[15px] leading-6 text-navy-text">
                    <span aria-hidden="true" className="mt-2 size-2 flex-none rounded-full bg-saffron" />
                    <span>
                      <strong className="text-white">{invite.title}</strong> {invite.text}
                    </span>
                  </li>
                ))}
              </ul>
              {openMind.inviteNote && <p className="mt-1 text-[13px] leading-5 text-navy-muted">{openMind.inviteNote}</p>}
            </div>
          )}
          {openMind.quote && (
            <div className="flex min-w-0 flex-[1_1_320px] flex-col justify-center gap-2.5 rounded-2xl bg-saffron p-7 text-navy">
              <p className={`${BIG_QUOTE} md:text-[34px] md:leading-10`}>&ldquo;{openMind.quote}&rdquo;</p>
              {openMind.quoteNote && <p className="text-[15px] leading-6 font-semibold">{openMind.quoteNote}</p>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
