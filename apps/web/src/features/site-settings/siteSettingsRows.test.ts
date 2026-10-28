import { describe, expect, it } from "vitest";

import { PHOTOS_BASE_URL, SITE_SETTINGS, SITE_SETTINGS_ROW } from "./siteSettings.testData";
import { toSiteSettings } from "./siteSettingsRows";

describe("toSiteSettings", () => {
  it("builds the phone number for display and for WhatsApp links", () => {
    expect(SITE_SETTINGS.contact.phoneDisplay).toBe("+977 9843197197");
    expect(SITE_SETTINGS.contact.phoneDigits).toBe("9779843197197");
  });

  it("reads the office hours and writes them out for visitors", () => {
    expect(SITE_SETTINGS.schedule.opens).toEqual({ hour: 9, minute: 0 });
    expect(SITE_SETTINGS.contact.officeHours).toBe("Sunday to Friday, 9:00–18:00 (Nepal time)");
  });

  it("keeps only secure social links", () => {
    expect(SITE_SETTINGS.social).toEqual([
      { network: "facebook", label: "Facebook", url: "https://facebook.com/traveltonepal" },
      { network: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/company/traveltonepal" },
      { network: "google", label: "Google", url: "https://g.page/traveltonepal" },
    ]);
  });

  it("gives the Google review links, and leaves out one that isn't secure", () => {
    expect(SITE_SETTINGS.googleReviews).toEqual({ writeUrl: "https://g.page/r/traveltonepal/review", profileUrl: "https://g.page/traveltonepal" });
    const unsafe = toSiteSettings({ ...SITE_SETTINGS_ROW, google_review_url: "http://g.page/r/x/review", google_business_url: "" }, PHOTOS_BASE_URL);
    expect(unsafe.googleReviews).toEqual({ writeUrl: "", profileUrl: "" });
  });

  it("has no certificate until one is picked, and a share image when one is", () => {
    expect(SITE_SETTINGS.company.certificate).toBeUndefined();
    expect(SITE_SETTINGS.shareImage?.src).toBe(`${PHOTOS_BASE_URL}/c0ffee00-0000-4000-8000-000000000001`);
  });

  it("leaves the phone blank, never half-built, when no number is saved", () => {
    const settings = toSiteSettings({ ...SITE_SETTINGS_ROW, phone_number: "" }, PHOTOS_BASE_URL);
    expect(settings.contact.phoneDisplay).toBe("");
    expect(settings.contact.phoneDigits).toBe("");
  });

  it("falls back to 9:00–18:00 when a saved time cannot be read", () => {
    const settings = toSiteSettings({ ...SITE_SETTINGS_ROW, office_opens: "soon", office_closes: "" }, PHOTOS_BASE_URL);
    expect(settings.schedule.opens).toEqual({ hour: 9, minute: 0 });
    expect(settings.schedule.closes).toEqual({ hour: 18, minute: 0 });
  });
});
