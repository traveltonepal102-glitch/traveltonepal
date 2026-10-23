import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import type { ReadySectionKey, SectionReadiness, SectionStatus } from "../../lib/readiness";
import { REGION_SECTIONS } from "../../sections";
import type { RegionSectionKey } from "../../types";

type RegionSectionNavProps = {
  activeKey: RegionSectionKey;
  onSelect: (key: RegionSectionKey) => void;
  readiness: Record<ReadySectionKey, SectionReadiness>;
  /** Sections with a field that failed the last save. */
  errorKeys: Set<RegionSectionKey>;
};

const STATUS: Record<SectionStatus | "error" | "later", { icon: IconName; label: string; className: string }> = {
  done: { icon: "check_circle", label: "Done", className: "text-whatsapp" },
  warn: { icon: "warning", label: "Needs attention", className: "text-saffron-deep" },
  todo: { icon: "radio_button_unchecked", label: "To do", className: "text-subtle" },
  error: { icon: "error", label: "Has errors", className: "text-danger" },
  later: { icon: "schedule", label: "Coming later", className: "text-subtle" },
};

const isReadyKey = (key: RegionSectionKey, readiness: RegionSectionNavProps["readiness"]): key is ReadySectionKey =>
  key in readiness;

/** The editor's section list with each section's status (design: .ad-te-nav). A row of chips on narrow screens. */
export const RegionSectionNav = ({ activeKey, onSelect, readiness, errorKeys }: RegionSectionNavProps) => {
  const ready = Object.values(readiness);
  const doneCount = ready.filter((section) => section.status === "done").length;

  return (
    <nav
      aria-label="Region sections"
      className="flex flex-col gap-0.5 desktop:sticky desktop:top-38 max-desktop:flex-row max-desktop:gap-1.5 max-desktop:overflow-x-auto max-desktop:pb-1"
    >
      <div className="mb-2.5 flex flex-col gap-2 rounded-lg border border-solid border-border bg-surface p-3.5 max-desktop:hidden">
        <div className="flex items-baseline justify-between">
          <span className="font-bold text-ink">Region page ready</span>
          <span className="text-caption font-bold text-whatsapp">
            {doneCount} of {ready.length} ready
          </span>
        </div>
        <span className="block h-2 overflow-hidden rounded-full bg-muted">
          <span className="block h-full rounded-full bg-whatsapp" style={{ width: `${(doneCount / ready.length) * 100}%` }} />
        </span>
      </div>

      {REGION_SECTIONS.map((section) => {
        const isActive = section.key === activeKey;
        const sectionReadiness = isReadyKey(section.key, readiness) ? readiness[section.key] : undefined;
        const statusKey = errorKeys.has(section.key) ? "error" : (sectionReadiness?.status ?? "later");
        const status = STATUS[statusKey];
        const note = sectionReadiness?.note ?? `Waits for ${section.waitsFor}`;

        return (
          <button
            key={section.key}
            type="button"
            onClick={() => onSelect(section.key)}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "m-0 flex w-full cursor-pointer items-center gap-2.5 rounded-md border border-solid px-2.5 py-2 text-left font-sans text-text focus-visible:outline-2 focus-visible:outline-ring max-desktop:w-auto max-desktop:flex-none max-desktop:bg-surface",
              isActive ? "border-border bg-surface shadow-card" : "border-transparent hover:bg-surface max-desktop:border-border",
            )}
          >
            <span
              className={cn(
                "inline-flex size-8 flex-none items-center justify-center rounded-[9px]",
                isActive ? "bg-brand text-on-brand" : "bg-brand-tint text-brand",
              )}
            >
              <Icon name={section.icon} size={18} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-body-sm font-bold whitespace-nowrap">{section.label}</span>
              <span className={cn("block truncate text-xs max-desktop:hidden", statusKey === "warn" ? "text-saffron-deep" : "text-muted-foreground")}>
                {note}
              </span>
            </span>
            <Icon name={status.icon} size={18} label={status.label} className={cn("flex-none", status.className)} />
          </button>
        );
      })}
    </nav>
  );
};
