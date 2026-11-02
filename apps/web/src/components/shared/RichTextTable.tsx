import type { RichTextFlowBlock, RichTextTable as RichTextTableBlock } from "@ttn/ui/lib/richText";
import type { ReactNode } from "react";

type RichTextTableProps = {
  table: RichTextTableBlock;
  /** A cell's text (RichText renders it, so the table needn't import RichText back). */
  renderCell: (content: readonly RichTextFlowBlock[]) => ReactNode;
};

const CELL = "px-3.5 py-2.75 align-top";

/**
 * A table from a rich text: a first row of heading cells becomes its head; on phones it scrolls sideways inside its
 * box (contain: its width never widens the text column).
 */
export const RichTextTable = ({ table, renderCell }: RichTextTableProps) => {
  const [first, ...rest] = table.content;
  const hasHead = first?.content.every((cell) => cell.type === "tableHeader");
  const body = hasHead ? rest : table.content;
  return (
    <div className="relative overflow-x-auto rounded-xl border border-line [contain:inline-size]">
      <table className="w-full min-w-115 border-collapse text-left text-body-sm leading-normal">
        {hasHead && first && (
          <thead>
            <tr className="bg-page text-xs font-bold tracking-[0.05em] text-text uppercase">
              {first.content.map((cell, index) => (
                <th key={index} scope="col" className={CELL}>
                  {renderCell(cell.content)}
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
                  <Cell key={index} {...(Cell === "th" ? { scope: "row" } : {})} className={`${CELL} text-text`}>
                    {renderCell(cell.content)}
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
