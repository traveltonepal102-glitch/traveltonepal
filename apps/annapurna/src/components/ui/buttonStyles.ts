const BASE = "inline-flex items-center justify-center gap-2 font-semibold no-underline transition-colors";

/** The main action, in navy. */
export const primaryButton = `${BASE} min-h-12 rounded-[10px] bg-navy px-5 text-snow hover:bg-navy-deep hover:text-snow`;

/** The one call to book on a page ("Check dates"), in ember red. */
export const ctaButton = `${BASE} min-h-12 rounded-[10px] bg-ember px-5 text-snow hover:bg-ember-deep hover:text-snow`;

/** Opens WhatsApp: always with its logo. */
export const whatsAppButton = `${BASE} min-h-12 rounded-[10px] bg-whatsapp px-5 text-snow hover:bg-[#256742] hover:text-snow`;

export const outlineButton = `${BASE} min-h-12 rounded-[10px] border border-solid border-field bg-snow px-5 text-ink hover:border-navy hover:bg-cloud hover:text-ink`;

/** On navy. */
export const outlineOnDarkButton = `${BASE} min-h-12 rounded-[10px] border border-solid border-white/60 px-5 text-snow hover:bg-white/10 hover:text-snow`;
