import { photoAltText } from "@ttn/ui/lib/photos";

import type { CoverColumns } from "@/lib/supabase/database.types";

/**
 * A picture a page shows: a file in /public (`src`), or a library photo from the admin (`src` is its folder,
 * `variantWidths` the sizes made for it, so the browser downloads only the size it needs).
 */
export type SiteImageSource = {
  src: string;
  alt: string;
  variantWidths?: readonly number[];
  /** Tiny blurred preview shown while the photo loads. */
  placeholder?: string;
};

/** A row's cover photo as a SiteImageSource; `subject` names what it shows, for its image text. */
export const coverImage = (row: CoverColumns, photosBaseUrl: string, subject: string, alt?: string): SiteImageSource | undefined => {
  if (!row.cover_id || !row.cover_variant_widths?.length) return undefined;
  return {
    src: `${photosBaseUrl}/${row.cover_id}`,
    alt: alt?.trim() || photoAltText({ place: row.cover_place ?? "" }, subject),
    variantWidths: row.cover_variant_widths,
    placeholder: row.cover_placeholder || undefined,
  };
};
