import type { AboutListen } from "@ttn/site-data/aboutRows";

import { SectionHeading } from "@/components/shared/SectionHeading";

import { ABOUT_SECTIONS } from "../sections";
import { BeliefQuote } from "./BeliefQuote";

/** "We listen first": the text beside the questions we ask, then the three steps and what we learn. */
export const ListenSection = ({ listen }: { listen: AboutListen }) => {
  if (!listen.heading) return null;
  const steps = listen.steps.filter((step) => step.title);

  return (
    <section id={ABOUT_SECTIONS.listen} aria-labelledby="listen-h" className="bg-stone py-14 md:py-18">
      <div className="wrap flex flex-col gap-10">
        <div className="grid items-start gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="flex flex-col gap-4">
            <SectionHeading id="listen-h" eyebrow={listen.card.title} title={listen.heading} />
            {listen.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <BeliefQuote quote={listen.quote} />
          </div>
          {listen.questions.length > 0 && (
            <div className="flex flex-col gap-3 rounded-2xl border border-solid border-line bg-snow p-6">
              <h3 className="text-xl! leading-6.5!">Questions we ask you</h3>
              <ul className="flex list-disc flex-col gap-2 pl-5 text-base leading-6.5 marker:text-forest">
                {listen.questions.map((question) => (
                  <li key={question}>{question}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {steps.length > 0 && (
          <ol className="grid gap-4.5 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.title} className="flex flex-col gap-1.5 rounded-2xl border border-solid border-line bg-snow p-6">
                <h3 className="text-xl! leading-6.5!">{step.title}</h3>
                <p className="text-base leading-6.5">{step.text}</p>
              </li>
            ))}
          </ol>
        )}
        {listen.understand.length > 0 && (
          <div className="flex flex-col gap-4 rounded-2xl border border-solid border-line bg-snow p-6">
            <dl className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
              {listen.understand.map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <dt className="font-semibold text-ink">{item.label}</dt>
                  <dd className="text-[15px] leading-5.75">{item.value}</dd>
                </div>
              ))}
            </dl>
            {listen.understandNote && <p className="border-0 border-t border-solid border-line pt-4 text-[15px] leading-5.75">{listen.understandNote}</p>}
          </div>
        )}
        {listen.example && (
          <p className="text-base leading-6.5">
            <strong className="font-semibold text-ink">For example:</strong> {listen.example}
          </p>
        )}
      </div>
    </section>
  );
};
