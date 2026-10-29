type ArticleTableProps = {
  heading: string;
  header: readonly string[];
  rows: readonly (readonly string[])[];
  footer: readonly string[];
  /** Each row's first cell is its heading. */
  hasRowHeadings: boolean;
};

const CELL = "px-4 py-2.75 align-top";

/** "Table": the admin's own table, scrolling sideways inside its box on phones. */
export const ArticleTable = ({ heading, header, rows, footer, hasRowHeadings }: ArticleTableProps) => (
  <figure className="flex flex-col gap-2.5">
    {heading && <figcaption className="font-display text-lg font-bold text-ink">{heading}</figcaption>}
    <div role="region" aria-label={heading || "Table"} tabIndex={0} className="relative overflow-x-auto rounded-xl border border-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      <table className="w-full border-collapse text-left text-body-sm">
        {header.length > 0 && (
          <thead>
            <tr className="bg-page text-xs font-bold tracking-[0.05em] text-text uppercase">
              {header.map((cell, index) => (
                <th key={index} scope="col" className={CELL}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-muted first:border-t-0">
              {row.map((cell, index) =>
                hasRowHeadings && index === 0 ? (
                  <th key={index} scope="row" className={`${CELL} font-bold text-ink`}>
                    {cell}
                  </th>
                ) : (
                  <td key={index} className={`${CELL} text-text`}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
        {footer.length > 0 && (
          <tfoot>
            <tr className="border-t border-line bg-brand-tint font-bold text-ink">
              {footer.map((cell, index) => (
                <td key={index} className={CELL}>
                  {cell}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  </figure>
);
