const BASE = "inline-flex items-center justify-center gap-2 font-semibold no-underline transition-colors";

/** The main action, in pine green. */
export const primaryButton = `${BASE} min-h-12 rounded-xl bg-forest px-5 text-snow hover:bg-forest-deep hover:text-snow`;

/** Opens WhatsApp: always with its logo. */
export const whatsAppButton = `${BASE} min-h-12 rounded-xl bg-whatsapp px-5 text-snow hover:bg-[#116a32] hover:text-snow`;

export const outlineButton = `${BASE} min-h-12 rounded-xl border-[1.5px] border-solid border-forest bg-transparent px-5 text-forest hover:bg-forest-tint`;

/** On a dark green background. */
export const outlineOnDarkButton = `${BASE} min-h-12 rounded-xl border-[1.5px] border-solid border-white/50 px-5 text-snow hover:bg-white/10 hover:text-snow`;
