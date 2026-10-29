"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { TREK_SHORTCUTS } from "../../filters";
import type { TrekShortcut } from "../../filters";

type ShortcutBarProps = {
  active: TrekShortcut | null;
  onPick: (shortcut: TrekShortcut | null) => void;
};

const OPTIONS: readonly { value: TrekShortcut | null; label: string; icon: IconName }[] = [
  { value: null, label: "All treks", icon: "hiking" },
  ...TREK_SHORTCUTS,
];

/** Quick one-tap shortcuts above the results; one at a time. Scrolls sideways on small screens. */
export const ShortcutBar = ({ active, onPick }: ShortcutBarProps) => (
  <div className="border-b border-line bg-surface">
    <div
      role="group"
      aria-label="Quick filters"
      className="mx-auto flex max-w-content gap-2 relative overflow-x-auto px-4 py-3.5 scrollbar-none md:px-6 [&::-webkit-scrollbar]:hidden"
    >
      {OPTIONS.map((option) => {
        const isActive = option.value === active;
        return (
          <button
            key={option.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onPick(option.value)}
            className={`inline-flex min-h-9.5 flex-none cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-caption font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              isActive ? "border-navy bg-navy text-white" : "border-line-strong bg-surface text-text hover:border-brand"
            }`}
          >
            <Icon name={option.icon} size={16} />
            {option.label}
          </button>
        );
      })}
    </div>
  </div>
);
