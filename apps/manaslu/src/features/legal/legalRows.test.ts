import type { WebSitePageRow } from "@ttn/site-data/database.types";
import { describe, expect, it } from "vitest";

import type { SiteSettings } from "@/features/site-settings/types";

import { toLegalDoc } from "./legalRows";

const text = (value: string) => ({ type: "paragraph", content: [{ type: "text", text: value }] });
const heading = (value: string) => ({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: value }] });

const settings = { legalName: "Nikhil Tours", legalForm: "Pvt. Ltd.", officeAddress: "", email: "hello@example.com", phoneDisplay: "", tourismRegistration: "123", licence: "", panNumber: "456" } as SiteSettings;

const row = (body: unknown[], overrides: Partial<WebSitePageRow> = {}) =>
  ({ heading: " Terms ", intro: " Our terms. ", seo_title: "", seo_description: "", published_at: "2026-10-01T00:00:00Z", updated_at: "2026-10-05T00:00:00Z", content: { body: { type: "doc", content: body }, lawyerChecked: false, lastUpdated: "2026-10-20" }, ...overrides }) as unknown as WebSitePageRow;

describe("a legal page", () => {
  it("fills the company's details from Settings, showing a gap for a blank one", () => {
    const doc = toLegalDoc("terms", row([text("{company}, {address}, {email}")]), settings);
    expect(JSON.stringify(doc.lead)).toContain("Nikhil Tours Pvt. Ltd., [OFFICE ADDRESS], hello@example.com");
  });

  it("numbers nothing itself but splits sections with unique anchors", () => {
    const { lead, sections } = toLegalDoc("terms", row([text("Before"), heading("If you cancel"), text("A"), heading("If you cancel"), text("B")]), settings);
    expect(lead).toHaveLength(1);
    expect(sections.map((section) => section.id)).toEqual(["if-you-cancel", "if-you-cancel-2"]);
  });

  it("lists only the registers typed in Settings", () => {
    const body = JSON.stringify(toLegalDoc("impressum", row([text("{registers}")]), settings).lead);
    expect(body).toContain("123");
    expect(body).toContain("456");
    expect(body).not.toContain("tourism licence");
  });

  it("leaves the registers out when none is typed", () => {
    expect(toLegalDoc("impressum", row([text("{registers}")]), { ...settings, tourismRegistration: "", panNumber: "" }).lead).toEqual([]);
  });

  it("lists only what this website loads in the cookie table", () => {
    const table = JSON.stringify(toLegalDoc("cookies", row([text("{cookieTable}")]), settings).lead);
    expect(table).toContain("Google Maps");
    expect(table).not.toContain("Analytics");
    expect(table).not.toContain("YouTube");
  });

  it("dates the page by its Last updated day, and falls back to the page's words for Google", () => {
    const doc = toLegalDoc("terms", row([]), settings);
    expect(doc.updated).toBe("20 October 2026");
    expect(doc.dates?.modified).toBe("2026-10-20");
    expect(doc.seo).toEqual({ title: "Terms", description: "Our terms." });
  });

  it("uses the Google result when one is typed", () => {
    expect(toLegalDoc("terms", row([], { seo_title: "Booking terms" }), settings).seo.title).toBe("Booking terms");
  });

  it("reminds the owner only while no lawyer has checked it, and survives unreadable content", () => {
    expect(toLegalDoc("terms", row([]), settings).ownerNote).toBeTruthy();
    const checked = row([], { content: { body: { type: "doc", content: [] }, lawyerChecked: true } });
    expect(toLegalDoc("terms", checked, settings).ownerNote).toBeUndefined();
    expect(toLegalDoc("terms", row([], { content: "broken" }), settings).sections).toEqual([]);
  });
});
