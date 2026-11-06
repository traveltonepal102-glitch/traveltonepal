import { coverImage } from "@ttn/site-data/images";
import type { WebAdventureRow, WebAdventureSectionRow, WebSitePageRow } from "@ttn/site-data/database.types";
import { readPoints } from "@ttn/site-data/trekPageJson";

import type { HomeAdventures, HomeCompany } from "./types";

const textOf = (content: unknown, key: string) => {
  const value = content && typeof content === "object" && key in content ? (content as Record<string, unknown>)[key] : "";
  return typeof value === "string" ? value.trim() : "";
};

/** What every trek says about the company, from Pages › About: the founder's short story and the promises. */
export const toHomeCompany = (about: WebSitePageRow | null, photosBaseUrl: string): HomeCompany => {
  const name = about?.founder_name?.trim();
  const photoId = about?.founder_photo_id;
  const widths = about?.founder_photo_variant_widths;
  const content = about?.content;
  const promises = content && typeof content === "object" && "promises" in content ? content.promises : [];

  return {
    storyTeaser: textOf(content, "storyTeaser"),
    founder: name
      ? {
          name,
          role: about?.founder_role?.trim() ?? "",
          // A portrait beside the name, so it needs no image text of its own.
          photo: photoId && widths?.length ? { src: `${photosBaseUrl}/${photoId}`, alt: "", variantWidths: widths, fileName: about?.founder_photo_file_name || undefined } : undefined,
        }
      : null,
    promises: readPoints(promises),
  };
};

/** The section's words from the admin (blank ones take this design's) and its cards in the admin's order; a card needs a photo. */
export const toHomeAdventures = (section: WebAdventureSectionRow | null, rows: readonly WebAdventureRow[], photosBaseUrl: string): HomeAdventures => ({
  eyebrow: section?.eyebrow.trim() || "Beyond the trail",
  heading: section?.heading.trim() || "More to do in Nepal",
  intro: section?.intro.trim() ?? "",
  askTitle: section?.ask_title.trim() || "Have your own idea?",
  askText: section?.ask_text.trim() || "Tell us what you would like to do and we plan it with you.",
  cards: rows
    .toSorted((a, b) => a.position - b.position)
    .flatMap((row) => {
      const photo = coverImage(row, photosBaseUrl, row.title, row.photo_alt);
      return photo ? [{ id: row.id, title: row.title.trim(), summary: row.summary.trim(), photo }] : [];
    }),
});
