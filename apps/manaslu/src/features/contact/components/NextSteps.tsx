import type { NextStep } from "@ttn/site-data/contactContent";

import { SectionHeading } from "@/components/shared/SectionHeading";

/** What happens after they write: three numbered steps. */
export const NextSteps = ({ steps }: { steps: readonly NextStep[] }) => (
  <section aria-labelledby="contact-next-h" className="wrap flex flex-col gap-8 py-14 md:py-18">
    <SectionHeading id="contact-next-h" title="What happens after you write" />
    <ol className="grid gap-8 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4">
          <span aria-hidden="true" className="inline-flex size-10 flex-none items-center justify-center rounded-full bg-forest font-semibold text-snow">
            {index + 1}
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl! leading-6.5!">{step.title}</h3>
            {step.when && <p className="text-sm leading-5 font-semibold text-forest">{step.when}</p>}
            <p className="text-base leading-6.5">{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
);
