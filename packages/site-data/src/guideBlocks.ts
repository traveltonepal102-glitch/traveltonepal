import { EMBED_HEIGHTS, toEmbed } from "@ttn/config/embeds";
import { GUIDE_FILE_PATH, fileSizeLabel } from "@ttn/config/guideFiles";
import { cleanCustomHtml, customHtmlText } from "@ttn/ui/lib/customHtml";
import { toRichTextDoc } from "@ttn/ui/lib/richText";

import type { EmbedProvider } from "@ttn/config/embeds";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { CoverRow, PersonRow, SectionRow } from "./guidePageJson";
import { field, readDays, readPeople, readPhotos } from "./guidePageJson";
import { coverImage } from "./images";
import type { SiteImageSource } from "./images";

/** A trekking guide shown in the article (a tip, their own words, or "Meet the guides"). */
export type GuidePerson = { name: string; role: string; quote?: string; photo?: SiteImageSource };

/** A day of a trek's plan shown in the article, with its number in the trek. */
export type GuideDay = {
  place: string;
  highPlace?: string;
  title: string;
  subtitle: string;
  duration?: string;
  altitudeM: number;
  sleepAltitudeM?: number;
  isHighPoint: boolean;
  body: RichTextDoc;
  dayNumber: number;
};

/** A piece of the article body, top to bottom (the admin's section kinds). `Trek` is each website's own trek card. */
export type GuideBlock<Trek> =
  | { type: "quick"; body: RichTextDoc }
  /** Where the questions sit (they are the article's faqs, also given to Google). */
  | { type: "faq" }
  | { type: "paragraph"; body: RichTextDoc }
  /** A section with its heading: a stop in the contents list. */
  | { type: "text"; id: string; heading: string; tocLabel: string; body: RichTextDoc }
  /** A heading with nothing under it; an H2 is a stop in the contents list too. */
  | { type: "heading"; id: string; level: "h2" | "h3"; heading: string; tocLabel: string }
  | { type: "callout"; tone: "note" | "warning"; body: RichTextDoc }
  | { type: "check"; heading: string; items: readonly string[] }
  /** Every row as wide as the widest; no header or footer: []. */
  | { type: "table"; heading: string; header: readonly string[]; rows: readonly (readonly string[])[]; footer: readonly string[]; hasRowHeadings: boolean }
  /** The admin's own HTML, cleaned (@ttn/ui/lib/customHtml). */
  | { type: "html"; html: string }
  /** The article's months, as a colour strip or a table with notes. */
  | { type: "months"; heading: string; view: "strip" | "table" }
  | { type: "cta"; heading: string; buttonText: string; message: string }
  | { type: "trek"; trek: Trek }
  | { type: "quote"; text: string }
  | { type: "days"; trek: Trek; days: readonly GuideDay[] }
  /** Every day of the trek, for its altitude curve. */
  | { type: "altitude"; heading: string; trek: Trek; days: readonly GuideDay[] }
  | { type: "cost"; heading: string; rows: readonly { item: string; price: string }[]; totalLabel: string; total: string }
  | { type: "compare"; treks: readonly Trek[] }
  | { type: "tip"; guide: GuidePerson; text: string }
  | { type: "gquote"; guide: GuidePerson; text: string }
  | { type: "meet"; heading: string; guides: readonly GuidePerson[] }
  | { type: "image"; image: SiteImageSource; caption: string }
  | { type: "gallery"; images: readonly SiteImageSource[] }
  | { type: "map"; title: string; place: string }
  /** A frame from an allowed service (@ttn/config/embeds), loaded once the visitor allows it. `height` in px. */
  | { type: "embed"; url: string; service: Pick<EmbedProvider, "name" | "company" | "kind">; height: number; title: string; caption: string }
  /** A PDF to open or download; `size` like "1.2 MB" ("" when unknown). */
  | { type: "file"; url: string; title: string; description: string; size: string }
  /** A YouTube video, played in privacy-enhanced mode once the visitor allows it. */
  | { type: "video"; youtubeId: string; title: string };

/** What the sections are shown with: the published treks, the guide's title (photo text), whether it has months and where files are. */
type BlockContext<Trek> = { treks: readonly Trek[]; title: string; photosBaseUrl: string; filesBaseUrl: string; hasMonths: boolean };

