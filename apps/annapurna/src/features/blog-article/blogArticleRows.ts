import { DEFAULT_GUIDE_HELP_BOX } from "@ttn/config/guideHelpBox";
import type { WebTravelGuidePageRow } from "@ttn/site-data/database.types";
import { toBlock, toPerson, withAnchors } from "@ttn/site-data/guideBlocks";
import type { GuideFactIcon } from "@ttn/site-data/guidePageJson";
import { field, readAuthor, readChecker, readFacts, readMonthNotes, readSections } from "@ttn/site-data/guidePageJson";
import { coverImage } from "@ttn/site-data/images";
import { toPageDates } from "@ttn/site-data/pageDates";
import { firstText } from "@ttn/site-data/rowText";
import { photoShareUrl } from "@ttn/ui/lib/photos";

import type { TrailIconName } from "@/components/ui/TrailIcon";
import { GUIDE_TOPICS, formatGuideDate } from "@/features/home/homeRows";
import type { HomeGuide, HomeTrekCard } from "@/features/home/types";
import { SITE_NAME } from "@/lib/site";

import { pickRelatedBlogs } from "./relatedBlogs";
import type { BlogArticle, BlogBlock, BlogTocLink } from "./types";

export const QUICK_ANSWER_ID = "quick-answer";
export const FAQ_ID = "faq";

/** The admin's key fact icons, in this website's icon set. */
const FACT_ICONS: Record<GuideFactIcon, TrailIconName> = {
  wb_sunny: "sun",
  water_drop: "drop",
  altitude: "trend",
  wb_twilight: "sun",
  calendar_month: "calendar",
  schedule: "clock",
  payments: "tag",
  hiking: "route",
  landscape: "mountain",
  route: "route",
  groups: "users",
  description: "doc",
};

/** "On this page": the quick answer, each headed section and the questions, in the blog's order. */
export const toBlogToc = (blocks: readonly BlogBlock[]): BlogTocLink[] =>
  blocks.flatMap((block) => {
    if (block.type === "quick") return [{ id: QUICK_ANSWER_ID, label: "Quick answer" }];
    if (block.type === "faq") return [{ id: FAQ_ID, label: "Questions and answers" }];
    return block.type === "text" || (block.type === "heading" && block.level === "h2") ? [{ id: block.id, label: block.tocLabel }] : [];
  });

export type BlogSource = {
  page: WebTravelGuidePageRow;
  treks: readonly HomeTrekCard[];
  guides: readonly HomeGuide[];
  photosBaseUrl: string;
  filesBaseUrl: string;
  isLive: boolean;
  isHidden: boolean;
  canonicalPath?: string;
};

/** A blog's page from its row, or undefined when it can't show (no title or cover photo). */
export const toBlogArticle = ({ page, treks, guides, photosBaseUrl, filesBaseUrl, isLive, isHidden, canonicalPath }: BlogSource): BlogArticle | undefined => {
  const title = firstText(page.title);
  const image = title && coverImage(page, photosBaseUrl, title, page.cover_alt);
  if (!title || !image) return undefined;

  const sections = readSections(page.sections);
  const notes = readMonthNotes(page.month_notes);
  const ratings = page.month_ratings?.length === 12 ? page.month_ratings : undefined;
  const months = ratings ? { ratings, notes: notes ?? ratings.map(() => ({ onTheTrail: "", crowds: "" })) } : undefined;
  const blocks = withAnchors(sections.flatMap((section) => toBlock(section, { treks, title, photosBaseUrl, filesBaseUrl, hasMonths: Boolean(months) }) ?? []));
  const author = readAuthor(page.author);
  const checker = readChecker(page.checker);
  const trekOf = (slug: string | null) => (slug ? treks.find((trek) => trek.slug === slug) : undefined);
  const shareId = page.share_id ?? page.cover_id;
  const laterUpdate = page.updated_on && page.updated_on !== page.published_on ? page.updated_on : undefined;

  return {
    slug: page.slug,
    title,
    intro: page.intro.trim(),
    image,
    topic: page.topic,
    topicLabel: GUIDE_TOPICS[page.topic],
    highlightTag: firstText(page.highlight_tag),
    updatedLine: firstText(page.updated_line),
    facts: readFacts(page.facts).map((fact) => ({ icon: FACT_ICONS[fact.icon], label: fact.label, value: fact.value })),
    publishedOn: page.published_on,
    publishedLabel: formatGuideDate(page.published_on),
    updatedOn: laterUpdate,
    updatedLabel: laterUpdate && formatGuideDate(laterUpdate),
    readMinutes: page.read_minutes,
    author: author
      ? { name: author.name, role: author.job_title, bio: author.bio, photo: author.photo ? coverImage(author.photo, photosBaseUrl, author.name, author.name) : undefined, isOurTeam: author.kind !== "guest" }
      : { name: `${SITE_NAME} team`, role: "", bio: "", isOurTeam: true },
    checker: checker ? toPerson({ ...checker, quote: "" }, photosBaseUrl) : undefined,
    trek: trekOf(page.main_trek_slug) ?? trekOf(page.photo_trek_slug),
    months,
    blocks,
    faqs: sections.flatMap((section) => (section.type === "faq" ? field.faqItems(section.content).map(({ question, answer }) => ({ question, body: answer })) : [])),
    toc: toBlogToc(blocks),
    related: pickRelatedBlogs({ slug: page.slug, topic: page.topic, regionSlugs: page.region_slugs, relatedSlugs: page.related_slugs }, guides),
    helpBox: {
      heading: firstText(page.help_heading) ?? DEFAULT_GUIDE_HELP_BOX.heading,
      text: firstText(page.help_text) ?? DEFAULT_GUIDE_HELP_BOX.text,
      // Kept as typed (a final space lets the visitor carry on writing).
      message: page.help_message.trim() ? page.help_message : DEFAULT_GUIDE_HELP_BOX.message,
    },
    showSidebar: page.show_sidebar !== false,
    seo: {
      title: firstText(page.seo_title) ?? title,
      description: firstText(page.seo_description, page.intro) ?? "",
      shareImageBase: shareId ? photoShareUrl(`${photosBaseUrl}/${shareId}`) : undefined,
      isLive,
      dates: toPageDates(page.published_on, page.updated_on ?? page.published_on),
    },
    isHidden,
    canonicalPath,
  };
};
