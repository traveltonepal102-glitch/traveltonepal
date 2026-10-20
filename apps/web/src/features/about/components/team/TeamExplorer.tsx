"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import type { TeamGroup } from "../../team";
import { FOCUS } from "../styles";

type TeamFilter = "all" | TeamGroup;

const FILTERS: readonly { value: TeamFilter; label: string }[] = [
  { value: "all", label: "Everyone" },
  { value: "office", label: "Office team" },
  { value: "guides", label: "Guides" },
];

type TeamExplorerProps = {
  heading: ReactNode;
  /** Server-rendered cards with their group; this only picks which to show. */
  cards: readonly { id: string; group: TeamGroup; card: ReactNode }[];
};

/** Heading with Everyone / Office team / Guides buttons, and the matching team cards. */
export const TeamExplorer = ({ heading, cards }: TeamExplorerProps) => {
  const [filter, setFilter] = useState<TeamFilter>("all");
  const shown = cards.filter((item) => filter === "all" || item.group === filter);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        {heading}
        <div role="group" aria-label="Show team members" className="flex flex-wrap gap-1.5">
          {FILTERS.map((option) => {
            const isActive = option.value === filter;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setFilter(option.value)}
                className={`min-h-9.5 cursor-pointer rounded-full border px-3.5 text-caption font-bold transition-colors ${FOCUS} ${
                  isActive ? "border-navy bg-navy text-white" : "border-line-strong bg-surface text-text hover:border-brand"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-4">
        {shown.map((item) => (
          <li key={item.id}>{item.card}</li>
        ))}
      </ul>
    </>
  );
};