/** "Autumn: the clearest views" → "autumn-the-clearest-views", for the contents list. */
const anchorOf = (heading: string) =>
  heading
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** A portrait's image text is the person's name, not where it was taken. */
export const toPerson = (row: PersonRow, photosBaseUrl: string): GuidePerson => ({
  name: row.name,
  role: row.role,
  quote: row.quote || undefined,
  photo: row.photo ? coverImage(row.photo, photosBaseUrl, row.name, row.name) : undefined,
});

const toImage = (row: CoverRow, photosBaseUrl: string, subject: string, alt?: string) => coverImage(row, photosBaseUrl, subject, alt);

/** A YouTube video id, as the admin saves it (11 letters, digits, "-" or "_"). */
const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/** A trek's days as the view sends them, in order. */
const toDays = (rows: readonly unknown[]): GuideDay[] =>
  readDays(rows).map((day) => ({
    place: day.place,
    highPlace: day.high_place || undefined,
    title: day.title,
    subtitle: day.subtitle,
    duration: day.duration || undefined,
    altitudeM: day.altitude_m,
    sleepAltitudeM: day.sleep_altitude_m ?? undefined,
    isHighPoint: day.is_high_point,
    body: toRichTextDoc(day.description),
    dayNumber: day.day_number,
  }));

/** A saved table, every row as wide as the widest; rows with no text are left out, and so is a header or footer with none. */
const toTable = (content: Record<string, unknown>, settings: Record<string, unknown>) => {
  const hasText = (row: readonly string[]) => row.some(Boolean);
  const [header, footer] = [field.cells(content, "header"), field.cells(content, "footer")];
  const rows = field.cellRows(content, "rows").filter(hasText);
  if (!rows.length) return undefined;
  const columns = Math.max(header.length, footer.length, ...rows.map((row) => row.length));
  const fill = (row: readonly string[]) => Array.from({ length: columns }, (_, index) => row[index] ?? "");
  return {
    type: "table" as const,
    heading: field.text(content, "heading"),
    header: hasText(header) ? fill(header) : [],
    rows: rows.map(fill),
    footer: hasText(footer) ? fill(footer) : [],
    hasRowHeadings: settings.hasRowHeadings === true,
  };
};

/** An embed from an allowed service only (checked again here), as tall as the admin chose. */
const toEmbedBlock = (content: Record<string, unknown>, settings: Record<string, unknown>) => {
  const embed = typeof settings.url === "string" ? toEmbed(settings.url) : null;
  if (!embed) return undefined;
  const { name, company, kind } = embed.provider;
  const height = Object.entries(EMBED_HEIGHTS).find(([key]) => key === settings.height)?.[1] ?? EMBED_HEIGHTS.medium;
  return { type: "embed" as const, url: embed.url, service: { name, company, kind }, height, title: field.text(content, "title") || name, caption: field.text(content, "caption") };
};

/** A PDF uploaded in the admin (its address checked again here, so it is safe to add to the base) with its title. */
const toFileBlock = (content: Record<string, unknown>, settings: Record<string, unknown>, filesBaseUrl: string) => {
  const title = field.text(content, "title");
  if (!title || typeof settings.path !== "string" || !GUIDE_FILE_PATH.test(settings.path)) return undefined;
  const size = typeof settings.byteSize === "number" && settings.byteSize > 0 ? fileSizeLabel(settings.byteSize) : "";
  return { type: "file" as const, url: `${filesBaseUrl}/${settings.path}`, title, description: field.text(content, "description"), size };
};

