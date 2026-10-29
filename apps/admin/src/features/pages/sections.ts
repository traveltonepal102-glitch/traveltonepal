import { createSectionErrorLookup } from "@/components/editor/sectionErrors";
import type { EditorSection } from "@/components/editor/types";

import { LEGAL_PAGES, LIST_PAGES } from "./constants";
import type { LegalPageSlug, ListPageSlug } from "./constants";

export type AboutSectionKey = "top" | "listen" | "honest" | "flexible" | "openMind" | "safety" | "story" | "team" | "licences" | "promises" | "seo";
export type ContactSectionKey = "top" | "ways" | "steps" | "office" | "faq" | "seo";

/** The About editor's sections, top to bottom as on the page (design: About.dc.html), then what only trek pages show. */
export const ABOUT_SECTIONS: EditorSection<AboutSectionKey>[] = [
  { key: "top", label: "Top of the page", icon: "description", description: "The photo, the big heading, the text under it, the four numbers and the line under the four beliefs." },
  { key: "listen", label: "01 · We listen first", icon: "chat", description: "Its card at the top, then its section: the text, the quote and the three steps (listen, understand, suggest)." },
  { key: "honest", label: "02 · Honest and proactive", icon: "verified", description: "Its card at the top, then its section: the text, the quote, four pieces of advice and when we tell you." },
  { key: "flexible", label: "03 · Private and flexible", icon: "tune", description: "Its card at the top, then its section: the text, the quote, the photo, how the trek stays flexible and where it stops." },
  { key: "openMind", label: "04 · An open mind", icon: "landscape", description: "Its card at the top, then its section: the text, three villages with photos, how we invite you in and the quote." },
  { key: "safety", label: "Safety above all", icon: "health_and_safety", description: "The band after the four beliefs: the one rule, and three facts." },
  { key: "story", label: "Our story", icon: "notes", description: "The founder with his photo, why he started the company, three goals and “Our voice”." },
  { key: "team", label: "Our guides and team", icon: "groups", description: "The Kathmandu office team and the trekking guides." },
  { key: "licences", label: "Licences and legal", icon: "workspace_premium", description: "Registration numbers and the two certificates, from Site settings." },
  { key: "promises", label: "Trek page promises", icon: "hiking", description: "Not on the About page: the six promises of every trek page’s “Why book your trek with us”." },
  { key: "seo", label: "Google search result", icon: "search", description: "How the About page looks in Google. Not shown on the page itself." },
];

/** The Contact editor's sections, top to bottom as on the page (design: Admin-pages, "Contact"). */
export const CONTACT_SECTIONS: EditorSection<ContactSectionKey>[] = [
  { key: "top", label: "Top of the page", icon: "description", description: "The green line, the big heading and the text under it." },
  { key: "ways", label: "Ways to reach us", icon: "chat", description: "The reply times on the WhatsApp and email boxes." },
  { key: "steps", label: "What happens next", icon: "format_list_numbered", description: "The numbered steps from first message to booking." },
  { key: "office", label: "Time difference", icon: "public", description: "The table with your office hours in your visitors’ time, and directions to the office." },
  { key: "faq", label: "Before you get in touch", icon: "quiz", description: "Questions people ask before they write." },
  { key: "seo", label: "Google search result", icon: "search", description: "How the Contact page looks in Google. Not shown on the page itself." },
];

/** The list editor's sections: one per list page (design: Admin-pages, "List pages"). */
export const LIST_SECTIONS: EditorSection<ListPageSlug>[] = LIST_PAGES.map((page) => ({
  key: page.slug,
  label: page.label,
  icon: page.icon,
  description: "Only the text at the top and the Google result. The list itself fills from your content.",
}));

/** A list page's fields start with its slug ("treks.heading"), so its errors belong to its section. */
export const listSectionErrors = createSectionErrorLookup<ListPageSlug>(
  LIST_SECTIONS,
  Object.fromEntries(LIST_PAGES.map((page) => [page.slug, page.slug])),
);

/** The legal editor's sections: one per legal page (design: Admin-pages, "Legal pages"). */
export const LEGAL_SECTIONS: EditorSection<LegalPageSlug>[] = LEGAL_PAGES.map((page) => ({
  key: page.slug,
  label: page.label,
  icon: page.icon,
  description: `Shown at ${page.websitePath}. Write or paste the whole text in one editor: each numbered section heading starts a section.`,
}));

/** A legal page's fields start with its slug ("terms.body"), so its errors belong to its section. */
export const legalSectionErrors = createSectionErrorLookup<LegalPageSlug>(
  LEGAL_SECTIONS,
  Object.fromEntries(LEGAL_PAGES.map((page) => [page.slug, page.slug])),
);

const SEO_FIELDS = { seoKeyword: "seo", seoTitle: "seo", seoDescription: "seo", sharePhotoId: "seo", canonicalPath: "seo" } as const;

export const aboutSectionErrors = createSectionErrorLookup<AboutSectionKey>(ABOUT_SECTIONS, {
  eyebrow: "top",
  heading: "top",
  intro: "top",
  photoId: "top",
  trekkersGuided: "top",
  statValue: "top",
  statLabel: "top",
  safetyLead: "top",
  safetyText: "top",
  listen: "listen",
  honest: "honest",
  flexible: "flexible",
  openMind: "openMind",
  safety: "safety",
  storyHeading: "story",
  storyText: "story",
  storyTeaser: "story",
  quote: "story",
  founderAuthorId: "story",
  founderOrigin: "story",
  goals: "story",
  voiceEyebrow: "story",
  voiceHeading: "story",
  voiceText: "story",
  photoIds: "story",
  promises: "promises",
  teamHeading: "team",
  teamIntro: "team",
  licencesHeading: "licences",
  licencesIntro: "licences",
  ...SEO_FIELDS,
});

export const contactSectionErrors = createSectionErrorLookup<ContactSectionKey>(CONTACT_SECTIONS, {
  eyebrow: "top",
  heading: "top",
  intro: "top",
  photoId: "top",
  replyWhatsApp: "ways",
  replyEmail: "ways",
  nextSteps: "steps",
  officeDirections: "office",
  timeZones: "office",
  timeNote: "office",
  faqHeading: "faq",
  faqs: "faq",
  ...SEO_FIELDS,
});
