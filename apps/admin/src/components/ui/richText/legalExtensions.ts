import { TableKit } from "@tiptap/extension-table";
import { StarterKit } from "@tiptap/starter-kit";

import { isSafeHref } from "@/lib/richText/richText";

import { LibraryImage } from "./libraryImageNode";

/**
 * The legal text editor knows only what src/lib/richText/legalText allows: section headings (level 2, numbered on
 * the website), small headings, bold, italic, links, lists, simple tables and photos from the photo library. Anything else pasted in becomes text.
 */
export const LEGAL_TEXT_EXTENSIONS = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
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
  TableKit.configure({ table: { resizable: false, HTMLAttributes: { class: "legal-table" } } }),
  LibraryImage,
];
