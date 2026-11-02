import { GUIDE_FILE_PATH, MAX_GUIDE_FILE_BYTES } from "@ttn/config/guideFiles";
import { z } from "zod";

import { requiredText, text } from "@/lib/forms/formFields";

import { SECTION_LIMITS as LIMIT } from "../sectionKinds";
import { sectionId } from "./sectionFields";

/** "File to download": a PDF uploaded in the editor (only addresses an upload hands out), with its title. */
export const fileSection = z.object({
  id: sectionId,
  type: z.literal("file"),
  path: z
    .string()
    .refine(Boolean, "Add the PDF, or remove this section.")
    .pipe(z.string().regex(GUIDE_FILE_PATH, "Add the PDF again.")),
  byteSize: z.number("Add the PDF again.").int("Add the PDF again.").positive("Add the PDF again.").max(MAX_GUIDE_FILE_BYTES, "Use a PDF of up to 15 MB."),
  title: requiredText(LIMIT.fileTitle, "Write the file's title, e.g. “Langtang packing list”."),
  description: text(LIMIT.fileDescription),
});
