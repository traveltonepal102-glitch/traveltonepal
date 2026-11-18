import { slugify } from "@/utils/slugify";

/**
 * A new guide file's address (@ttn/config/guideFiles): guide-files/<id>/<the uploaded file's name as a slug>.<ending>,
 * e.g. "Langtang packing list (2026).PDF" → "langtang-packing-list-2026.pdf"; "download.<ending>" when nothing is left.
 * `extension` is the checked format's ending (lower case), never taken from the name as it is.
 */
export const guideFilePath = (id: string, originalName: string, extension: string) =>
  `guide-files/${id}/${slugify(originalName.replace(/\.[a-z0-9]+$/i, "")) || "download"}.${extension}`;
