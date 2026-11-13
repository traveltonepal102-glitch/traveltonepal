/** The plain elements of the admin's HTML in this website's look (Tailwind resets them). */
const ELEMENTS = [
  "flex flex-col gap-4 overflow-x-auto",
  "[&_h2]:font-display [&_h2]:text-[28px] [&_h2]:leading-9 [&_h2]:text-ink [&_h3]:font-display [&_h3]:text-[22px] [&_h3]:leading-7 [&_h3]:text-ink [&_h4]:font-semibold [&_h4]:text-ink",
  "[&_strong]:font-semibold [&_strong]:text-ink [&_b]:font-semibold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through [&_mark]:bg-cream",
  "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-1.5 [&_ul]:pl-6 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:gap-1.5 [&_ol]:pl-6",
  "[&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2",
  "[&_blockquote]:border-0 [&_blockquote]:border-l-4 [&_blockquote]:border-solid [&_blockquote]:border-sun [&_blockquote]:pl-4 [&_code]:rounded-xs [&_code]:bg-cloud [&_code]:px-1 [&_pre]:overflow-x-auto",
  "[&_table]:w-full [&_table]:border-collapse [&_table]:text-[15px] [&_th]:bg-cloud [&_th]:p-3 [&_th]:text-left [&_th]:align-top [&_th]:font-semibold [&_td]:border-0 [&_td]:border-t [&_td]:border-solid [&_td]:border-line [&_td]:p-3 [&_td]:align-top",
  "[&_details]:rounded-[10px] [&_details]:border [&_details]:border-solid [&_details]:border-line [&_details]:px-4 [&_details]:py-3 [&_summary]:cursor-pointer [&_summary]:font-semibold [&_summary]:text-ink",
].join(" ");

/** "Custom HTML": already cleaned when read (guideBlocks), so nothing in it can run. */
export const BlogHtml = ({ html }: { html: string }) => <div className={ELEMENTS} dangerouslySetInnerHTML={{ __html: html }} />;
