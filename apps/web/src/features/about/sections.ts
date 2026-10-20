import { ABOUT_SECTION_IDS } from "@/lib/navigation";

export type AboutSectionLink = { id: string; label: string };

/** The About page's in-page menu, in page order. Reviews only when the page shows them. */
export const aboutSectionLinks = ({ hasReviews }: { hasReviews: boolean }): AboutSectionLink[] => [
  { id: ABOUT_SECTION_IDS.story, label: "Our story" },
  { id: ABOUT_SECTION_IDS.whyUs, label: "Why travel with us" },
  { id: ABOUT_SECTION_IDS.team, label: "Our team" },
  ...(hasReviews ? [{ id: ABOUT_SECTION_IDS.reviews, label: "Reviews" }] : []),
  { id: ABOUT_SECTION_IDS.licences, label: "Licences" },
  { id: ABOUT_SECTION_IDS.responsibleTravel, label: "Responsible travel" },
  { id: ABOUT_SECTION_IDS.visit, label: "Visit us" },
];
