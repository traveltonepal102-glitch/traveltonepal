import type { PageSeo } from "@/features/seo/shareMetadata";
import type { SiteImageSource } from "@/lib/images";

/** What every fixed page has, from the admin's Pages: the top of the page and its Google result. */
export type SitePageTop = {
  /** Small label above the H1; "" for none. */
  eyebrow: string;
  heading: string;
  intro: string;
  seo: PageSeo & { keyword: string };
  /** The photo behind the top of the page, when one is picked (else the page's own default). */
  cover?: SiteImageSource;
  updatedAt: string;
};
