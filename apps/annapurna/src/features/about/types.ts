import type { AboutFlexible, AboutHonest, AboutListen, AboutOpenMind, AboutSafety, TitledText } from "@ttn/site-data/aboutRows";
import type { SiteImageSource } from "@ttn/site-data/images";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { SitePageTop } from "@/features/site-pages/types";

/** The founder, an office author picked in Pages › About (name and job title come from Authors). */
export type Founder = { name: string; role: string };

export type TeamGroup = "office" | "guides";

/** One card in "Our guides and team". */
export type TeamMember = { id: string; name: string; role: string; place: string; languages: readonly string[]; group: TeamGroup; photo?: SiteImageSource };

/** The About page as saved in the admin's Pages › About. */
export type AboutContent = {
  top: SitePageTop;
  /** Hero stat, e.g. "50+"; "" leaves the stat out. */
  trekkersGuided: string;
  stat?: { value: string; label: string };
  safetyLine: { lead: string; text: string };
  listen: AboutListen;
  honest: AboutHonest;
  flexible: AboutFlexible;
  openMind: AboutOpenMind;
  safety: AboutSafety;
  story: {
    heading: string;
    body: RichTextDoc;
    quote: string;
    /** Under the founder's name, e.g. "From Tanahun, near the Annapurna region". */
    origin: string;
    photo?: SiteImageSource;
    goals: TitledText[];
    voice: { eyebrow: string; heading: string; paragraphs: string[] };
  };
  founder?: Founder;
  headings: Record<"team" | "licences", { title: string; text: string }>;
};
