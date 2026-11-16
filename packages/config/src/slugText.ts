/**
 * Web addresses and anchors use plain letters. German letters are spelled the German way before the rest is
 * simplified ("Über den Thorong La" → "ueber-den-thorong-la", "Fußweg" → "fussweg"), not split by Unicode
 * normalisation ("u-ber").
 */
const GERMAN_LETTERS: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", Ä: "Ae", Ö: "Oe", Ü: "Ue", ß: "ss", ẞ: "SS" };

export const spellGermanLetters = (text: string) => text.replace(/[äöüÄÖÜßẞ]/g, (letter) => GERMAN_LETTERS[letter] ?? letter);

/** Lowercase letters and digits joined by single dashes, accents removed; "" when nothing is left. */
export const toSlugText = (text: string) =>
  spellGermanLetters(text)
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
