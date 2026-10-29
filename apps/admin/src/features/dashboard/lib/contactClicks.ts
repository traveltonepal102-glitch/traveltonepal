export type ContactChannel = "whatsapp" | "email";

/** A row of contact_click_totals: one channel on one page. */
type ContactClickRow = { channel: ContactChannel; page_path: string; clicks: number };

/** The WhatsApp and email clicks of a period: the totals, and the pages they came from (most first). */
export type ContactClicksSummary = {
  whatsapp: number;
  email: number;
  pages: { path: string; whatsapp: number; email: number; total: number }[];
};

/** How many pages the card lists. */
export const TOP_PAGES = 8;

/** Sums the rows per channel and per page ("" is shown as an unknown page). */
export const summarizeContactClicks = (rows: readonly ContactClickRow[]): ContactClicksSummary => {
  const pages = new Map<string, { path: string; whatsapp: number; email: number; total: number }>();
  for (const row of rows) {
    const page = pages.get(row.page_path) ?? { path: row.page_path, whatsapp: 0, email: 0, total: 0 };
    page[row.channel] += row.clicks;
    page.total += row.clicks;
    pages.set(row.page_path, page);
  }
  const all = [...pages.values()];
  return {
    whatsapp: all.reduce((sum, page) => sum + page.whatsapp, 0),
    email: all.reduce((sum, page) => sum + page.email, 0),
    pages: all.sort((a, b) => b.total - a.total || a.path.localeCompare(b.path)).slice(0, TOP_PAGES),
  };
};
