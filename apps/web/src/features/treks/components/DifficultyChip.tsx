import { difficultyStyle } from "../difficulty";
import type { TrekDifficulty } from "../types";

/** Colored difficulty label: green easy, blue moderate, saffron challenging, red strenuous. */
export const DifficultyChip = ({ difficulty }: { difficulty: TrekDifficulty }) => (
  <span
    className={`inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-xs font-bold ${difficultyStyle(difficulty).chip}`}
  >
    <span className="sr-only">Difficulty: </span>
    {difficulty}
  </span>
);
