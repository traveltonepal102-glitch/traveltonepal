import { describe, expect, it } from "vitest";

import { SITE_SETTINGS } from "@/features/site-settings/siteSettings.testData";

import { travelAgencyJsonLd } from "./organization";

describe("travelAgencyJsonLd", () => {
  it("describes the company from Site settings", () => {
    const data = travelAgencyJsonLd(SITE_SETTINGS);
    expect(data).toMatchObject({
      "@type": "TravelAgency",
      legalName: "Travel To Nepal",
      email: "hello@example.com",
      telephone: "+977 9843197197",
      address: { streetAddress: "Thamel", addressLocality: "Kathmandu", addressCountry: "NP" },
      foundingDate: "2015",
      openingHoursSpecification: {
        dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      contactPoint: { availableLanguage: ["English", "Nepali"] },
      sameAs: ["https://facebook.com/traveltonepal", "https://www.linkedin.com/company/traveltonepal", "https://g.page/traveltonepal"],
    });
  });

  it("leaves out what is not typed in yet", () => {
    const data = travelAgencyJsonLd({
      ...SITE_SETTINGS,
      contact: { ...SITE_SETTINGS.contact, email: "", phoneDisplay: "", officeAddress: "Kathmandu, Nepal" },
      company: { ...SITE_SETTINGS.company, legalName: "", foundedYear: undefined },
      schedule: { ...SITE_SETTINGS.schedule, openDays: [] },
      social: [],
      shareImage: undefined,
    });
    for (const key of ["legalName", "email", "telephone", "foundingDate", "openingHoursSpecification", "contactPoint", "sameAs", "image"]) {
      expect(data).not.toHaveProperty(key);
    }
    expect(data.address).toEqual({ "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" });
  });
});
