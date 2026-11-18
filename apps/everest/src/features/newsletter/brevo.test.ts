import { describe, expect, it } from "vitest";

import { doubleOptInRequest } from "./brevo";

const settings = { apiKey: "xkeysib-test", listId: 3, templateId: 7 };

describe("doubleOptInRequest", () => {
  it("asks Brevo for double opt-in on the list, with the confirmed page to return to", () => {
    const request = doubleOptInRequest({ email: "a@b.co", name: "Anna" }, settings, "https://x.test/newsletter/confirmed");
    expect(request.headers["api-key"]).toBe("xkeysib-test");
    expect(JSON.parse(request.body)).toEqual({
      email: "a@b.co",
      attributes: { FIRSTNAME: "Anna" },
      includeListIds: [3],
      templateId: 7,
      redirectionUrl: "https://x.test/newsletter/confirmed",
    });
  });

  it("sends no attributes without a name", () => {
    expect(JSON.parse(doubleOptInRequest({ email: "a@b.co", name: "" }, settings, "https://x.test/c").body)).not.toHaveProperty("attributes");
  });
});
