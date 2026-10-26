import { PageSectionHeading } from "@/components/shared/PageSectionHeading";

import type { NextStep } from "../types";
import { WRAP } from "./styles";

/** "What happens next": numbered steps from first message to booking (Pages › Contact). */
export const NextSteps = ({ steps }: { steps: readonly NextStep[] }) => (
  <section aria-labelledby="contact-next-title" className="border-y border-line bg-surface py-12">
    <div className={`${WRAP} flex flex-col gap-5`}>
      <PageSectionHeading id="contact-next-title" eyebrow="What happens next" title="From first message to your first trail day" />
      <ol className="grid gap-4.5 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-page p-5.5">
            <span className="flex items-center gap-2.5">
              <span aria-hidden="true" className="inline-flex size-10 items-center justify-center rounded-full bg-brand font-display text-lg font-extrabold text-on-brand">
                {index + 1}
              </span>
              {step.when && <span className="rounded-full border border-line bg-surface px-2.5 py-0.75 text-xs font-bold text-text">{step.when}</span>}
            </span>
            <h3 className="text-lg font-bold">{step.title}</h3>
            <p className="text-body-sm text-text">{step.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
