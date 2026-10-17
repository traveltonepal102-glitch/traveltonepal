import type { TrekDifficulty } from "./types";

/** Difficulty levels in order, with their URL value and colors (chip and dot), from the design system. */
export const DIFFICULTIES: readonly { value: string; label: TrekDifficulty; chip: string; dot: string }[] = [
  { value: "easy", label: "Easy", chip: "bg-green-tint text-whatsapp", dot: "bg-whatsapp" },
  { value: "moderate", label: "Moderate", chip: "bg-brand-tint text-navy", dot: "bg-brand" },
  { value: "challenging", label: "Challenging", chip: "bg-saffron-tint text-saffron-ink", dot: "bg-saffron" },
  { value: "strenuous", label: "Strenuous", chip: "bg-danger-tint text-danger", dot: "bg-danger" },
];

export const difficultyStyle = (difficulty: TrekDifficulty) =>
  DIFFICULTIES.find((level) => level.label === difficulty) ?? DIFFICULTIES[0];