/** One section as a block of the article, or nothing when what it needs is missing (a trek not published, no text…). */
export const toBlock = <Trek extends { slug: string }>(section: SectionRow, context: BlockContext<Trek>): GuideBlock<Trek> | undefined => {
  const { content, settings } = section;
  const trekOf = (slug: string | null) => (slug ? context.treks.find((trek) => trek.slug === slug) : undefined);
  const guide = readPeople(section.guides)[0];

  switch (section.type) {
    case "quick":
    case "paragraph": {
      const body = field.doc(content, "body");
      return body && { type: section.type, body };
    }
    case "faq":
      return field.faqItems(content).length ? { type: "faq" } : undefined;
    case "text": {
      const heading = field.text(content, "heading");
      const body = field.doc(content, "body");
      return heading && body ? { type: "text", id: "", heading, tocLabel: field.text(content, "tocLabel") || heading, body } : undefined;
    }
    case "heading": {
      const heading = field.text(content, "heading");
      const level = settings.level === "h3" ? "h3" : "h2";
      return heading ? { type: "heading", id: "", level, heading, tocLabel: field.text(content, "tocLabel") || heading } : undefined;
    }
    case "callout": {
      const body = field.doc(content, "body");
      return body && { type: "callout", tone: settings.tone === "warning" ? "warning" : "note", body };
    }
    case "check": {
      const items = field.texts(content, "items");
      return items.length ? { type: "check", heading: field.text(content, "heading"), items } : undefined;
    }
    case "months":
      return context.hasMonths ? { type: "months", heading: field.text(content, "heading"), view: settings.view === "strip" ? "strip" : "table" } : undefined;
    case "cta": {
      const [heading, buttonText, message] = ["heading", "buttonText", "message"].map((key) => field.text(content, key));
      return heading && buttonText && message ? { type: "cta", heading, buttonText, message } : undefined;
    }
    case "trek": {
      const trek = trekOf(section.trek_slug);
      return trek && { type: "trek", trek };
    }
    case "quote": {
      const quote = field.text(content, "text");
      return quote ? { type: "quote", text: quote } : undefined;
    }
    case "days": {
      const trek = trekOf(section.trek_slug);
      const days = toDays(section.days);
      return trek && days.length ? { type: "days", trek, days } : undefined;
    }
    // The curve needs two days, as on the trek page.
    case "altitude": {
      const trek = trekOf(section.trek_slug);
      const days = toDays(section.days);
      return trek && days.length >= 2 ? { type: "altitude", heading: field.text(content, "heading"), trek, days } : undefined;
    }
    case "table":
      return toTable(content, settings);
    case "html": {
      const html = cleanCustomHtml(field.text(content, "html"));
      return customHtmlText(html) ? { type: "html", html } : undefined;
    }
    case "embed":
      return toEmbedBlock(content, settings);
    case "file":
      return toFileBlock(content, settings, context.filesBaseUrl);
    case "cost": {
      const rows = field.costRows(content);
      return rows.length ? { type: "cost", heading: field.text(content, "heading"), rows, totalLabel: field.text(content, "totalLabel"), total: field.text(content, "total") } : undefined;
    }
    case "compare": {
      const treks = section.trek_slugs.flatMap((slug) => trekOf(slug) ?? []);
      return treks.length >= 2 ? { type: "compare", treks } : undefined;
    }
    case "tip":
    case "gquote": {
      const words = field.text(content, "text");
      return guide && words ? { type: section.type, guide: toPerson(guide, context.photosBaseUrl), text: words } : undefined;
    }
    case "meet": {
      const guides = readPeople(section.guides).map((person) => toPerson(person, context.photosBaseUrl));
      return guides.length ? { type: "meet", heading: field.text(content, "heading"), guides } : undefined;
    }
    case "image": {
      const [photo] = readPhotos(section.photos);
      const image = photo && toImage(photo, context.photosBaseUrl, context.title, field.text(content, "alt"));
      return image ? { type: "image", image, caption: field.text(content, "caption") } : undefined;
    }
    case "gallery": {
      const images = readPhotos(section.photos).flatMap((photo) => toImage(photo, context.photosBaseUrl, context.title) ?? []);
      return images.length >= 2 ? { type: "gallery", images } : undefined;
    }
    case "map": {
      const place = field.text(content, "place");
      return place ? { type: "map", title: field.text(content, "title"), place } : undefined;
    }
    case "video": {
      const youtubeId = typeof settings.youtubeId === "string" && YOUTUBE_ID.test(settings.youtubeId) ? settings.youtubeId : "";
      return youtubeId ? { type: "video", youtubeId, title: field.text(content, "title") } : undefined;
    }
    // Questions are gathered for the end of the article.
    default:
      return undefined;
  }
};

/** Each "text" and "heading" section gets its own anchor for the contents list (a repeated heading gets "-2", "-3"…). */
export const withAnchors = <Trek>(blocks: readonly GuideBlock<Trek>[]): GuideBlock<Trek>[] => {
  const used = new Set<string>();
  return blocks.map((block, index) => {
    if (block.type !== "text" && block.type !== "heading") return block;
    const base = anchorOf(block.heading) || `section-${index + 1}`;
    let id = base;
    for (let number = 2; used.has(id); number += 1) id = `${base}-${number}`;
    used.add(id);
    return { ...block, id };
  });
};
