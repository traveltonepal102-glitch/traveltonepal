import { pagePath } from "@/features/pages/constants";

/**
 * A region website's Home (decided 2026-11-04): its main trek, the top of the page and the Google result. The page
 * shows the main trek's sections; the main site's Home stays in the list pages' editor.
 */
export const REGION_HOME_PATH = pagePath("home");

/** The Home top's own fields (the H1 uses the pages' limit; the intro is shorter, as in a travel guide). */
export const HOME_TOP_LIMITS = { photoAlt: 160, buttonLabel: 40, intro: 300 } as const;
