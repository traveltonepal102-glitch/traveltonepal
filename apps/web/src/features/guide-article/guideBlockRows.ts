import { EMBED_HEIGHTS, toEmbed } from "@ttn/config/embeds";
import { cleanCustomHtml, customHtmlText } from "@ttn/ui/lib/customHtml";
import { toRichTextDoc } from "@ttn/ui/lib/richText";

import type { TrekSummary } from "@/features/treks/types";
import { coverImage } from "@/lib/images";

import type { CoverRow, PersonRow, SectionRow } from "./guidePageJson";
import { field, readDays, readPeople, readPhotos } from "./guidePageJson";
import type { ArticleBlock, ArticleDay, GuidePerson } from "./types";

/** What the sections are shown with: the published treks, the guide's title (photo text) and whether it has months. */
type BlockContext = { treks: readonly TrekSummary[]; title: string; photosBaseUrl: string; hasMonths: boolean };

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
const toDays = (rows: readonly unknown[]): ArticleDay[] =>
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
const toTable = (content: Record<string, unknown>, settings: Record<string, unknown>): ArticleBlock | undefined => {
  const hasText = (row: readonly string[]) => row.some(Boolean);
  const [header, footer] = [field.cells(content, "header"), field.cells(content, "footer")];
  const rows = field.cellRows(content, "rows").filter(hasText);
  if (!rows.length) return undefined;
  const columns = Math.max(header.length, footer.length, ...rows.map((row) => row.length));
  const fill = (row: readonly string[]) => Array.from({ length: columns }, (_, index) => row[index] ?? "");
  return {
    type: "table",
    heading: field.text(content, "heading"),
    header: hasText(header) ? fill(header) : [],
    rows: rows.map(fill),
    footer: hasText(footer) ? fill(footer) : [],
    hasRowHeadings: settings.hasRowHeadings === true,
  };
};

/** An embed from an allowed service only (checked again here), as tall as the admin chose. */
const toEmbedBlock = (content: Record<string, unknown>, settings: Record<string, unknown>): ArticleBlock | undefined => {
  const embed = typeof settings.url === "string" ? toEmbed(settings.url) : null;
  if (!embed) return undefined;
  const { name, company, kind } = embed.provider;
  const height = Object.entries(EMBED_HEIGHTS).find(([key]) => key === settings.height)?.[1] ?? EMBED_HEIGHTS.medium;
  return { type: "embed", url: embed.url, service: { name, company, kind }, height, title: field.text(content, "title") || name, caption: field.text(content, "caption") };
};

/** One section as a block of the article, or nothing when what it needs is missing (a trek not published, no text…). */
export const toBlock = (section: SectionRow, context: BlockContext): ArticleBlock | undefined => {
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
export const withAnchors = (blocks: readonly ArticleBlock[]): ArticleBlock[] => {
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
