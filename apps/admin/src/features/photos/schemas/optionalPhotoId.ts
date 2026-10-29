import { z } from "zod";

/** A library photo chosen in a form (LibraryPhotoField): its id, or "" for none (→ null). */
export const optionalPhotoId = z
  .string()
  .transform((value) => value || null)
  .pipe(z.uuid("The photo couldn't be read. Reload the page and try again.").nullable());
