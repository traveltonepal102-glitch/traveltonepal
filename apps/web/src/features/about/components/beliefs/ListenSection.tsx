import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import type { ReactNode } from "react";

import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { AboutListen } from "../../types";
import { WRAP } from "../styles";
import { BELIEF_SECTION, BeliefHeading, BeliefIntro, Paragraphs } from "./BeliefParts";

type StepCardProps = { icon: IconName; iconTone: string; title: string; text: string; isDark?: boolean; children?: ReactNode };

/** One of the three steps: icon, title, line of text, then its own part. */
const StepCard = ({ icon, iconTone, title, text, isDark = false, children }: StepCardProps) => (
  <li className={`flex flex-col gap-3.5 rounded-2xl p-7 ${isDark ? "bg-navy text-white" : "border border-line bg-surface"}`}>
    <span aria-hidden="true" className={`inline-flex size-11 items-center justify-center rounded-lg ${iconTone}`}>
      <Icon name={icon} size={22} />
    </span>
    <h3 className={`font-display text-xl leading-[26px] font-bold ${isDark ? "text-white" : ""}`}>{title}</h3>
    {text && <p className={`text-sm leading-[22px] ${isDark ? "text-navy-text" : "text-text"}`}>{text}</p>}
    {children}
  </li>
);

/** 01 "We listen first" (design: About.dc.html): the text and quote, then listen → understand → suggest. */
export const ListenSection = ({ listen }: { listen: AboutListen }) => {
  if (!listen.heading) return null;
  const [listenStep, understandStep, suggestStep] = listen.steps;

  return (
    <section id={ABOUT_SECTION_IDS.listen} aria-labelledby="about-listen-title" className={BELIEF_SECTION}>
      <div className={`${WRAP} flex flex-col gap-11`}>
        <BeliefIntro quote={listen.quote}>
          <BeliefHeading id="about-listen-title" eyebrow={listen.eyebrow} heading={listen.heading} />
          <Paragraphs paragraphs={listen.paragraphs} />
        </BeliefIntro>

        <ol className="grid gap-5 lg:grid-cols-3">
          {listenStep?.title && (
            <StepCard icon="chat" iconTone="bg-saffron/16 text-saffron" title={listenStep.title} text={listenStep.text} isDark>
              {listen.questions.length > 0 && (
                <ul className="mt-1 flex flex-col gap-2">
                  {listen.questions.map((question) => (
                    <li key={question} className="rounded-lg bg-white/7 px-3 py-2.5 text-sm leading-5 text-white">
                      &ldquo;{question}&rdquo;
                    </li>
                  ))}
                </ul>
              )}
            </StepCard>
          )}
          {understandStep?.title && (
            <StepCard icon="search" iconTone="bg-brand-tint text-brand" title={understandStep.title} text={understandStep.text}>
              {listen.understand.length > 0 && (
                <dl className="mt-1 grid grid-cols-2 gap-2">
                  {listen.understand.map((item) => (
                    <div key={item.label} className="flex flex-col-reverse rounded-lg bg-page px-3 py-2.5">
                      <dt className="text-xs text-muted-foreground">{item.label}</dt>
                      <dd className="text-[13px] leading-5 font-bold text-ink">{item.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {listen.understandNote && <p className="text-[13px] leading-5 text-muted-foreground">{listen.understandNote}</p>}
            </StepCard>
          )}
          {suggestStep?.title && (
            <StepCard icon="landscape" iconTone="bg-green-tint text-whatsapp" title={suggestStep.title} text={suggestStep.text}>
              {listen.example && (
                <p className="mt-auto rounded-lg border border-line bg-page px-4 py-3.5 text-sm leading-[22px] text-text">
                  <strong className="text-ink">For example:</strong> {listen.example}
                </p>
              )}
            </StepCard>
          )}
        </ol>
      </div>
    </section>
  );
};
