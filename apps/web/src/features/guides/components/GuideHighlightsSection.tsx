import type { GuideHighlights } from "../guideLists";
import { GuideFeatureCard } from "./GuideFeatureCard";
import { GuideRowCard } from "./GuideRowCard";
import { WRAP } from "./styles";

/**
 * Featured guide and the newest ones. Desktop: featured (wider) beside a column of compact cards.
 * Tablet and phone: featured on top, the compact cards below.
 */
export const GuideHighlightsSection = ({ featured, latest }: GuideHighlights) => (
  <section aria-labelledby="guide-highlights-title" className="py-9 md:py-10">
    <div className={WRAP}>
      <h2 id="guide-highlights-title" className="sr-only">
        Featured and latest guides
      </h2>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <GuideFeatureCard guide={featured} />
        {latest.length > 0 && (
          <ul className="grid gap-5">
            {latest.map((guide) => (
              <li key={guide.slug}>
                <GuideRowCard guide={guide} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </section>
);
