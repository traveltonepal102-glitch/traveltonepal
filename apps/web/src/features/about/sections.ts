import type { PageSectionLink } from "@/components/shared/PageSectionNav";
import { ABOUT_SECTION_IDS } from "@/lib/navigation";


/** The About page's in-page menu, in page order (design: About.dc.html); the team only while someone is shown. */
export const aboutSectionLinks = ({ hasTeam }: { hasTeam: boolean }): PageSectionLink[] => [
  { id: ABOUT_SECTION_IDS.whyUs, label: "Why travel with us" },
  { id: ABOUT_SECTION_IDS.story, label: "Our story" },
  ...(hasTeam ? [{ id: ABOUT_SECTION_IDS.team, label: "Our team" }] : []),
  { id: ABOUT_SECTION_IDS.licences, label: "Licences" },
  { id: ABOUT_SECTION_IDS.responsibleTravel, label: "Responsible travel" },
  { id: ABOUT_SECTION_IDS.visit, label: "Visit us" },
];
