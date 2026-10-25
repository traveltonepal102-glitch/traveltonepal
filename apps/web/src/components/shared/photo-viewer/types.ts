import type { SiteImageSource } from "@/lib/images";

/** A photo as the full-screen viewer shows it: a /public file or a library photo. */
export type ViewerPhoto = SiteImageSource & {
  /** Second line under the photo, e.g. "Kyanjin Gompa · 3,870 m / 12,697 ft". */
  caption?: string;
};
