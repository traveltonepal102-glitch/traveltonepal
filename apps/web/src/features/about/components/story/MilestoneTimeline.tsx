import { Icon } from "@ttn/ui/icon";

import { ICON_TONES } from "@/components/shared/iconTones";

import type { Milestone } from "../../aboutContent";

/** Year-by-year milestones in a row (two columns on tablets, one on phones), joined by a line. */
export const MilestoneTimeline = ({ milestones }: { milestones: readonly Milestone[] }) => (
  <ol aria-label="Our milestones" className="grid gap-6 rounded-2xl border border-line bg-surface p-5 shadow-card sm:grid-cols-2 md:p-6 lg:grid-cols-4 lg:gap-0">
    {milestones.map((milestone) => (
      <li key={milestone.title} className="flex flex-col gap-1.5 lg:pr-4.5">
        <span className="flex items-center gap-2.5">
          <span aria-hidden="true" className={`inline-flex size-9 flex-none items-center justify-center rounded-full ${ICON_TONES[milestone.tone]}`}>
            <Icon name={milestone.icon} size={20} />
          </span>
          <span aria-hidden="true" className="h-0.5 flex-1 bg-line" />
        </span>
        <span className="font-display text-xl font-extrabold text-brand">{milestone.year}</span>
        <span className="font-bold text-ink">{milestone.title}</span>
        <span className="text-caption font-normal text-text">{milestone.text}</span>
      </li>
    ))}
  </ol>
);
