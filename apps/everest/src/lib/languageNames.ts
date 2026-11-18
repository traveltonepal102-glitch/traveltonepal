/**
 * Languages are typed in the admin as names (often in English: "English", "Japanese"), shared by every website. This
 * German website shows them in German; a name it doesn't know is shown as typed.
 */
const GERMAN_NAMES: Record<string, string> = {
  chinese: "Chinesisch",
  dutch: "Niederländisch",
  english: "Englisch",
  french: "Französisch",
  german: "Deutsch",
  hebrew: "Hebräisch",
  hindi: "Hindi",
  italian: "Italienisch",
  japanese: "Japanisch",
  korean: "Koreanisch",
  nepali: "Nepali",
  polish: "Polnisch",
  portuguese: "Portugiesisch",
  russian: "Russisch",
  sherpa: "Sherpa",
  spanish: "Spanisch",
  tibetan: "Tibetisch",
};

/** "Japanese" → "Japanisch"; "Gurung" (unknown) stays "Gurung". */
export const languageName = (name: string) => GERMAN_NAMES[name.trim().toLowerCase()] ?? name.trim();
