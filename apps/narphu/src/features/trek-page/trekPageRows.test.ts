import type { WebTrekPageRow, WebTrekRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import { toTrekSeo, toTrekTop } from "./trekPageRows";

const summary = { name: "Nar Phu Trek", summary: " Two hidden villages. ", cover_id: "cover", published_at: "2026-10-23T00:00:00Z", updated_at: "2026-11-03T00:00:00Z" } as WebTrekRow;
const page = { headline: "", seo_title: "", seo_description: "", share_id: null } as unknown as WebTrekPageRow;

describe("toTrekTop", () => {
  it("uses the headline, else the name", () => {
    expect(toTrekTop(summary, page).heading).toBe("Nar Phu Trek");
    expect(toTrekTop(summary, { ...page, headline: "Nar Phu in 10 days" }).heading).toBe("Nar Phu in 10 days");
    expect(toTrekTop(summary, page).intro).toBe("Two hidden villages.");
  });
});

describe("toTrekSeo", () => {
  it("falls back to the trek's name, summary and cover", () => {
    const seo = toTrekSeo(summary, page, "https://photos", true);
    expect(seo.title).toBe("Nar Phu Trek");
    expect(seo.description).toBe("Two hidden villages.");
    expect(seo.shareImageBase).toContain("https://photos/cover");
  });

  it("falls back to the website's share picture without a cover", () => {
    expect(toTrekSeo({ ...summary, cover_id: null }, page, "https://photos", true, "https://site/share.jpg").shareImageBase).toBe("https://site/share.jpg");
  });

  it("prefers what the Google card says", () => {
    const seo = toTrekSeo(summary, { ...page, seo_title: "Title", seo_description: "Text", share_id: "chosen" }, "https://photos", false);
    expect(seo).toMatchObject({ title: "Title", description: "Text", isLive: false });
    expect(seo.shareImageBase).toContain("https://photos/chosen");
  });
});
