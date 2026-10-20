import type { LegalSection } from "../types";

const TEXT = "text-base leading-[1.75] text-text";

/** One numbered section: paragraphs, a bulleted list and/or a table (scrolls sideways inside its box on phones). */
export const LegalSectionBlock = ({ section, number }: { section: LegalSection; number: number }) => (
  <section id={section.id} aria-labelledby={`${section.id}-title`} className="flex scroll-mt-5 flex-col gap-2.5">
    <h2 id={`${section.id}-title`} className="flex items-baseline gap-2.5 text-[22px] leading-snug font-extrabold">
      <span className="flex-none text-[15px] text-brand">{number}.</span>
      {section.heading}
    </h2>
    {section.paragraphs?.map((paragraph) => (
      <p key={paragraph} className={TEXT}>
        {paragraph}
      </p>
    ))}
    {section.list && (
      <ul className="flex flex-col gap-2">
        {section.list.map((item) => (
          <li key={item} className={`flex gap-2.5 ${TEXT}`}>
            <span aria-hidden="true" className="mt-2.5 size-1.5 flex-none rounded-full bg-brand" />
            {item}
          </li>
        ))}
      </ul>
    )}
    {section.table && (
      <div className="overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-115 border-collapse text-left text-body-sm">
          <thead>
            <tr className="bg-page text-xs font-bold tracking-[0.05em] text-text uppercase">
              {section.table.head.map((cell) => (
                <th key={cell} scope="col" className="px-3.5 py-2.75">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {section.table.rows.map((row) => (
              <tr key={row.join("|")} className="border-t border-muted">
                {row.map((cell, index) => (
                  <td key={`${index}-${cell}`} className="px-3.5 py-2.75 text-text">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);
