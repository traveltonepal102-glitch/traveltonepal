import { StarterKit } from "@tiptap/starter-kit";

import { isSafeHref } from "@/lib/richText/richText";

import { LibraryImage } from "./libraryImageNode";

/**
 * The editor knows only what src/lib/richText allows: paragraphs, small headings, bold, italic, links, lists and
 * photos from the photo library.
 * Anything else pasted in (other headings, colors, tables from Word or Google Docs) becomes plain paragraphs.
 */
export const RICH_TEXT_EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [3] },
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
  LibraryImage,
];
