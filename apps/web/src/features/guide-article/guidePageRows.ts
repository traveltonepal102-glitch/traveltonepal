import { paragraphsOf } from "@/features/trek-detail/trekPageJson";
import type { TrekSummary } from "@/features/treks/types";
import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebTravelGuidePageRow } from "@/lib/supabase/database.types";
import { SITE_NAME } from "@/lib/site";

import type { CoverRow, PersonRow, SectionRow } from "./guidePageJson";
import { field, readAuthor, readChecker, readDays, readFacts, readMonthNotes, readPeople, readPhotos, readSections } from "./guidePageJson";
import type { ArticleBlock, GuideArticle, GuideFaq, GuidePerson } from "./types";

/** Everything a travel guide's page is made from, as read from the database (guidePageRepository). */
export type GuidePageSource = {
  page: WebTravelGuidePageRow;
  /** Every published trek, for the trek cards, itinerary days and comparisons. */
  treks: readonly TrekSummary[];
};

/** "Autumn: the clearest views" → "autumn-the-clearest-views", for the contents list. */
const anchorOf = (heading: string) =>
  heading
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** A portrait's image text is the person's name, not where it was taken. */
const toPerson = (row: PersonRow, photosBaseUrl: string): GuidePerson => ({
  name: row.name,
  role: row.role,
  quote: row.quote || undefined,
  photo: row.photo ? coverImage(row.photo, photosBaseUrl, row.name, row.name) : undefined,
});

const toImage = (row: CoverRow, photosBaseUrl: string, subject: string, alt?: string) => coverImage(row, photosBaseUrl, subject, alt);

/** One section as a block of the article, or nothing when what it needs is missing (a trek not published, no text…). */
const toBlock = (section: SectionRow, context: { treks: readonly TrekSummary[]; title: string; photosBaseUrl: string; hasMonths: boolean }): ArticleBlock | undefined => {
  const { content, settings } = section;
  const trekOf = (slug: string | null) => (slug ? context.treks.find((trek) => trek.slug === slug) : undefined);
  const guide = readPeople(section.guides)[0];

  switch (section.type) {
    case "quick":
    case "paragraph": {
      const body = field.doc(content, "body");
      return body && { type: section.type, body };
    }
    case "text": {
      const heading = field.text(content, "heading");
      const body = field.doc(content, "body");
      return heading && body ? { type: "text", id: "", heading, tocLabel: field.text(content, "tocLabel") || heading, body } : undefined;
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
      const days = readDays(section.days).map((day) => ({
        place: day.place,
        title: day.title,
        subtitle: day.subtitle,
        duration: day.duration || undefined,
        altitudeM: day.altitude_m,
        sleepAltitudeM: day.sleep_altitude_m ?? undefined,
        isHighPoint: day.is_high_point,
        text: paragraphsOf(day.description).join(" "),
        dayNumber: day.day_number,
      }));
      return trek && days.length ? { type: "days", trek, days } : undefined;
    }
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
    // Questions are gathered for the end of the article; videos wait for the website's video player.
    default:
      return undefined;
  }
};

/** Each "text" section gets its own anchor for the contents list (a repeated heading gets "-2", "-3"…). */
const withAnchors = (blocks: readonly ArticleBlock[]): ArticleBlock[] => {
  const used = new Set<string>();
  return blocks.map((block, index) => {
    if (block.type !== "text") return block;
    const base = anchorOf(block.heading) || `section-${index + 1}`;
    let id = base;
    for (let number = 2; used.has(id); number += 1) id = `${base}-${number}`;
    used.add(id);
    return { ...block, id };
  });
};

/** A travel guide's page from its database row, or undefined when it can't show (no cover photo). */
export const toGuideArticle = ({ page, treks }: GuidePageSource, photosBaseUrl: string): GuideArticle | undefined => {
  const title = firstText(page.title);
  const image = title && coverImage(page, photosBaseUrl, title, page.cover_alt);
  if (!title || !image) return undefined;

  const sections = readSections(page.sections);
  const notes = readMonthNotes(page.month_notes);
  const ratings = page.month_ratings?.length === 12 ? page.month_ratings : undefined;
  const months = ratings ? { ratings, notes: notes ?? ratings.map(() => ({ onTheTrail: "", crowds: "" })) } : undefined;
  const context = { treks, title, photosBaseUrl, hasMonths: Boolean(months) };
  const author = readAuthor(page.author);
  const checker = readChecker(page.checker);
  const faqs: GuideFaq[] = sections.flatMap((section) => (section.type === "faq" ? field.faqItems(section.content) : []));
  const trekOf = (slug: string | null) => (slug ? treks.find((trek) => trek.slug === slug) : undefined);

  return {
    slug: page.slug,
    title,
    intro: page.intro.trim(),
    image,
    topic: page.topic,
    highlightTag: firstText(page.highlight_tag),
    updatedLine: firstText(page.updated_line),
    facts: readFacts(page.facts),
    publishedOn: page.published_on,
    updatedOn: page.updated_on ?? undefined,
    readMinutes: page.read_minutes,
    author: author
      ? {
          name: author.name,
          role: author.job_title,
          bio: author.bio,
          photo: author.photo ? coverImage(author.photo, photosBaseUrl, author.name, author.name) : undefined,
          isVerified: author.kind !== "guest",
        }
      : { name: `${SITE_NAME} team`, role: "", bio: "", isVerified: true },
    checker: checker ? toPerson({ ...checker, quote: "" }, photosBaseUrl) : undefined,
    trek: trekOf(page.main_trek_slug) ?? trekOf(page.photo_trek_slug),
    months,
    blocks: withAnchors(sections.flatMap((section) => toBlock(section, context) ?? [])),
    faqs,
    relatedSlugs: page.related_slugs,
    regionSlugs: page.region_slugs,
    seo: {
      title: firstText(page.seo_title) ?? title,
      description: firstText(page.seo_description, page.intro) ?? "",
    },
  };
};
