/**
 * The rules of the "Save your changes before leaving?" question (useLeaveGuard, UnsavedChangesDialog), kept pure so
 * they can be tested.
 */

/**
 * The admin page a clicked link opens in this tab ("/treks?page=2"), or null when it doesn't leave this page: another
 * site (the browser asks by itself), or the same page and query (e.g. "#faq").
 */
export const leavingPath = (linkHref: string, currentHref: string): string | null => {
  const link = new URL(linkHref, currentHref);
  const current = new URL(currentHref);
  if (link.origin !== current.origin) return null;
  if (link.pathname === current.pathname && link.search === current.search) return null;
  return `${link.pathname}${link.search}${link.hash}`;
};

export type LeaveSaveChoice = {
  /** The dialog's save button, e.g. "Save as draft". */
  label: string;
  /** What saving does on the website. */
  note: string;
};

/**
 * The dialog's save button and its note, from the editor's Status picker (`status`, null for an editor without one,
 * e.g. regions and pages) and its own Save button's words (`saveLabel`, e.g. "Save changes" or "Publish").
 */
export const leaveSaveChoice = (status: string | null, saveLabel: string): LeaveSaveChoice => {
  if (status === "draft") {
    return { label: "Save as draft", note: "A draft is saved but not on the website. To show it there, set Status to Published and save." };
  }
  if (status === "hidden") {
    return { label: saveLabel, note: "It stays off the website. To show it there, set Status to Published and save." };
  }
  if (status === "published") {
    return { label: saveLabel, note: "It is published: saving puts your changes on the website straight away." };
  }
  return { label: saveLabel, note: `Your changes show on the website only after you ${saveLabel === "Publish" ? "publish" : "save"} them.` };
};
