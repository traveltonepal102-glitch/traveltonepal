import type { Author } from "@/features/authors/types";
import type { TrekkingGuide } from "@/features/trekking-guides/types";

import type { AboutTeamPerson } from "../types";

type Links = { authorHref: (id: string) => string; guideHref: (id: string) => string };

/** Why someone is or isn't on the About page (the same rule as the website's web_about_team view). */
const noteFor = (isOn: boolean, hasConsent: boolean, role: string) => {
  if (!isOn) return "Hidden: “Show on the About page” is off";
  if (!hasConsent) return "Hidden: no consent yet to show their photo and name";
  return role || "Shown";
};

/** The About editor's read-only team list: office authors, then trekking guides, A–Z. */
export const aboutTeamPeople = (authors: readonly Author[], guides: readonly TrekkingGuide[], links: Links): AboutTeamPerson[] => [
  ...authors
    .filter((author) => author.kind === "office")
    .map((author) => ({
      id: author.id,
      name: author.name,
      role: author.jobTitle,
      group: "office" as const,
      isShown: author.showOnAbout && author.photoConsent,
      note: noteFor(author.showOnAbout, author.photoConsent, author.jobTitle),
      href: links.authorHref(author.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name)),
  ...guides
    .map((guide) => ({
      id: guide.id,
      name: guide.name,
      role: guide.role,
      group: "guides" as const,
      isShown: guide.showOnAbout && guide.photoConsent,
      note: noteFor(guide.showOnAbout, guide.photoConsent, guide.role),
      href: links.guideHref(guide.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name)),
];
