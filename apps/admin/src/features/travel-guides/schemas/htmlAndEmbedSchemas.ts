import { EMBED_PROVIDERS, toEmbed } from "@ttn/config/embeds";
import type { EmbedHeight } from "@ttn/config/embeds";
import { z } from "zod";

import { requiredText, text } from "@/lib/forms/formFields";

import { SECTION_LIMITS as LIMIT } from "../sectionKinds";
import { sectionId } from "./sectionFields";

/**
 * What "Custom HTML" can't show, named so the admin knows why and what to use instead. The server's cleaner
 * (@ttn/ui/lib/customHtml, too big for this form's browser code) still removes anything else that isn't allowed.
 */
const NOT_SHOWN: { pattern: RegExp; message: string }[] = [
  {
    pattern: /<script\b|<[^>]*\son[a-z]+\s*=|href\s*=\s*["']?\s*javascript:/i,
    message: "Take out the script: scripts can't run on the website. For a map or a video, use an “Embed” section.",
  },
  { pattern: /<(iframe|embed|object)\b/i, message: "Take out the frame: use an “Embed” section for maps and videos." },
  { pattern: /<(img|picture|video|audio|source|svg)\b/i, message: "Take out the image: add photos from the library with a “Photo” section." },
  { pattern: /<(form|input|button|select|textarea)\b/i, message: "Take out the form: a travel guide can't send forms." },
  { pattern: /<(style|link|meta)\b/i, message: "Take out the <style>: use style=\"…\" on the elements instead." },
];

export const htmlSection = z.object({
  id: sectionId,
  type: z.literal("html"),
  html: requiredText(LIMIT.customHtml, "Write the HTML, or remove this section.").superRefine((html, context) => {
    const problem = NOT_SHOWN.find((item) => item.pattern.test(html));
    if (problem) context.addIssue({ code: "custom", message: problem.message });
  }),
});

const SERVICES = EMBED_PROVIDERS.map((provider) => provider.name).join(", ");

const HEIGHTS = ["short", "medium", "tall"] as const satisfies readonly EmbedHeight[];

/** "Embed": the pasted code or link is saved as the frame's address, from one of the allowed services only. */
export const embedSection = z.object({
  id: sectionId,
  type: z.literal("embed"),
  code: z
    .string()
    .max(LIMIT.embedCode, "That's too long for an embed code: paste only the <iframe …> part.")
    .transform((value, context) => {
      const embed = toEmbed(value);
      if (embed) return embed.url;
      context.addIssue({ code: "custom", message: value.trim() ? `Paste the embed code from ${SERVICES}.` : "Paste the embed code or link." });
      return z.NEVER;
    }),
  height: z.enum(HEIGHTS, "Pick how tall it shows."),
  title: requiredText(LIMIT.embedTitle, "Write a title: it names the map or video for screen readers."),
  caption: text(LIMIT.caption),
});
