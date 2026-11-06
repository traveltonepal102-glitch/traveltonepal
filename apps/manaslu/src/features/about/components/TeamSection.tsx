import { SectionHeading } from "@/components/shared/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { TrailIcon } from "@/components/ui/TrailIcon";

import { ABOUT_SECTIONS } from "../sections";
import type { TeamMember } from "../types";

/** The people, each with a portrait, role and home. */
export const TeamSection = ({ team, heading }: { team: readonly TeamMember[]; heading: { title: string; text: string } }) => (
  <section id={ABOUT_SECTIONS.team} aria-labelledby="team-h" className="bg-stone py-14 md:py-18">
    <div className="wrap flex flex-col gap-8">
      <SectionHeading id="team-h" title={heading.title || "The people who plan and lead your trek"}>
        <p className="max-w-[72ch]">{heading.text || "Licensed guides who know these valleys, and a small office that answers your messages."}</p>
      </SectionHeading>
      <ul className="grid gap-4.5 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member) => (
          <li key={member.id} className="flex items-center gap-4 rounded-2xl border border-solid border-line bg-snow p-5">
            <span className="relative flex size-20 flex-none items-center justify-center overflow-hidden rounded-full bg-forest-tint text-forest/50">
              {member.photo ? <SiteImage image={member.photo} sizes="80px" className="object-cover" /> : <TrailIcon name="users" size={32} />}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-semibold text-ink">{member.name}</span>
              <span className="text-[15px] leading-5.5">{member.role}</span>
              {member.place && <span className="text-sm leading-5 text-muted">{member.place}</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>
);
