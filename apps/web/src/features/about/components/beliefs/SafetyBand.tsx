import type { AboutSafety } from "../../types";
import { WRAP } from "../styles";

/** "The one rule above all four" (design: About.dc.html): safety, with three facts. */
export const SafetyBand = ({ safety }: { safety: AboutSafety }) => {
  if (!safety.heading) return null;

  return (
    <section aria-labelledby="about-safety-title" className="py-12 md:py-18">
      <div className={WRAP}>
        <div className="flex flex-wrap items-center gap-x-12 gap-y-7 rounded-2xl border border-line bg-surface p-6 md:p-9">
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-2.5">
            {safety.eyebrow && <p className="text-eyebrow text-brand uppercase">{safety.eyebrow}</p>}
            <h2 id="about-safety-title" className="text-h2-sm tracking-tight md:text-h2">
              {safety.heading}
            </h2>
          </div>
          {safety.facts.length > 0 && (
            <ul className="grid min-w-0 flex-[1_1_420px] gap-3.5 sm:grid-cols-3">
              {safety.facts.map((fact) => (
                <li key={fact.title} className="rounded-lg bg-brand-tint p-4 text-sm leading-[22px] text-navy">
                  <strong className="block text-[15px]">{fact.title}</strong>
                  {fact.text}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
