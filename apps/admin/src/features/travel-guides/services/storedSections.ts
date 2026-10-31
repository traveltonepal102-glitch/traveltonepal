import { cleanCustomHtml } from "@ttn/ui/lib/customHtml";
import { z } from "zod";

import { EMPTY_RICH_TEXT, richTextDocSchema } from "@/lib/richText/richText";
import type { ArticleSectionTypeValue, Json, MonthRating } from "@/lib/supabase/database.types";

import { emptyMonths } from "../constants";
import { CROWD_VALUES } from "../sectionKinds";
import type { ArticleSection, MonthEntry } from "../types";

const doc = richTextDocSchema.catch(EMPTY_RICH_TEXT);
const words = z.string().catch("");

/** Each kind's stored words, read leniently: anything missing or malformed comes back empty to fix in the editor. */
const CONTENT = {
  text: z.object({ heading: words, tocLabel: words, body: doc }).catch({ heading: "", tocLabel: "", body: EMPTY_RICH_TEXT }),
  headingOnly: z.object({ heading: words, tocLabel: words }).catch({ heading: "", tocLabel: "" }),
  body: z.object({ body: doc }).catch({ body: EMPTY_RICH_TEXT }),
  faq: z.object({ items: z.array(z.object({ question: words, answer: doc })).catch([]) }).catch({ items: [] }),
  check: z.object({ heading: words, items: z.array(words).catch([]) }).catch({ heading: "", items: [] }),
  heading: z.object({ heading: words }).catch({ heading: "" }),
  cta: z.object({ heading: words, buttonText: words, message: words }).catch({ heading: "", buttonText: "", message: "" }),
  sentence: z.object({ text: words }).catch({ text: "" }),
  cost: z
    .object({ heading: words, rows: z.array(z.object({ item: words, price: words })).catch([]), totalLabel: words, total: words })
    .catch({ heading: "", rows: [], totalLabel: "", total: "" }),
  image: z.object({ caption: words, alt: words }).catch({ caption: "", alt: "" }),
  map: z.object({ title: words, place: words }).catch({ title: "", place: "" }),
  title: z.object({ title: words }).catch({ title: "" }),
  table: z
    .object({ heading: words, header: z.array(words).catch([]), rows: z.array(z.array(words).catch([])).catch([]), footer: z.array(words).catch([]) })
    .catch({ heading: "", header: [], rows: [], footer: [] }),
  html: z.object({ html: words }).catch({ html: "" }),
  embed: z.object({ title: words, caption: words }).catch({ title: "", caption: "" }),
};

/** Each kind's choices that are the same in every language (article_sections.settings). */
const SETTINGS = {
  callout: z.object({ tone: z.enum(["note", "warning"]).catch("warning") }).catch({ tone: "warning" }),
  heading: z.object({ level: z.enum(["h2", "h3"]).catch("h2") }).catch({ level: "h2" }),
  months: z.object({ view: z.enum(["strip", "table"]).catch("strip") }).catch({ view: "strip" }),
  days: z.object({ dayIds: z.array(z.string()).catch([]) }).catch({ dayIds: [] }),
  compare: z.object({ trekIds: z.array(z.string()).catch([]) }).catch({ trekIds: [] }),
  video: z.object({ youtubeId: words }).catch({ youtubeId: "" }),
  table: z.object({ hasRowHeadings: z.boolean().catch(false) }).catch({ hasRowHeadings: false }),
  embed: z.object({ url: words, height: z.enum(["short", "medium", "tall"]).catch("medium") }).catch({ url: "", height: "medium" }),
};

/** A saved table, every row as wide as the widest (a row that doesn't show is saved empty). */
const storedTable = (content: Json | undefined, settings: Json) => {
  const { heading, header, rows, footer } = CONTENT.table.parse(content);
  const columns = Math.max(1, header.length, footer.length, ...rows.map((row) => row.length));
  const fill = (row: string[]) => Array.from({ length: columns }, (_, index) => row[index] ?? "");
  return {
    heading,
    hasHeader: header.length > 0,
    hasFooter: footer.length > 0,
    ...SETTINGS.table.parse(settings),
    header: fill(header),
    rows: (rows.length ? rows : [[]]).map(fill),
    footer: fill(footer),
  };
};

