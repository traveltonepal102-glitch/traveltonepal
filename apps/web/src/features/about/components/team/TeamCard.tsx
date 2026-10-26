import { Icon } from "@ttn/ui/icon";

import { SiteImage } from "@/components/ui/SiteImage";

import type { TeamGroup, TeamMember } from "../../types";

const GROUP_LABELS: Record<TeamGroup, string> = { office: "Office", guides: "Guide" };

const PLACEHOLDER_TONES = {
  office: "from-[#fff1dc] to-month-possible",
  guides: "from-[#d3e3f1] to-chart-3",
} as const;

/** Photo (or a placeholder until there is one), group chip, name, role, home and languages. */
export const TeamCard = ({ member }: { member: TeamMember }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
    <div className={`relative flex aspect-4/3 items-center justify-center bg-linear-160 text-navy/35 ${PLACEHOLDER_TONES[member.group]}`}>
      {member.photo ? (
        <SiteImage image={member.photo} sizes="(min-width: 1024px) 290px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
      ) : (
        <Icon name="person" size={80} />
      )}
      <span className="absolute top-2.5 left-2.5 rounded-full bg-navy/85 px-2.5 py-0.75 text-[11px] font-bold text-white">
        {GROUP_LABELS[member.group]}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-1 px-4 pt-3.5 pb-4">
      <h3 className="text-[17px] font-bold">{member.name}</h3>
      <p className="text-caption font-bold text-brand">{member.role}</p>
      {member.place && (
        <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Icon name="location_on" size={14} className="text-subtle" />
          {member.place}
        </p>
      )}
      {member.languages.length > 0 && (
        <p className="mt-auto inline-flex items-center gap-1.5 border-t border-muted pt-2 text-xs text-text">
          <Icon name="translate" size={14} className="text-subtle" />
          <span className="sr-only">Languages: </span>
          {member.languages.join(", ")}
        </p>
      )}
    </div>
  </article>
);
