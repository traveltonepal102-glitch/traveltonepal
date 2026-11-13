import type { HomeAdventures, HomeCompany, HomeGuide, HomeRating, HomeReview, HomeSeo, HomeTop, HomeTrek, HomeTrekCard } from "@/features/home/types";

/** A trek's own page: the same trek sections as the home page's, under the trek's own top. */
export type TrekPageData = {
  top: HomeTop;
  trek: HomeTrek;
  card: HomeTrekCard;
  /** The website's other treks, the main one first. */
  others: HomeTrekCard[];
  reviews: HomeReview[];
  rating: HomeRating | null;
  company: HomeCompany;
  adventures: HomeAdventures;
  guides: HomeGuide[];
  seo: HomeSeo;
  /** "Hide from Google" on the trek's Google card. */
  isHidden: boolean;
  /** The main version the Google card names, when it counts. */
  canonicalPath?: string;
};
