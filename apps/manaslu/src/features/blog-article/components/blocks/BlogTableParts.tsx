const SCROLLER = "table-scroll rounded-[14px] border border-solid border-line";
const CELL = "p-3 text-left align-top";

type BlogTableProps = { heading: string; header: readonly string[]; rows: readonly (readonly string[])[]; footer: readonly string[]; hasRowHeadings: boolean };

/** The admin's table. It scrolls sideways on a phone, and can be reached by keyboard to do so. */
export const BlogTable = ({ heading, header, rows, footer, hasRowHeadings }: BlogTableProps) => (
  <section aria-label={heading || "Table"} className="flex flex-col gap-3">
    {heading && <h3>{heading}</h3>}
    <div role="group" aria-label="Table, scrolls sideways" tabIndex={0} className={SCROLLER}>
      <table className="w-full border-collapse text-[15px] leading-5.5">
        {header.length > 0 && (
          <thead className="bg-stone">
            <tr>
              {header.map((cell, index) => (
                <th key={index} scope="col" className={`${CELL} font-semibold text-ink`}>
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-0 border-t border-solid border-line first:border-t-0 [thead+tbody_&]:first:border-t">
              {row.map((cell, index) =>
                hasRowHeadings && index === 0 ? (
                  <th key={index} scope="row" className={`${CELL} font-semibold text-ink`}>
                    {cell}
                  </th>
                ) : (
                  <td key={index} className={CELL}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
        {footer.length > 0 && (
          <tfoot className="border-0 border-t border-solid border-line bg-forest-tint font-semibold text-ink">
            <tr>
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
  </section>
);

type BlogCostTableProps = { heading: string; rows: readonly { item: string; price: string }[]; totalLabel: string; total: string };

/** A list of costs, with a total when there is one. */
export const BlogCostTable = ({ heading, rows, totalLabel, total }: BlogCostTableProps) => (
  <section aria-label={heading || "Costs"} className="flex flex-col gap-3">
    {heading && <h3>{heading}</h3>}
    <div role="group" aria-label="Costs, scrolls sideways" tabIndex={0} className={SCROLLER}>
      <table className="w-full border-collapse text-[15px] leading-5.5">
        <tbody>
          {rows.map((row) => (
            <tr key={row.item} className="border-0 border-t border-solid border-line first:border-t-0">
              <th scope="row" className={`${CELL} font-normal`}>
                {row.item}
              </th>
              <td className="p-3 text-right font-semibold whitespace-nowrap text-ink">{row.price}</td>
            </tr>
          ))}
        </tbody>
        {totalLabel && total && (
          <tfoot className="border-0 border-t border-solid border-line bg-forest-tint">
            <tr>
              <th scope="row" className={`${CELL} font-semibold text-ink`}>
                {totalLabel}
              </th>
              <td className="p-3 text-right font-semibold whitespace-nowrap text-ink">{total}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  </section>
);
