import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import type { SectionHeading, TeamMember } from "../../types";
import { SECTION, WRAP } from "../styles";
import { TeamCard } from "./TeamCard";
import { TeamExplorer } from "./TeamExplorer";

/** "Our guides and team": the office team and the guides (from Authors and Trekking guides), with a filter. */
export const TeamSection = ({ team, heading }: { team: readonly TeamMember[]; heading: SectionHeading }) => (
  <section id={ABOUT_SECTION_IDS.team} aria-labelledby="about-team-title" className={SECTION}>
    <div className={`${WRAP} flex flex-col gap-5.5`}>
      <TeamExplorer
        heading={
          <PageSectionHeading
            id="about-team-title"
            eyebrow="Our guides and team"
            title={heading.title || "The people who plan and lead your trek"}
            text={heading.text || "Licensed guides from each region, and a small Kathmandu office that answers your messages."}
          />
        }
        cards={team.map((member) => ({ id: member.id, group: member.group, card: <TeamCard member={member} /> }))}
      />
    </div>
  </section>
);
