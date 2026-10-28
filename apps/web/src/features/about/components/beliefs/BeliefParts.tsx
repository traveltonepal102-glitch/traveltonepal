import type { ReactNode } from "react";

type Tone = "light" | "dark";

/** A belief section's spacing; scroll-mt keeps the heading clear of the sticky in-page menu after a jump. */
export const BELIEF_SECTION = "scroll-mt-14 py-16 md:py-24";

/** The big quote beside or under a belief's text (design: 30px Outfit, brand blue). */
export const BIG_QUOTE = "font-display text-[26px] leading-8 font-extrabold md:text-[30px] md:leading-[38px]";

type BeliefHeadingProps = { id: string; eyebrow: string; heading: string; tone?: Tone };

/** A belief's small label ("01 · We listen first") and H2. */
export const BeliefHeading = ({ id, eyebrow, heading, tone = "light" }: BeliefHeadingProps) => (
  <>
    {eyebrow && <p className={`text-eyebrow uppercase ${tone === "dark" ? "text-saffron" : "text-brand"}`}>{eyebrow}</p>}
    <h2 id={id} className={`text-h1-sm tracking-tight md:text-h1 ${tone === "dark" ? "text-white" : ""}`}>
      {heading}
    </h2>
  </>
);

/** Paragraphs at the design's reading size. */
export const Paragraphs = ({ paragraphs, tone = "light", size = "lg" }: { paragraphs: readonly string[]; tone?: Tone; size?: "lg" | "md" }) => (
  <>
    {paragraphs.map((paragraph) => (
      <p key={paragraph} className={`${size === "lg" ? "text-[17px] leading-[29px]" : "text-base leading-[27px]"} ${tone === "dark" ? "text-navy-text" : "text-text"}`}>
        {paragraph}
      </p>
    ))}
  </>
);

/** The quote beside the text: “…” in big brand blue. */
export const SideQuote = ({ quote }: { quote: string }) => (
  <p className={`min-w-0 flex-[1_1_320px] ${BIG_QUOTE} text-brand`}>&ldquo;{quote}&rdquo;</p>
);

/** Text on the left (heading, paragraphs), the big quote on the right, bottom-aligned; stacked on phones. */
export const BeliefIntro = ({ children, quote }: { children: ReactNode; quote: string }) => (
  <div className="flex flex-wrap items-end gap-x-16 gap-y-8">
    <div className="flex min-w-0 flex-[1.2_1_480px] flex-col gap-5">{children}</div>
    {quote && <SideQuote quote={quote} />}
  </div>
);
