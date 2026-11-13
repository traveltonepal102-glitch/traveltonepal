import type { HomeTrek } from "../types";

/** The cards take the flag colours in turn: navy, white, cloud, ember, then again. */
const LOOKS = [
  { card: "bg-navy text-snow", number: "text-sun", text: "text-on-navy-muted" },
  { card: "border border-solid border-line bg-snow text-ink", number: "text-ember", text: "text-muted" },
  { card: "bg-cloud text-ink", number: "text-ember", text: "text-muted" },
  { card: "bg-ember text-snow", number: "text-sun", text: "text-white/90" },
];

/** "What you'll remember": a numbered card per highlight, in the flag colours. */
export const TrekHighlights = ({ highlights }: { highlights: HomeTrek["highlights"] }) => (
  <section aria-labelledby="highlights-h" className="flex flex-col gap-6">
    <h2 id="highlights-h">{highlights.heading}</h2>
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
      {highlights.points.map((point, index) => {
        const look = LOOKS[index % LOOKS.length];
        return (
          <li key={point.title} className={`flex min-h-50 flex-col gap-2.5 rounded-[20px] p-6 ${look.card}`}>
            <span className={`font-display text-[15px] leading-5 font-bold ${look.number}`}>{String(index + 1).padStart(2, "0")}</span>
            <h3 className={`mt-auto text-[22px]! leading-7! ${look.card.includes("text-snow") ? "text-snow!" : ""}`}>{point.title}</h3>
            <p className={`text-[15px] leading-5.75 ${look.text}`}>{point.text}</p>
          </li>
        );
      })}
    </ol>
  </section>
);
