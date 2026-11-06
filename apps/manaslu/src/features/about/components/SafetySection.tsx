import type { AboutSafety } from "@ttn/site-data/aboutRows";

import { SectionHeading } from "@/components/shared/SectionHeading";

/** The one rule above the rest: safety, with its facts. */
export const SafetySection = ({ safety }: { safety: AboutSafety }) => {
  if (!safety.heading) return null;

  return (
    <section aria-labelledby="safety-h" className="bg-stone py-14 md:py-18">
      <div className="wrap flex flex-col gap-8">
        <div className="max-w-[72ch]">
          <SectionHeading id="safety-h" eyebrow={safety.eyebrow} title={safety.heading} />
        </div>
        {safety.facts.length > 0 && (
          <ul className="grid gap-4.5 md:grid-cols-3">
            {safety.facts.map((fact) => (
              <li key={fact.title} className="flex flex-col gap-1 rounded-2xl border border-solid border-line bg-snow p-6">
                <strong className="font-semibold text-ink">{fact.title}</strong>
                <span className="text-[15px] leading-5.75">{fact.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};
