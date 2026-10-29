import { PROSE } from "../styles";

/**
 * The plain elements of the admin's HTML in the article's style (Tailwind resets them): headings, lists, links,
 * quotes, tables and details, as the rich text and legal tables show them.
 */
const ELEMENTS = [
  "flex flex-col gap-4",
  "[&_h2]:font-display [&_h2]:text-h3 [&_h2]:text-ink [&_h3]:font-display [&_h3]:text-h4 [&_h3]:text-ink [&_h4]:font-bold [&_h4]:text-ink",
  "[&_strong]:font-bold [&_strong]:text-ink [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through [&_mark]:bg-saffron-tint",
  "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-6 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-1.5 [&_ol]:pl-6 [&_ul]:marker:text-brand",
  "[&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-hover",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-saffron [&_blockquote]:pl-4 [&_hr]:border-line [&_code]:rounded-xs [&_code]:bg-muted [&_code]:px-1 [&_pre]:overflow-x-auto",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-body-sm [&_th]:bg-page [&_th]:px-3.5 [&_th]:py-2.5 [&_th]:text-left [&_th]:align-top [&_td]:border-t [&_td]:border-muted [&_td]:px-3.5 [&_td]:py-2.5 [&_td]:align-top",
  "[&_details]:rounded-lg [&_details]:border [&_details]:border-line [&_details]:px-4 [&_details]:py-3 [&_summary]:cursor-pointer [&_summary]:font-bold [&_summary]:text-ink",
].join(" ");

/** "Custom HTML": already cleaned when read (guideBlockRows), so nothing in it can run. */
export const ArticleHtml = ({ html }: { html: string }) => (
  <div className={`${PROSE} ${ELEMENTS} overflow-x-auto`} dangerouslySetInnerHTML={{ __html: html }} />
);
