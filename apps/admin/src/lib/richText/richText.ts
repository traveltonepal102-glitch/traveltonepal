import { EMPTY_RICH_TEXT, isRichTextEmpty, richTextDocSchema, richTextToPlainText } from "@ttn/ui/lib/richText";
import type { RichTextDoc } from "@ttn/ui/lib/richText";
import { z } from "zod";

/**
 * Rich text as the admin saves it. The format and its check are shared with the website (@ttn/ui/lib/richText):
 * anything else (other headings, images, styles, unknown attributes) is rejected or dropped before saving.
 */
export type {
  RichTextBlock,
  RichTextDoc,
  RichTextHeading,
  RichTextInline,
  RichTextList,
  RichTextListItem,
  RichTextMark,
  RichTextParagraph,
} from "@ttn/ui/lib/richText";
export { EMPTY_RICH_TEXT, isRichTextEmpty, isSafeHref, richTextDocSchema, richTextToPlainText, toRichTextDoc } from "@ttn/ui/lib/richText";

/** The longest JSON the server reads for one field (a few thousand words, with room for formatting). */
const MAX_JSON_LENGTH = 100_000;

/**
 * What someone types as a link address → a link: "nepal.gov.np" → "https://nepal.gov.np",
 * "info@example.com" → "mailto:info@example.com". Other schemes are kept as typed (isSafeHref decides).
 */
export const normalizeHref = (input: string) => {
  const value = input.trim();
  if (!value || value.startsWith("/") || /^[a-z][a-z0-9+.-]*:/i.test(value)) return value;
  if (/^[^\s@/]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  return `https://${value}`;
};

/**
 * A form field holding a rich text document as JSON (what RichTextEditor posts). Checks the structure and the
 * length of the words; an empty document comes back as EMPTY_RICH_TEXT.
 */
export const richTextField = (maxCharacters: number) =>
  z
    .string()
    .max(MAX_JSON_LENGTH, "This text is too long.")
    .transform((json, context): RichTextDoc => {
      if (!json) return EMPTY_RICH_TEXT;
      let value: unknown;
      try {
        value = JSON.parse(json);
      } catch {
        value = undefined;
      }
      const result = richTextDocSchema.safeParse(value);
      if (result.success) return isRichTextEmpty(result.data) ? EMPTY_RICH_TEXT : result.data;

      context.addIssue({
        code: "custom",
        message: "This text has formatting that can't be saved. Links must start with https://, mailto: or /.",
      });
      return z.NEVER;
    })
    .refine((doc) => richTextToPlainText(doc).length <= maxCharacters, `Use ${maxCharacters} characters or fewer.`);
