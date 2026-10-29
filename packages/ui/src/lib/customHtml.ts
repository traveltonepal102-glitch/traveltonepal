import sanitizeHtml from "sanitize-html";

/*
 * A travel guide's "Custom HTML" section: the admin's own markup, cleaned to text, layout, lists, links and tables.
 * Scripts, frames, forms, pasted images and event handlers never reach the website: scripts would run without the
 * visitor's consent, and photos come from the photo library (metadata stripped, sized). Cleaned when saved (admin)
 * and again when read (website). Server code only: the cleaner is too big for the browser.
 */

const LENGTH = /^\d+(\.\d+)?(px|em|rem|%)$|^0$/;
const LENGTHS = /^(\d+(\.\d+)?(px|em|rem|%)|0|auto)( (\d+(\.\d+)?(px|em|rem|%)|0|auto)){0,3}$/;
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i;
const BORDER = /^(\d+(\.\d+)?px )?(none|solid|dashed|dotted)( #[0-9a-f]{3,8}| rgba?\([\d\s.,%]+\)| [a-z]+)?$/i;

const OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr", "h2", "h3", "h4", "strong", "b", "em", "i", "u", "s", "small", "mark", "sub", "sup", "abbr", "code", "pre",
    "blockquote", "ul", "ol", "li", "dl", "dt", "dd", "a", "div", "span", "section", "figure", "figcaption", "details", "summary",
    "table", "caption", "thead", "tbody", "tfoot", "tr", "th", "td", "colgroup", "col",
  ],
  allowedAttributes: {
    "*": ["style", "title"],
    a: ["href", "target", "rel"],
    ol: ["start", "reversed"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    col: ["span"],
    details: ["open"],
  },
  allowedSchemes: ["https", "http", "mailto", "tel"],
  allowedSchemesAppliedToAttributes: ["href"],
  allowProtocolRelative: false,
  allowedStyles: {
    "*": {
      color: [COLOR],
      "background-color": [COLOR],
      "text-align": [/^(left|right|center|justify)$/],
      "font-weight": [/^(normal|bold|[1-9]00)$/],
      "font-style": [/^(normal|italic)$/],
      "text-decoration": [/^(none|underline|line-through)$/],
      padding: [LENGTHS],
      margin: [LENGTHS],
      border: [BORDER],
      "border-radius": [LENGTHS],
      width: [LENGTH],
      "max-width": [LENGTH],
    },
  },
  // Links to other websites open in a new tab and don't tell them where the visitor came from.
  transformTags: {
    a: (tagName, attribs) => {
      const kept = Object.fromEntries(Object.entries(attribs).filter(([name]) => name !== "target" && name !== "rel"));
      return { tagName, attribs: /^https?:/i.test(attribs.href ?? "") ? { ...kept, target: "_blank", rel: "noopener noreferrer" } : kept };
    },
  },
  disallowedTagsMode: "discard",
};

/** The HTML as the website may show it (see the note above). */
export const cleanCustomHtml = (html: string) => sanitizeHtml(html, OPTIONS).trim();

/** The words a reader sees in the HTML, e.g. to leave out a section with none. */
export const customHtmlText = (html: string) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
