import type { TrekkingGuide } from "@/features/trekking-guides/types";

import type { AuthorGuide } from "../types";

/** A trekking guide as the author form offers them, A–Z as listed. */
export const toAuthorGuide = (guide: TrekkingGuide): AuthorGuide => ({
  id: guide.id,
  name: guide.name,
  photo: guide.photo,
  bio: guide.bio,
  hasConsent: guide.photoConsent,
});
