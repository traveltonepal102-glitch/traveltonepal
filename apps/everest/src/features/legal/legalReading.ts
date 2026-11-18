import { isSectionHeading } from "@ttn/ui/lib/legalText";
import type { LegalBlock } from "@ttn/ui/lib/legalText";
import { richTextBlockToPlainText } from "@ttn/ui/lib/richText";

import type { LegalDoc } from "./types";

/** About how fast people read German running text, words a minute. */
const WORDS_PER_MINUTE = 200;

const wordsIn = (blocks: readonly LegalBlock[]) =>
  blocks.reduce((sum, block) => sum + (isSectionHeading(block) ? 0 : richTextBlockToPlainText(block).split(/\s+/).filter(Boolean).length), 0);

/** The page's reading time in whole minutes (at least 1), from its lead and sections, for "ca. 5 Min. Lesezeit". */
export const legalReadingMinutes = ({ lead, sections }: Pick<LegalDoc, "lead" | "sections">) => {
  const words = wordsIn(lead) + sections.reduce((sum, section) => sum + section.heading.split(/\s+/).length + wordsIn(section.blocks), 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};
