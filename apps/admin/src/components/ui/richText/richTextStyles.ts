/** A formatting button in the rich text toolbar; on (aria-pressed, or data-active for the link) shows in brand blue. */
export const toolbarButtonClass =
  "m-0 inline-flex size-8 cursor-pointer items-center justify-center rounded-sm border-0 bg-transparent text-text hover:bg-surface hover:text-brand aria-pressed:bg-brand-tint aria-pressed:text-brand data-active:bg-brand-tint data-active:text-brand data-popup-open:bg-brand-tint data-popup-open:text-brand focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40";

/** The writing area (Tiptap's ProseMirror element): spacing for paragraphs, lists and links, and tables with lines (selected cells tinted). */
export const editorContentClass =
  "px-3 py-2.5 text-body-sm leading-relaxed text-ink outline-none [&_a]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3:first-child]:mt-0 [&_a]:text-brand [&_a]:underline [&_li_p]:m-0 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:m-0 [&_p+p]:mt-3 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 " +
  "[&_.tableWrapper]:my-3 [&_.tableWrapper]:overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-solid [&_td]:border-border [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-solid [&_th]:border-border [&_th]:bg-page [&_th]:p-2 [&_th]:text-left [&_th]:align-top [&_.selectedCell]:bg-brand-tint";
