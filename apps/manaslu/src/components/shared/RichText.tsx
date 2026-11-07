import { isContactRedirect } from "@ttn/config/contact";
import { isSafeHref } from "@ttn/ui/lib/richText";
import type { RichTextBlock, RichTextDoc, RichTextImage, RichTextInline } from "@ttn/ui/lib/richText";
import Link from "next/link";
import type { ReactNode } from "react";

import { SiteImage } from "@/components/ui/SiteImage";
import { photosPublicBaseUrl } from "@/env";

const LINK = "font-semibold underline underline-offset-2";

/** Bold and italic as marked; a link only when its address is safe (checked again here, not only on save). */
const InlineText = ({ inline }: { inline: RichTextInline }) => {
  if (inline.type === "hardBreak") return <br />;
  const marks = inline.marks ?? [];
  let node: ReactNode = inline.text;
  if (marks.some((mark) => mark.type === "italic")) node = <em>{node}</em>;
  if (marks.some((mark) => mark.type === "bold")) node = <strong className="font-semibold text-ink">{node}</strong>;

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

const Inlines = ({ content = [] }: { content?: readonly RichTextInline[] }) => content.map((inline, index) => <InlineText key={index} inline={inline} />);

const Photo = ({ image }: { image: RichTextImage }) => {
  const { photoId, alt, width, height, variantWidths, fileName } = image.attrs;
  return (
    <figure className="relative overflow-hidden rounded-xl bg-forest-tint" style={{ aspectRatio: `${width} / ${height}` }}>
      <SiteImage image={{ src: `${photosPublicBaseUrl}/${photoId}`, alt, variantWidths, fileName }} sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
    </figure>
  );
};

const Block = ({ block }: { block: RichTextBlock }) => {
  if (block.type === "paragraph") {
    return block.content?.length ? (
      <p>
        <Inlines content={block.content} />
      </p>
    ) : null;
  }
  if (block.type === "heading") {
    return (
      <h3>
        <Inlines content={block.content} />
      </h3>
    );
  }
  if (block.type === "image") return <Photo image={block} />;
  if (block.type === "table") {
    // A first row of heading cells is the table's head, so screen readers can name each column.
    const [first, ...others] = block.content;
    const hasHead = Boolean(first?.content.every((cell) => cell.type === "tableHeader"));
    return (
      <div role="group" aria-label="Table, scrolls sideways" tabIndex={0} className="overflow-x-auto rounded-xl border border-solid border-line">
        <table className="w-full border-collapse text-[15px] leading-[22px]">
          {hasHead && first && (
            <thead className="bg-stone">
              <tr>
                {first.content.map((cell, cellIndex) => (
                  <th key={cellIndex} scope="col" className="p-3 text-left align-top font-semibold text-ink">
                    {cell.content.map((child, childIndex) => (
                      <Block key={childIndex} block={child} />
                    ))}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {(hasHead ? others : block.content).map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-solid border-line first:border-t-0 [thead+tbody_&]:first:border-t">
                {row.content.map((cell, cellIndex) => {
                  const Cell = cell.type === "tableHeader" ? "th" : "td";
                  return (
                    <Cell key={cellIndex} className="p-3 text-left align-top">
                      {cell.content.map((child, childIndex) => (
                        <Block key={childIndex} block={child} />
                      ))}
                    </Cell>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  const List = block.type === "orderedList" ? "ol" : "ul";
  return (
    <List className={`flex max-w-[72ch] flex-col gap-1.5 pl-6 ${block.type === "orderedList" ? "list-decimal" : "list-disc"}`}>
      {block.content.map((item, index) => (
        <li key={index} className="space-y-1.5">
          {item.content.map((child, childIndex) => (
            <Block key={childIndex} block={child} />
          ))}
        </li>
      ))}
    </List>
  );
};

/** Text written in the admin's rich text editor, as plain HTML on the server, in this website's look. */
export const RichText = ({ doc, className = "flex flex-col gap-3.5" }: { doc: RichTextDoc; className?: string }) => (
  <div className={className}>
    {doc.content.map((block, index) => (
      <Block key={index} block={block} />
    ))}
  </div>
);
