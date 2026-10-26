import type { LegalSection } from "../types";
import { LegalBlocks } from "./LegalBlocks";

/** One numbered section: its heading (with its anchor for "On this page") and its text. */
export const LegalSectionBlock = ({ section, number }: { section: LegalSection; number: number }) => (
  <section id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-5 flex-col gap-2.5">
    <h2 id={`${section.id}-title`} className="flex items-baseline gap-2.5 text-[22px] leading-snug font-extrabold">
      <span className="flex-none text-[15px] text-brand">{number}.</span>
      {section.heading}
    </h2>
    <LegalBlocks blocks={section.blocks} />
  </section>
);
