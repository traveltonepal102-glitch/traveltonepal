import type { EditorSaveState } from "@/components/editor/types";

import { getCurrentSite } from "./currentSite";

/**
 * A form saves into the site it was opened for (bound by its page). When "Working on" changed since (another tab),
 * the save is refused instead of writing into the wrong site.
 */
export const checkCurrentSite = async (siteId: string): Promise<EditorSaveState | null> => {
  const current = await getCurrentSite();
  if (current?.id === siteId) return null;
  return {
    status: "error",
    message: "“Working on” changed to another site since this page opened. Reload the page, check the site, then save again.",
    fieldErrors: {},
  };
};
