import type { SiteImageSource } from "@ttn/site-data/images";

/** A menu item with a list under it ("Other treks", "Blogs"): the desktop dropdown and the phone menu show the same one. */
export type NavMenu = {
  label: string;
  items: readonly { href: string; title: string; text?: string; image?: SiteImageSource }[];
  /** The last link, under the list. */
  more: { href: string; label: string };
  /** A small title above the list, saying what it is. */
  heading?: string;
};
