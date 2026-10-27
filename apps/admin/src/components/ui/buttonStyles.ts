/**
 * Admin button looks (design: .ad-btn, .ad-icon-btn). Class strings rather than components, so they also
 * style links and Base UI triggers.
 */
const BASE =
  "m-0 inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-sans no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const BUTTON = `${BASE} min-h-10 gap-2 rounded-md px-4 text-body-sm font-bold`;

export const primaryButton = `${BUTTON} border border-solid border-brand bg-brand text-on-brand hover:bg-brand-hover data-popup-open:bg-brand-hover`;

export const secondaryButton = `${BUTTON} border border-solid border-line-strong bg-surface text-ink hover:border-brand hover:text-brand`;

/** Opens a remove or delete step (always with an icon or word, like every red). */
export const dangerButton = `${BUTTON} border border-solid border-[#fecaca] bg-surface text-danger hover:border-danger`;

/** The final "Yes, delete" in a confirm window. */
export const dangerSolidButton = `${BUTTON} border border-solid border-danger bg-danger text-white hover:bg-[#912018] disabled:cursor-wait disabled:opacity-70`;

/** A small borderless icon button for row and card actions (move, remove…). */
export const ghostIconButton = `${BASE} size-8 flex-none rounded-sm border border-solid border-transparent bg-transparent text-text hover:border-line-strong hover:bg-surface hover:text-brand disabled:cursor-not-allowed disabled:opacity-40`;

export const iconButton =`${BASE} relative size-10 flex-none rounded-md border border-solid border-border bg-surface text-text hover:border-brand hover:text-brand data-popup-open:border-brand data-popup-open:text-brand`;
