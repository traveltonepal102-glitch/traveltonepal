import { slugify } from "@/utils/slugify";

/**
 * A new guide file's address (@ttn/config/guideFiles): guide-files/<id>/<the uploaded file's name as a slug>.pdf,
 * e.g. "Langtang packing list (2026).PDF" → "langtang-packing-list-2026.pdf"; "download.pdf" when nothing is left.
 */
export const guideFilePath = (id: string, originalName: string) => `guide-files/${id}/${slugify(originalName.replace(/\.pdf$/i, "")) || "download"}.pdf`;
