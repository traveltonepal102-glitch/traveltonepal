import { describe, expect, it } from "vitest";

import { summarizeContactClicks } from "./contactClicks";

describe("summarizeContactClicks", () => {
  it("adds up each channel and each page, most clicked page first", () => {
    const summary = summarizeContactClicks([
      { channel: "whatsapp", page_path: "/treks/langtang-valley", clicks: 5 },
      { channel: "email", page_path: "/treks/langtang-valley", clicks: 2 },
      { channel: "whatsapp", page_path: "/", clicks: 9 },
      { channel: "email", page_path: "", clicks: 1 },
    ]);
    expect(summary).toMatchObject({ whatsapp: 14, email: 3 });
    expect(summary.pages.map((page) => [page.path, page.total])).toEqual([
      ["/", 9],
      ["/treks/langtang-valley", 7],
      ["", 1],
    ]);
    expect(summary.pages[1]).toMatchObject({ whatsapp: 5, email: 2 });
  });

  it("is empty without clicks", () => {
    expect(summarizeContactClicks([])).toEqual({ whatsapp: 0, email: 0, pages: [] });
  });
});