/** A saved section with the guides and photos it shows, in order. */
type StoredSectionRow = { id: string; type: ArticleSectionTypeValue; trek_id: string | null; settings: Json; guideIds?: string[]; photoIds?: string[] };

/** A saved section and its words in one language (undefined: not written in that language yet). */
export const storedSection = (row: StoredSectionRow, content: Json | undefined): ArticleSection => {
  if (row.type === "trek") return { id: row.id, type: "trek", trekId: row.trek_id };
  if (row.type === "text") return { id: row.id, type: "text", ...CONTENT.text.parse(content) };
  if (row.type === "paragraph") return { id: row.id, type: "paragraph", ...CONTENT.body.parse(content) };
  if (row.type === "heading") return { id: row.id, type: "heading", ...SETTINGS.heading.parse(row.settings), ...CONTENT.headingOnly.parse(content) };
  if (row.type === "quick") return { id: row.id, type: "quick", ...CONTENT.body.parse(content) };
  if (row.type === "callout") return { id: row.id, type: "callout", ...SETTINGS.callout.parse(row.settings), ...CONTENT.body.parse(content) };
  if (row.type === "check") return { id: row.id, type: "check", ...CONTENT.check.parse(content) };
  if (row.type === "table") return { id: row.id, type: "table", ...storedTable(content, row.settings) };
  if (row.type === "html") return { id: row.id, type: "html", ...CONTENT.html.parse(content) };
  if (row.type === "months") return { id: row.id, type: "months", ...SETTINGS.months.parse(row.settings), ...CONTENT.heading.parse(content) };
  if (row.type === "cta") return { id: row.id, type: "cta", ...CONTENT.cta.parse(content) };
  const guideIds = row.guideIds ?? [];
  const photoIds = row.photoIds ?? [];
  if (row.type === "quote") return { id: row.id, type: "quote", ...CONTENT.sentence.parse(content) };
  if (row.type === "days") return { id: row.id, type: "days", trekId: row.trek_id, ...SETTINGS.days.parse(row.settings) };
  if (row.type === "altitude") return { id: row.id, type: "altitude", trekId: row.trek_id, ...CONTENT.heading.parse(content) };
  if (row.type === "cost") return { id: row.id, type: "cost", ...CONTENT.cost.parse(content) };
  if (row.type === "compare") return { id: row.id, type: "compare", ...SETTINGS.compare.parse(row.settings) };
  if (row.type === "tip" || row.type === "gquote") return { id: row.id, type: row.type, guideId: guideIds[0] ?? null, ...CONTENT.sentence.parse(content) };
  if (row.type === "meet") return { id: row.id, type: "meet", guideIds, ...CONTENT.heading.parse(content) };
  if (row.type === "image") return { id: row.id, type: "image", photoId: photoIds[0] ?? null, ...CONTENT.image.parse(content) };
  if (row.type === "gallery") return { id: row.id, type: "gallery", photoIds };
  if (row.type === "map") return { id: row.id, type: "map", ...CONTENT.map.parse(content) };
  if (row.type === "embed") {
    const { url, height } = SETTINGS.embed.parse(row.settings);
    return { id: row.id, type: "embed", code: url, height, ...CONTENT.embed.parse(content) };
  }
  if (row.type === "video") return { id: row.id, type: "video", ...SETTINGS.video.parse(row.settings), ...CONTENT.title.parse(content) };
  return { id: row.id, type: "faq", ...CONTENT.faq.parse(content) };
};

const noteSchema = z.object({ onTheTrail: words, crowds: z.union([z.literal(""), z.enum(CROWD_VALUES)]).catch("") });

