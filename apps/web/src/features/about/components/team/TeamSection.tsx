import { PageSectionHeading } from "@/components/shared/PageSectionHeading";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";

import { aboutTeam } from "../../team";
import { SECTION, WRAP } from "../styles";
import { TeamCard } from "./TeamCard";
import { TeamExplorer } from "./TeamExplorer";

/** "Our guides and team": the office team and the guides, with a filter. */
export const TeamSection = () => (
  <section id={ABOUT_SECTION_IDS.team} aria-labelledby="about-team-title" className={SECTION}>
    <div className={`${WRAP} flex flex-col gap-5.5`}>
      <TeamExplorer
        heading={
          <PageSectionHeading
            id="about-team-title"
            eyebrow="Our guides and team"
            title="The people who plan and lead your trek"
            text="Licensed guides from each region, and a small Kathmandu office that answers your messages."
          />
        }
        cards={aboutTeam().map((member) => ({ id: member.id, group: member.group, card: <TeamCard member={member} /> }))}
      />
    </div>
  </section>
);
