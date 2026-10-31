import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";

import type { ArticleSection, FaqItem, SectionType } from "../types";
import { emptyTableCells } from "./tableDraft";

/** A question in the editor, with a key that never changes (its answer editor keeps its place when moved). */
export type KeyedFaqItem = FaqItem & { key: string };

type FaqSection = Extract<ArticleSection, { type: "faq" }>;

/** A section as the editor holds it: the same as saved, with keys on the questions. */
export type EditorSection = Exclude<ArticleSection, FaqSection> | (Omit<FaqSection, "items"> & { items: KeyedFaqItem[] });

export const emptyFaqItem = (): KeyedFaqItem => ({ key: crypto.randomUUID(), question: "", answer: EMPTY_RICH_TEXT });

const keyFaqItems = (items: FaqItem[]): KeyedFaqItem[] => items.map((item) => ({ ...item, key: crypto.randomUUID() }));

/** A saved section, ready for the editor. */
export const toEditorSection = (section: ArticleSection): EditorSection => (section.type === "faq" ? { ...section, items: keyFaqItems(section.items) } : section);

/** A new, empty section of `type` (not saved yet). */
export const newSection = (type: SectionType): EditorSection => {
  switch (type) {
    case "text":
      return { id: null, type, heading: "", tocLabel: "", body: EMPTY_RICH_TEXT };
    case "paragraph":
    case "quick":
      return { id: null, type, body: EMPTY_RICH_TEXT };
    case "heading":
      return { id: null, type, level: "h2", heading: "", tocLabel: "" };
    case "callout":
      return { id: null, type, tone: "warning", body: EMPTY_RICH_TEXT };
    case "check":
      return { id: null, type, heading: "", items: [""] };
    case "table":
      return { id: null, type, heading: "", hasHeader: true, hasFooter: false, hasRowHeadings: false, ...emptyTableCells() };
    case "html":
      return { id: null, type, html: "" };
    case "quote":
      return { id: null, type, text: "" };
    case "trek":
      return { id: null, type, trekId: null };
    case "months":
      return { id: null, type, heading: "", view: "strip" };
    case "days":
      return { id: null, type, trekId: null, dayIds: [] };
    case "altitude":
      return { id: null, type, trekId: null, heading: "" };
    case "cost":
      return { id: null, type, heading: "", rows: [{ item: "", price: "" }], totalLabel: "", total: "" };
    case "compare":
      return { id: null, type, trekIds: [] };
    case "tip":
    case "gquote":
      return { id: null, type, guideId: null, text: "" };
    case "meet":
      return { id: null, type, heading: "", guideIds: [] };
    case "image":
      return { id: null, type, photoId: null, caption: "", alt: "" };
    case "gallery":
      return { id: null, type, photoIds: [] };
    case "map":
      return { id: null, type, title: "", place: "" };
    case "embed":
      return { id: null, type, code: "", height: "medium", title: "", caption: "" };
    case "video":
      return { id: null, type, youtubeId: "", title: "" };
    case "cta":
      return { id: null, type, heading: "", buttonText: "Ask about dates on WhatsApp", message: "" };
    case "faq":
      return { id: null, type, items: [emptyFaqItem()] };
  }
};

/** A copy of a section to put next to it: the same words, saved as a new section. */
export const copySection = (section: EditorSection): EditorSection => toEditorSection({ ...section, id: null });

/** The article body as the form sends it, in order. The editor's keys go along; the server's check drops them. */
export const sectionsJson = (sections: EditorSection[]) => JSON.stringify(sections);
