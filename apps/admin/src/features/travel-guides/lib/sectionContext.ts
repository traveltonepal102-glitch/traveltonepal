import type { Photo } from "@/features/photos/types";

import type { ArticleOptions, MonthEntry } from "../types";

/** What the sections can pick from and share, passed down from the editor. */
export type SectionContext = {
  treks: ArticleOptions["treks"];
  guides: ArticleOptions["guides"];
  /** The photos the sections show (saved, and chosen in this editor), for their previews. */
  photos: Photo[];
  /** Keeps a photo chosen in a photo window, so its section can preview it. */
  addPhoto: (photo: Photo) => void;
  /** The guide's website region (null: the main site), to suggest its guides first. */
  region: { id: string; name: string } | null;
  /** The guide's 12 months, shared by its "Month by month" sections. */
  months: MonthEntry[];
  onMonthsChange: (months: MonthEntry[]) => void;
};
