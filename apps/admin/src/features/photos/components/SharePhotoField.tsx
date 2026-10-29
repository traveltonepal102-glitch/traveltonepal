"use client";

import type { Photo } from "../types";
import { LibraryPhotoField } from "./LibraryPhotoField";

type SharePhotoFieldProps = {
  initial: Photo | null;
  /** What the website shows with no photo chosen, e.g. "the trek's first photo". */
  fallback: string;
  /** Sent as this form field (lists of pages: one per page). */
  name?: string;
  onEdit: () => void;
};

/**
 * The photo of the card WhatsApp, Facebook, LinkedIn and X show for a shared link (Open Graph), in a Google card.
 * The website sends the photo's 1200×630 share picture; the library loads when the window opens.
 */
export const SharePhotoField = ({ initial, fallback, name = "sharePhotoId", onEdit }: SharePhotoFieldProps) => (
  <LibraryPhotoField
    name={name}
    label="Photo when the link is shared"
    hint="Shown on WhatsApp, Facebook, LinkedIn and X, cut to a wide picture (1200 × 630). Keep the subject near the middle."
    emptyText={`No photo chosen: ${fallback}.`}
    initial={initial}
    onEdit={onEdit}
  />
);
