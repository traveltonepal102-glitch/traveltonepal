import type { Photo } from "@/features/photos/types";
import type { LegalTextDoc } from "@/lib/richText/legalText";
import type { RichTextDoc } from "@/lib/richText/richText";
import type { SitePageSlug } from "@/lib/supabase/database.types";

/** What every page has: the top of the page and its Google result. */
export type PageTopValues = {
  /** The small label above the heading (Contact: the green line). */
  eyebrow: string;
  heading: string;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  seoKeyword: string;
  /** The photo behind the top of the page. */
  photoId: string | null;
};

export type MilestoneValues = { year: string; title: string; text: string };
export type PromiseValues = { icon: string; title: string; text: string };
export type NextStepValues = { when: string; title: string; text: string };
export type FaqValues = { question: string; answer: RichTextDoc };

/** Pages › About (the team is not here: it comes from Authors and Trekking guides). */
export type AboutPageValues = PageTopValues & {
  trekkersGuided: string;
  storyHeading: string;
  /** The founder's story, in his own words. */
  storyText: RichTextDoc;
  /** The short version on every trek page. */
  storyTeaser: string;
  quote: string;
  /** An office author: "Quote by", and the founder on trek pages. */
  founderAuthorId: string | null;
  storyPhotoIds: string[];
  milestones: MilestoneValues[];
  promisesHeading: string;
  promisesIntro: string;
  promises: PromiseValues[];
  teamHeading: string;
  teamIntro: string;
  reviewsHeading: string;
  licencesHeading: string;
  licencesIntro: string;
};

/** Pages › Contact (the contact details themselves are in Site settings). */
export type ContactPageValues = PageTopValues & {
  replyWhatsApp: string;
  replyEmail: string;
  nextSteps: NextStepValues[];
  officeDirections: string;
  timeZones: string[];
  /** The line under the time difference table. */
  timeNote: string;
  faqHeading: string;
  faqs: FaqValues[];
};

/** Pages › List pages: the top and Google result of Home, Treks, Regions and Travel guides, edited together. */
export type ListPagesValues = Record<"home" | "treks" | "regions" | "travel-guides", PageTopValues>;

/** One legal page (Pages › Legal pages): its title (H1), intro and text, and when and whether it was checked. */
export type LegalPageValues = {
  heading: string;
  intro: string;
  body: LegalTextDoc;
  lawyerChecked: boolean;
  /** "YYYY-MM-DD", or "" for none. */
  lastUpdated: string;
  /** Set "last updated" to the day of publishing, when the page's words changed. */
  autoDate: boolean;
};

export type LegalPagesValues = Record<"terms" | "privacy" | "impressum" | "cookies", LegalPageValues>;

/** A page as saved, with its photos for the form. */
export type SitePage = {
  slug: SitePageSlug;
  top: PageTopValues;
  photo: Photo | null;
  founderAuthorId: string | null;
  storyPhotos: Photo[];
  /** The page's own parts, as saved (read with lib/pageContent). */
  content: unknown;
  updatedAt: string;
};

/** A person in the About team, as the About editor lists them (read-only). */
export type AboutTeamPerson = { id: string; name: string; role: string; group: "office" | "guides"; isShown: boolean; note: string; href: string };

/** What the About editor shows from elsewhere (read-only): the numbers and licences that fill in by themselves. */
export type AboutFacts = {
  foundedYear: number | null;
  regionCount: number;
  licences: { label: string; value: string }[];
  hasCertificate: boolean;
};
