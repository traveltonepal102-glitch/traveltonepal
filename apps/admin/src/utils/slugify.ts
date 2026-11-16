import { toSlugText } from "@ttn/config/slugText";

/** Web addresses (slugs) are at most this long everywhere (the database checks it too). */
export const MAX_SLUG_LENGTH = 80;

/** Lowercase letters and numbers in groups joined by single dashes, e.g. "langtang-valley". */
export const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** "Nar Phu (Upper)" → "nar-phu-upper", "Über den Thorong La" → "ueber-den-thorong-la": a web address suggested from a name. */
export const slugify = (name: string) => toSlugText(name).slice(0, MAX_SLUG_LENGTH).replace(/-+$/, "");
