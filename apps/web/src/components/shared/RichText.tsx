import { isContactRedirect } from "@ttn/config/contact";
import { isSafeHref } from "@ttn/ui/lib/richText";
import type { RichTextBlock, RichTextDoc, RichTextInline } from "@ttn/ui/lib/richText";
import Link from "next/link";
import type { ReactNode } from "react";

import { RichTextPhoto } from "./RichTextPhoto";

const LINK = "rounded-xs font-semibold text-brand underline underline-offset-2 hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-ring";

type HeadingLevel = "h3" | "h4";

/** Bold and italic as marked; a link only when its address is safe (checked again here, not only on save). */
const InlineText = ({ inline }: { inline: RichTextInline }) => {
  if (inline.type === "hardBreak") return <br />;
  const marks = inline.marks ?? [];
  let node: ReactNode = inline.text;
  if (marks.some((mark) => mark.type === "italic")) node = <em>{node}</em>;
  if (marks.some((mark) => mark.type === "bold")) node = <strong className="font-bold text-ink">{node}</strong>;

  const link = marks.find((mark) => mark.type === "link");
  if (!link || !isSafeHref(link.attrs.href)) return node;
  const { href } = link.attrs;
  return href.startsWith("/") && !isContactRedirect(href) ? (
    <Link href={href} className={LINK}>
      {node}
    </Link>
  ) : (
    <a href={href} rel="noopener noreferrer" className={LINK}>
      {node}
    </a>
  );
};

const Inlines = ({ content = [] }: { content?: readonly RichTextInline[] }) =>
  content.map((inline, index) => <InlineText key={index} inline={inline} />);

const Block = ({ block, headingLevel }: { block: RichTextBlock; headingLevel: HeadingLevel }) => {
  if (block.type === "paragraph") {
    return block.content?.length ? (
      <p>
        <Inlines content={block.content} />
      </p>
    ) : null;
  }
  if (block.type === "heading") {
    const Heading = headingLevel;
    return (
      <Heading className="font-display text-h4 text-ink">
        <Inlines content={block.content} />
      </Heading>
    );
  }
  if (block.type === "image") return <RichTextPhoto image={block} />;
  const List = block.type === "orderedList" ? "ol" : "ul";
  return (
    <List className={`flex flex-col gap-1.5 pl-6 ${block.type === "orderedList" ? "list-decimal" : "list-disc"}`}>
      {block.content.map((item, index) => (
        // space-y, not flex: a flex <li> is no longer a list item, so the browser draws no bullet or number.
        <li key={index} className="space-y-1.5">
          {item.content.map((child, childIndex) => (
            <Block key={childIndex} block={child} headingLevel={headingLevel} />
          ))}
        </li>
      ))}
    </List>
  );
};

type RichTextProps = {
  doc: RichTextDoc;
  /** The wrapper's classes: spacing between blocks and the text style, e.g. "flex flex-col gap-4 text-body-lg". */
  className?: string;
  /** The level the admin's "small heading" gets where the text shows (one below the section's own heading). */
  headingLevel?: HeadingLevel;
};

/**
 * Text written in the admin's rich text editor, as plain HTML on the server: paragraphs, small headings, bold,
 * italic, links, lists and photos. Nothing else exists in the format (@ttn/ui/lib/richText), so nothing else renders.
 */
export const RichText = ({ doc, className, headingLevel = "h3" }: RichTextProps) => (
  <div className={className}>
    {doc.content.map((block, index) => (
      <Block key={index} block={block} headingLevel={headingLevel} />
    ))}
  </div>
);
