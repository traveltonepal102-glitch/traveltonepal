import type { AboutOpenMind } from "@ttn/site-data/aboutRows";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";

import { ABOUT_SECTIONS } from "../sections";
import { BeliefQuote } from "./BeliefQuote";

/** "An open mind": the text, three villages with photos, and how we invite you in. */
export const OpenMindSection = ({ openMind }: { openMind: AboutOpenMind }) => {
  if (!openMind.heading) return null;

  return (
    <section id={ABOUT_SECTIONS.openMind} aria-labelledby="open-mind-h" className="wrap flex flex-col gap-10 py-14 md:py-18">
      <div className="flex flex-col gap-4">
        <SectionHeading id="open-mind-h" eyebrow={openMind.card.title} title={openMind.heading} />
        <div className="grid gap-x-12 gap-y-4 lg:grid-cols-2">
          {[...openMind.paragraphs, ...openMind.more].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
      {openMind.places.length > 0 && (
        <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
          {openMind.places.map((place) => (
            <li key={place.title}>
              <figure className="flex h-full flex-col overflow-hidden rounded-2xl border border-solid border-line bg-snow shadow-card">
                <div className="relative aspect-4/3 bg-forest-tint">
                  <SiteImage image={place.photo} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="flex flex-col gap-1 p-5">
                  <span className="font-semibold text-ink">{place.title}</span>
                  {place.text && <span className="text-[15px] leading-5.75">{place.text}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
      {openMind.invites.length > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl bg-stone p-6 md:p-8">
          {openMind.inviteHeading && <h3>{openMind.inviteHeading}</h3>}
          <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
            {openMind.invites.map((invite) => (
              <li key={invite.title} className="text-base leading-6.5">
                <strong className="font-semibold text-ink">{invite.title}</strong> {invite.text}
              </li>
            ))}
          </ul>
          {openMind.inviteNote && <p className="text-sm leading-5 text-muted">{openMind.inviteNote}</p>}
        </div>
      )}
      <BeliefQuote quote={openMind.quote} note={openMind.quoteNote} />
    </section>
  );
};
