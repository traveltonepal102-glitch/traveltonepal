import { describe, expect, it } from "vitest";

import { doubleOptInRequest } from "./brevo";

const SETTINGS = { apiKey: "xkeysib-test", listId: 3, templateId: 1 };

describe("doubleOptInRequest", () => {
  it("asks Brevo to email the confirm template and add the address to the list once confirmed", () => {
    const request = doubleOptInRequest("anna@example.com", SETTINGS, "https://traveltonepal.com/newsletter/confirmed");
    expect(request.method).toBe("POST");
    expect(request.headers["api-key"]).toBe("xkeysib-test");
    expect(JSON.parse(request.body)).toEqual({
      email: "anna@example.com",
      includeListIds: [3],
      templateId: 1,
      redirectionUrl: "https://traveltonepal.com/newsletter/confirmed",
    });
  });
});