/** The guide's 12 months: the saved ratings and this language's notes, or empty months to fill in. */
export const storedMonths = (ratings: MonthRating[] | null, notes: Json | undefined): MonthEntry[] => {
  const months = emptyMonths();
  const savedNotes = z.array(noteSchema).catch([]).parse(notes);
  return months.map((month, index) => ({ ...month, rating: ratings?.[index] ?? month.rating, ...savedNotes[index] }));
};

/** Linked rows (guides, photos) in their saved order, as ids. */
export const inOrder = <Key extends string>(rows: (Record<Key, string> & { position: number })[], key: Key) =>
  [...rows].sort((a, b) => a.position - b.position).map((row) => row[key]);

/** A section as save_article takes it: what every language shares, and this language's words as `content`. */
export const toStoredSection = (section: ArticleSection) => {
  const trekId = section.type === "trek" || section.type === "days" || section.type === "altitude" ? (section.trekId ?? "") : "";
  const none: string[] = [];
  const shared = { id: section.id ?? "", type: section.type, trek_id: trekId, settings: {}, guide_ids: none, photo_ids: none };
  if (section.type === "text") return { ...shared, content: { heading: section.heading, tocLabel: section.tocLabel, body: section.body } };
  if (section.type === "paragraph" || section.type === "quick") return { ...shared, content: { body: section.body } };
  // An H3 isn't in the contents list, so it keeps no short name.
  if (section.type === "heading") return { ...shared, settings: { level: section.level }, content: { heading: section.heading, tocLabel: section.level === "h2" ? section.tocLabel : "" } };
  if (section.type === "callout") return { ...shared, settings: { tone: section.tone }, content: { body: section.body } };
  if (section.type === "check") return { ...shared, content: { heading: section.heading, items: section.items } };
  if (section.type === "table") {
    const { heading, hasHeader, hasFooter, hasRowHeadings, header, rows, footer } = section;
    return { ...shared, settings: { hasRowHeadings }, content: { heading, header: hasHeader ? header : [], rows, footer: hasFooter ? footer : [] } };
  }
  // Cleaned here, on the server: the form's own check only names what can't show.
  if (section.type === "html") return { ...shared, content: { html: cleanCustomHtml(section.html) } };
  if (section.type === "months") return { ...shared, settings: { view: section.view }, content: { heading: section.heading } };
  if (section.type === "cta") return { ...shared, content: { heading: section.heading, buttonText: section.buttonText, message: section.message } };
  if (section.type === "faq") return { ...shared, content: { items: section.items } };
  if (section.type === "quote") return { ...shared, content: { text: section.text } };
  if (section.type === "days") return { ...shared, settings: { dayIds: section.dayIds }, content: {} };
  if (section.type === "altitude") return { ...shared, content: { heading: section.heading } };
  if (section.type === "cost") return { ...shared, content: { heading: section.heading, rows: section.rows, totalLabel: section.totalLabel, total: section.total } };
  if (section.type === "compare") return { ...shared, settings: { trekIds: section.trekIds }, content: {} };
  if (section.type === "tip" || section.type === "gquote") return { ...shared, guide_ids: section.guideId ? [section.guideId] : [], content: { text: section.text } };
  if (section.type === "meet") return { ...shared, guide_ids: section.guideIds, content: { heading: section.heading } };
  if (section.type === "image") return { ...shared, photo_ids: section.photoId ? [section.photoId] : [], content: { caption: section.caption, alt: section.alt } };
  if (section.type === "gallery") return { ...shared, photo_ids: section.photoIds, content: {} };
  if (section.type === "map") return { ...shared, content: { title: section.title, place: section.place } };
  if (section.type === "embed") return { ...shared, settings: { url: section.code, height: section.height }, content: { title: section.title, caption: section.caption } };
  if (section.type === "video") return { ...shared, settings: { youtubeId: section.youtubeId }, content: { title: section.title } };
  return { ...shared, content: {} };
};
