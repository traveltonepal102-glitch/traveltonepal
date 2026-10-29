import { isSectionHeading } from "@ttn/ui/lib/legalText";
import type { LegalBlock, LegalTable } from "@ttn/ui/lib/legalText";
import type { RichTextBlock } from "@ttn/ui/lib/richText";

import { RichText } from "@/components/shared/RichText";

const TEXT = "flex flex-col gap-2.5 text-base leading-[1.75] text-text [&_li]:pl-1 [&_ul]:marker:text-brand";

/** A table from the legal text: its first row of headers as the head, scrolling sideways inside its box on phones. */
const LegalTableView = ({ table }: { table: LegalTable }) => {
  const [first, ...rest] = table.content;
  const hasHead = first?.content.every((cell) => cell.type === "tableHeader");
  const body = hasHead ? rest : table.content;
  return (
    <div className="relative overflow-x-auto rounded-xl border border-line">
      <table className="w-full min-w-115 border-collapse text-left text-body-sm">
        {hasHead && first && (
          <thead>
            <tr className="bg-page text-xs font-bold tracking-[0.05em] text-text uppercase">
              {first.content.map((cell, index) => (
                <th key={index} scope="col" className="px-3.5 py-2.75 align-top">
                  <RichText doc={{ type: "doc", content: cell.content }} className="flex flex-col gap-1" />
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-muted first:border-t-0">
              {row.content.map((cell, index) => {
                const Cell = cell.type === "tableHeader" ? "th" : "td";
                return (
                  <Cell key={index} {...(Cell === "th" ? { scope: "row" } : {})} className="px-3.5 py-2.75 align-top text-text">
                    <RichText doc={{ type: "doc", content: cell.content }} className="flex flex-col gap-1" />
                  </Cell>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/** Runs of text blocks, each table on its own. */
const groupBlocks = (blocks: readonly LegalBlock[]) =>
  blocks.reduce<(RichTextBlock[] | LegalTable)[]>((groups, block) => {
    if (block.type === "table") return [...groups, block];
    if (isSectionHeading(block)) return groups;
    const last = groups.at(-1);
    if (Array.isArray(last)) last.push(block);
    else groups.push([block]);
    return groups;
  }, []);

/** A legal page's text: paragraphs, small headings (h3), lists and tables (the numbered headings are the sections). */
export const LegalBlocks = ({ blocks }: { blocks: readonly LegalBlock[] }) =>
  groupBlocks(blocks).map((group, index) =>
    Array.isArray(group) ? <RichText key={index} doc={{ type: "doc", content: group }} className={TEXT} /> : <LegalTableView key={index} table={group} />,
  );
