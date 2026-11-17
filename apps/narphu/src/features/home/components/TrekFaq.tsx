import { getWhatsAppUrl } from "@ttn/config/contact";

import { RichText } from "@/components/shared/RichText";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { whatsAppButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { WhatsAppLogo } from "@/components/ui/WhatsAppLogo";

import type { HomeTrek } from "../types";
import { FaqGroupCard } from "./FaqGroupCard";

/** "Trek Basics" → "faq-trek-basics" */
const groupAnchor = (title: string) => `faq-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;

/**
 * The trek's questions (after Travel To Nepal's FAQ): the topics as a list that stays in view on a wide screen (a row
 * that scrolls sideways on a phone) with a way to ask beside it, and every topic as a card of questions that open in place.
 */
export const TrekFaq = ({ faq, trekName }: { faq: HomeTrek["faq"]; trekName: string }) => {
  const hasTopicList = faq.groups.length > 1;

  return (
    <section aria-labelledby="faq-h" id="faq" className="flex flex-col gap-8">
      <SectionHeading id="faq-h" eyebrow="Questions" title={faq.heading} />
      {/* grid-cols-1 (minmax(0, 1fr)) keeps the sideways topic row from widening the column on a phone. */}
      <div className={`grid grid-cols-1 items-start gap-6 ${hasTopicList ? "lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]" : ""}`}>
        {hasTopicList && (
          <div className="flex min-w-0 flex-col gap-4 lg:sticky lg:top-24">
            <nav aria-label="Question topics" className="rounded-[20px] border border-solid border-line bg-snow p-3 shadow-card">
              <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 lg:flex-col">
                {faq.groups.map((group) => (
                  <li key={group.title} className="flex-none">
                    <a href={`#${groupAnchor(group.title)}`} className="flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] leading-5 font-medium whitespace-nowrap text-ink no-underline hover:bg-cream hover:text-maroon lg:whitespace-normal">
                      <TrailIcon name={group.icon} size={18} className="text-maroon" />
                      <span className="flex-1">{group.title}</span>
                      <span className="rounded-full bg-cream px-2 text-xs leading-5 font-semibold text-muted">{group.items.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="flex flex-col gap-3 rounded-[20px] bg-ink p-5.5 text-on-maroon-muted max-lg:hidden">
              <strong className="text-lg leading-6 font-semibold text-snow">Still wondering about something?</strong>
              <p className="m-0 text-[15px] leading-6">Ask our team. We answer every message ourselves, usually within a few hours.</p>
              <a href={getWhatsAppUrl(`Hello! I have a question about the ${trekName}.`)} target="_blank" rel="nofollow noopener" className={`${whatsAppButton} min-h-11 self-start`}>
                <WhatsAppLogo />
                Ask on WhatsApp
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
          <p className={`m-0 flex flex-wrap items-center justify-between gap-3 rounded-[20px] bg-ink px-5.5 py-4.5 text-on-maroon-muted ${hasTopicList ? "lg:hidden" : ""}`}>
            <span className="font-semibold text-snow">Still wondering about something? Ask our team.</span>
            <a href={getWhatsAppUrl(`Hello! I have a question about the ${trekName}.`)} target="_blank" rel="nofollow noopener" className={`${whatsAppButton} min-h-11`}>
              <WhatsAppLogo />
              Ask on WhatsApp
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
