import type { ArticleSection } from "../types";

/** The library photos the guide's "Photo" and "Photo gallery" sections show, each once: the editor loads them for its previews. */
export const sectionPhotoIds = (sections: readonly ArticleSection[]) => [
  ...new Set(sections.flatMap((section) => (section.type === "image" ? (section.photoId ? [section.photoId] : []) : section.type === "gallery" ? section.photoIds : []))),
];
