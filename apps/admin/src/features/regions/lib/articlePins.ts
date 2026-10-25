import { MAX_PINNED_ARTICLES } from "../constants";

/** Pins or unpins a travel guide. A new pin goes last; once the pins are full, another pin is ignored. */
export const togglePin = (pinnedIds: readonly string[], articleId: string): string[] => {
  if (pinnedIds.includes(articleId)) return pinnedIds.filter((id) => id !== articleId);
  return pinnedIds.length < MAX_PINNED_ARTICLES ? [...pinnedIds, articleId] : [...pinnedIds];
};

/** The saved pins still in the list (a guide unticked from the region since loses its pin), in order. */
export const listedPins = (pinnedIds: readonly string[], articleIds: readonly string[]) => pinnedIds.filter((id) => articleIds.includes(id));
