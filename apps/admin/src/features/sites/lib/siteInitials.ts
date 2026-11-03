/**
 * The letters on a site's tile in "Working on": the first letter of each word, up to three ("Travel To Nepal" →
 * "TTN", "Manaslu Trek" → "MT"), or the first two letters of a one-word name ("Everest" → "EV").
 */
export const siteInitials = (name: string): string => {
  const words = name.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 3)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};
