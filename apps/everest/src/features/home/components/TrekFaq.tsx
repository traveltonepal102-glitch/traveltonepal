import { getWhatsAppUrl } from "@ttn/config/contact";
import { toSlugText } from "@ttn/config/slugText";

import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeTrek } from "../types";
import { FaqGroupCard } from "./FaqGroupCard";

/** "Höhe und Gesundheit" → "faq-hoehe-und-gesundheit" */
const groupAnchor = (title: string) => `faq-${toSlugText(title)}`;

/**
 * The trek's questions (after Travel To Nepal's FAQ): the topics as a list that stays in view on a wide screen (a row
 * that scrolls sideways on a phone) with a way to ask beside it, and every topic as a card of questions that open in place.
 */
export const TrekFaq = ({ faq, trekName }: { faq: HomeTrek["faq"]; trekName: string }) => {
  const hasTopicList = faq.groups.length > 1;

  return (
    <section aria-labelledby="faq-h" id="faq" className="flex flex-col gap-8">
      <SectionHeading id="faq-h" eyebrow="Fragen" title={faq.heading} />
      {/* grid-cols-1 (minmax(0, 1fr)) keeps the sideways topic row from widening the column on a phone. */}
      <div className={`grid grid-cols-1 items-start gap-6 ${hasTopicList ? "lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]" : ""}`}>
        {hasTopicList && (
          <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24">
            <nav aria-label="Themen der Fragen" className="rounded-[20px] border border-solid border-line bg-snow p-3 shadow-card">
              <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 lg:flex-col">
                {faq.groups.map((group) => (
                  <li key={group.title} className="flex-none">
                    <a href={`#${groupAnchor(group.title)}`} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] leading-5 font-medium whitespace-nowrap text-ink no-underline hover:bg-ice hover:text-ocean lg:whitespace-normal">
                      <TrailIcon name={group.icon} size={18} className="text-ocean" />
                      <span className="flex-1">{group.title}</span>
                      <span className="rounded-full bg-ice px-2 text-xs leading-5 font-semibold text-muted">{group.items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-3 rounded-[20px] bg-ink p-5.5 text-on-ocean-muted max-lg:hidden">
              <strong className="text-lg leading-6 font-semibold text-snow">Noch etwas unklar?</strong>
              <p className="m-0 text-[15px] leading-6">Frag unser Team. Wir beantworten jede Nachricht selbst, meist innerhalb weniger Stunden.</p>
              <a href={getWhatsAppUrl(`Hallo! Ich habe eine Frage zum ${trekName}.`)} target="_blank" rel="nofollow noopener" className={`${whatsAppButton} min-h-11 self-start`}>
                <WhatsAppLogo />
                Per WhatsApp fragen
              </a>
            </div>
          </div>
        )}
        <div className="flex min-w-0 flex-col gap-5">
          {faq.groups.map((group, index) => (
            <FaqGroupCard
              key={group.title}
              group={group}
              id={groupAnchor(group.title)}
              isFirstOpen={index === 0}
              answers={group.items.map((item) => (
                <RichText key={item.question} doc={item.body} className="flex flex-col gap-2.5" headingLevel={4} />
              ))}
            />
          ))}
          {/* On a phone and tablet the way to ask follows the questions. */}
          <p className={`m-0 flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-ink px-5.5 py-4.5 text-on-ocean-muted ${hasTopicList ? "lg:hidden" : ""}`}>
            <span className="font-semibold text-snow">Noch etwas unklar? Frag unser Team.</span>
            <a href={getWhatsAppUrl(`Hallo! Ich habe eine Frage zum ${trekName}.`)} target="_blank" rel="nofollow noopener" className={`${whatsAppButton} min-h-11`}>
              <WhatsAppLogo />
              Per WhatsApp fragen
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
