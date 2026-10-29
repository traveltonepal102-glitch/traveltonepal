import { DEFAULT_GUIDE_HELP_BOX as DEFAULT_HELP_BOX } from "@ttn/config/guideHelpBox";

import type { TrekSummary } from "@/features/treks/types";
import { coverImage, sharePhotoImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebTravelGuidePageRow } from "@/lib/supabase/database.types";
import { SITE_NAME } from "@/lib/site";

import { toBlock, toPerson, withAnchors } from "./guideBlockRows";
import { field, readAuthor, readChecker, readFacts, readMonthNotes, readSections } from "./guidePageJson";
import type { GuideArticle, GuideFaq } from "./types";

/** Everything a travel guide's page is made from, as read from the database (guidePageRepository). */
export type GuidePageSource = {
  page: WebTravelGuidePageRow;
  /** Every published trek, for the trek cards, itinerary days and comparisons. */
  treks: readonly TrekSummary[];
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
      shareImage: sharePhotoImage(page, photosBaseUrl, title),
    },
    helpBox: {
      heading: firstText(page.help_heading) ?? DEFAULT_HELP_BOX.heading,
      text: firstText(page.help_text) ?? DEFAULT_HELP_BOX.text,
      // Kept as typed (a final space lets the visitor carry on writing).
      message: page.help_message.trim() ? page.help_message : DEFAULT_HELP_BOX.message,
    },
  };
};
