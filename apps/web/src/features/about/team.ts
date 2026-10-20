import { GUIDES } from "@/features/team/guides";
import { OFFICE_TEAM } from "@/features/team/officeTeam";

export type TeamGroup = "office" | "guides";

/** One card in "Our guides and team". */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  place: string;
  languages: readonly string[];
  group: TeamGroup;
  photo?: { src: string; alt: string };
};

export const TEAM_GROUP_LABELS: Record<TeamGroup, string> = { office: "Office", guides: "Guide" };

/** The office team, then the guides (from the trek pages' guide list, so both pages show the same people). */
export const aboutTeam = (): TeamMember[] => [
  ...OFFICE_TEAM.map((member) => ({ ...member, group: "office" as const })),
  ...GUIDES.map((guide) => ({
    id: guide.id,
    name: guide.name,
    role: guide.role,
    place: guide.home,
    languages: guide.languages,
    group: "guides" as const,
    photo: guide.photo,
  })),
];
