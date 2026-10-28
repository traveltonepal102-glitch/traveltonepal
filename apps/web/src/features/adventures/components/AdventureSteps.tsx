import type { AdventureStep } from "../types";

/** "How it works" under the carousel (design: Main.dc.html): numbered steps, side by side where they fit. */
export const AdventureSteps = ({ title, steps }: { title: string; steps: readonly AdventureStep[] }) => (
  <div className="flex flex-col gap-7 rounded-2xl border border-line bg-page p-6 md:p-9">
    <h3 className="text-h3">{title}</h3>
    <ol className="grid gap-7 md:grid-cols-3">
      {steps.map((step, index) => (
        <li key={step.title} className="flex items-start gap-3.5">
          <span aria-hidden="true" className="inline-flex size-9 flex-none items-center justify-center rounded-full bg-navy font-extrabold text-white">
            {index + 1}
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-h4">{step.title}</span>
            {step.text && <span className="text-body-sm text-text">{step.text}</span>}
          </span>
        </li>
      ))}
    </ol>
  </div>
);
