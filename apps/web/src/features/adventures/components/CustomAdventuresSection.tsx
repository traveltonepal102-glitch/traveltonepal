import { Icon } from "@ttn/ui/icon";

import { CAROUSEL_GRID_ITEM, CardCarousel } from "@/components/shared/CardCarousel";

import { getAdventuresSection } from "../services/adventuresRepository";
import { AdventureCard } from "./AdventureCard";
import { AdventureSteps } from "./AdventureSteps";
import { AskAdventureCard } from "./AskAdventureCard";

/**
 * "Tell us your dream Nepal adventure" (design: Main.dc.html, custom adventures): the words and cards saved in the
 * admin's Adventures screen, the cards ending with "Something else in mind?" (a carousel on phones and tablets, the
 * design's grid on desktop), then how it works and the note. Left out until at least one card is shown on the website.
 */
export const CustomAdventuresSection = async () => {
  const section = await getAdventuresSection();
  if (!section?.adventures.length) return null;

  return (
    <section id="custom-adventures" aria-labelledby="custom-adventures-title" className="border-t border-line bg-surface py-16 md:py-24">
      <div className="mx-auto flex max-w-content flex-col gap-9 px-4 md:px-6">
        <div className="flex max-w-190 flex-col gap-3">
          <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
            <Icon name="travel_explore" size={18} />
            {section.eyebrow}
          </p>
          <h2 id="custom-adventures-title" className="text-h2 tracking-tight md:text-h1">
            {section.heading}
          </h2>
          {section.intro && <p className="text-body-lg text-text">{section.intro}</p>}
        </div>

        <CardCarousel label="Adventures we can plan for you" count={section.adventures.length + 1} isGridOnDesktop>
          {section.adventures.map((adventure) => (
            <li key={adventure.id} className={CAROUSEL_GRID_ITEM}>
              <AdventureCard adventure={adventure} />
            </li>
          ))}
          <li className={CAROUSEL_GRID_ITEM}>
            <AskAdventureCard title={section.askTitle} text={section.askText} />
          </li>
        </CardCarousel>

        {section.steps.length > 0 && <AdventureSteps title={section.stepsTitle} steps={section.steps} />}

        {section.note && (
          <p className="mx-auto flex max-w-160 items-start gap-2 rounded-lg border border-saffron-line bg-saffron-tint px-4 py-3 text-body-sm text-saffron-ink">
            <Icon name="info" size={18} className="mt-0.5 flex-none" />
            {section.note}
          </p>
        )}
      </div>
    </section>
  );
};
