const BASE = "inline-flex items-center justify-center gap-2 font-semibold no-underline transition-colors";

/** The main action, in monastery maroon. */
export const primaryButton = `${BASE} min-h-12 rounded-full bg-maroon px-5 text-snow hover:bg-maroon-deep hover:text-snow`;

/** Opens WhatsApp: always with its logo. */
export const whatsAppButton = `${BASE} min-h-12 rounded-full bg-whatsapp px-5 text-snow hover:bg-whatsapp-deep hover:text-snow`;

export const outlineButton = `${BASE} min-h-12 rounded-full border-[1.5px] border-solid border-maroon bg-transparent px-5 text-maroon hover:bg-maroon-tint`;

/** A quiet button on a light background (Trip PDF, Share): a hairline border that turns maroon on hover. */
export const quietButton = `${BASE} min-h-11 rounded-full border-[1.5px] border-solid border-line bg-snow px-4 text-[15px] text-maroon hover:border-maroon`;

/** On a dark background (the itinerary, the maroon bands). */
export const outlineOnDarkButton = `${BASE} min-h-12 rounded-full border-[1.5px] border-solid border-white/50 px-5 text-snow hover:bg-white/10 hover:text-snow`;

