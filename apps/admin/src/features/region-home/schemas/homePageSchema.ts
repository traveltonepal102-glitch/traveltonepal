import { z } from "zod";

import { optionalId, pageTopFields, readPageTop } from "@/features/pages/schemas/pageTopSchema";
import { readText, requiredText, text } from "@/lib/forms/formFields";

import { HOME_TOP_LIMITS as LIMIT } from "../constants";

/**
 * A region website's Home: its main trek (one of the website's treks, or none yet), then the top of the page like a
 * travel guide's (the photo, its description, the H1, the intro and the WhatsApp button are required) and the
 * Google result.
 */
export const homePageSchema = z.object({
  homeTrekId: optionalId,
  ...pageTopFields,
  photoId: pageTopFields.photoId.refine((id) => id !== null, "Choose the photo at the top of the page."),
  intro: requiredText(LIMIT.intro, "Write the intro: 1–2 sentences under the title."),
  photoAlt: requiredText(LIMIT.photoAlt, "Describe the photo for Google and screen readers."),
  buttonLabel: requiredText(LIMIT.buttonLabel, "Write the WhatsApp button's words."),
  secondLabel: text(LIMIT.buttonLabel),
});

export type HomePageInput = z.output<typeof homePageSchema>;

export const readHomePageForm = (formData: FormData) => ({
  homeTrekId: readText(formData, "homeTrekId"),
  ...readPageTop(formData),
  photoAlt: readText(formData, "photoAlt"),
  buttonLabel: readText(formData, "buttonLabel"),
  secondLabel: readText(formData, "secondLabel"),
});
