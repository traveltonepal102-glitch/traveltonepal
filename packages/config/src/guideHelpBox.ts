import type { SiteLanguage } from "./siteLanguage";

/**
 * The navy help box beside every travel guide: a local expert on WhatsApp or by email (two buttons with fixed
 * labels). Each guide can word it for its own topic in the guide editor's "Help box in the sidebar"; a field left
 * empty uses this wording.
 */
export type GuideHelpBox = {
  heading: string;
  text: string;
  /** How the visitor's WhatsApp message or email starts. */
  message: string;
};

export const DEFAULT_GUIDE_HELP_BOX: GuideHelpBox = {
  heading: "Not sure when to go?",
  text: "Tell us your holiday dates and we tell you honestly what to expect on the trail.",
  message: "Hello! I'm not sure when to trek. My holiday dates are: ",
};

const GERMAN_GUIDE_HELP_BOX: GuideHelpBox = {
  heading: "Unsicher, wann Sie reisen sollen?",
  text: "Nennen Sie uns Ihre Urlaubsdaten, und wir sagen Ihnen ehrlich, was Sie auf dem Trek erwartet.",
  message: "Hallo! Ich bin unsicher, wann ich trekken soll. Meine Urlaubsdaten sind: ",
};

/** The wording a field left empty uses, in the website's language. */
export const defaultGuideHelpBox = (language: SiteLanguage = "en"): GuideHelpBox =>
  language === "de" ? GERMAN_GUIDE_HELP_BOX : DEFAULT_GUIDE_HELP_BOX;

/** The longest each field may be (the database checks the same). */
export const GUIDE_HELP_BOX_LIMITS = { heading: 60, text: 200, message: 200 } as const;
