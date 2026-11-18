import type { SiteImageSource } from "@ttn/site-data/images";
import type { PageDates } from "@ttn/site-data/pageDates";

/** What every fixed page has, from the admin's Pages: the top of the page and its Google result. */
export type SitePageTop = {
  /** Small label above the H1; "" for none. */
  eyebrow: string;
  heading: string;
  intro: string;
  /** `isTitleTyped`: the title comes from the page's Google card and shows exactly as typed; else it is the H1, with the website's name after it. */
  seo: { title: string; isTitleTyped: boolean; description: string; shareImageBase?: string };
  /** The photo behind the top of the page, when one is picked. */
  cover?: SiteImageSource;
  dates?: PageDates;
};
