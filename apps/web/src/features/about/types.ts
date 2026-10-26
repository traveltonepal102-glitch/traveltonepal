import type { IconName } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { IconTone } from "@/components/shared/iconTones";
import type { SitePageTop } from "@/features/site-pages/types";
import type { SiteImageSource } from "@/lib/images";

export type Milestone = { year: string; title: string; text: string; icon: IconName; tone: IconTone };

export type AboutPromise = { icon: IconName; tone: IconTone; title: string; text: string };

/** The founder, an office author picked in Pages › About (name, job title and photo come from Authors). */
export type Founder = {
  name: string;
  /** First name, e.g. "Ask Sujan on WhatsApp". */
  shortName: string;
  role: string;
  photo?: SiteImageSource;
};

/** The About page as saved in the admin's Pages › About. */
export type AboutPageContent = {
  top: SitePageTop;
  /** Hero stat, e.g. "1,200+"; "" leaves the stat out. */
  trekkersGuided: string;
  story: {
    heading: string;
    /** Short version on every trek page ("Our heritage and roots"). */
    teaser: string;
    /** The founder's story, in his own words. */
    body: RichTextDoc;
    quote: string;
    photos: SiteImageSource[];
  };
  founder?: Founder;
  milestones: Milestone[];
  /** "What you can expect from us", also every trek page's "Why book your trek with us". */
  promises: AboutPromise[];
  /** The sections' headings and the lines under them, as typed in Pages › About ("" uses the design's wording). */
  headings: Record<"promises" | "team" | "reviews" | "licences", SectionHeading>;
};

export type SectionHeading = { title: string; text: string };

export type TeamGroup = "office" | "guides";

/** One card in "Our guides and team". */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  place: string;
  languages: readonly string[];
  group: TeamGroup;
  photo?: SiteImageSource;
};
