import { ABOUT_SECTION_IDS } from "@/lib/navigation";

export type AboutSectionLink = { id: string; label: string };

/** Which optional sections the page shows (a section with nothing in it is left out, and so is its link). */
export type AboutSectionsShown = { hasReviews: boolean; hasPromises: boolean; hasTeam: boolean };

/** The About page's in-page menu, in page order. */
export const aboutSectionLinks = ({ hasReviews, hasPromises, hasTeam }: AboutSectionsShown): AboutSectionLink[] => [
  { id: ABOUT_SECTION_IDS.story, label: "Our story" },
  ...(hasPromises ? [{ id: ABOUT_SECTION_IDS.whyUs, label: "Why travel with us" }] : []),
  ...(hasTeam ? [{ id: ABOUT_SECTION_IDS.team, label: "Our team" }] : []),
  ...(hasReviews ? [{ id: ABOUT_SECTION_IDS.reviews, label: "Reviews" }] : []),
  { id: ABOUT_SECTION_IDS.licences, label: "Licences" },
  { id: ABOUT_SECTION_IDS.responsibleTravel, label: "Responsible travel" },
  { id: ABOUT_SECTION_IDS.visit, label: "Visit us" },
];
