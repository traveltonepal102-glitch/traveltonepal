/**
 * Admin button looks (design: .ad-btn, .ad-icon-btn). Class strings rather than components, so they also
 * style links and Base UI triggers.
 */
const BASE =
  "m-0 inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-sans no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

const BUTTON = `${BASE} min-h-10 gap-2 rounded-md px-4 text-body-sm font-bold`;

export const primaryButton = `${BUTTON} border border-solid border-brand bg-brand text-on-brand hover:bg-brand-hover data-popup-open:bg-brand-hover`;

export const secondaryButton = `${BUTTON} border border-solid border-line-strong bg-surface text-ink hover:border-brand hover:text-brand`;

export const iconButton = `${BASE} relative size-10 flex-none rounded-md border border-solid border-border bg-surface text-text hover:border-brand hover:text-brand data-popup-open:border-brand data-popup-open:text-brand`;
