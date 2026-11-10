import { z } from "zod";

import { readTexts, text } from "@/lib/forms/formFields";

import { PHOTO_LIMITS as LIMIT } from "../constants";
import type { PhotoText } from "../types";

/** What can be typed about a photo itself. All optional: an empty alt text lets the website write one. */
export const photoTextSchema = z.object({
  altText: text(LIMIT.altText),
  caption: text(LIMIT.caption),
  place: text(LIMIT.place),
}) satisfies z.ZodType<PhotoText, unknown>;

/** The "Alt text and caption" form's FormData as the schema expects it. */
export const readPhotoTextForm = (formData: FormData) => readTexts(formData, ["altText", "caption", "place"]);
