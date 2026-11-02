import { isSectionHeading } from "@ttn/ui/lib/legalText";
import type { LegalBlock } from "@ttn/ui/lib/legalText";
import type { RichTextBlock } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";

const TEXT = "flex flex-col gap-2.5 text-base leading-[1.75] text-text [&_li]:pl-1 [&_ul]:marker:text-brand";

/** A legal page's text: paragraphs, small headings (h3), lists and tables (the numbered headings are the sections). */
export const LegalBlocks = ({ blocks }: { blocks: readonly LegalBlock[] }) => (
  <RichText doc={{ type: "doc", content: blocks.filter((block): block is RichTextBlock => !isSectionHeading(block)) }} className={TEXT} />
);
