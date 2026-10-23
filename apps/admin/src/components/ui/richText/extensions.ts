import { StarterKit } from "@tiptap/starter-kit";

import { isSafeHref } from "@/lib/richText/richText";

/**
 * The editor knows only what src/lib/richText allows: paragraphs, bold, italic, links and lists. Anything
 * else pasted in (headings, colors, tables from Word or Google Docs) becomes plain paragraphs.
 */
export const RICH_TEXT_EXTENSIONS = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    underline: false,
    link: {
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: "https",
      isAllowedUri: (url) => isSafeHref(url),
      HTMLAttributes: { target: null, rel: "noopener noreferrer nofollow" },
    },
  }),
];
