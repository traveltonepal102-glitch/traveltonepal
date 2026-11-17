import { describe, expect, it } from "vitest";

import { toHomeTopContent } from "./homeTopContent";

describe("toHomeTopContent", () => {
  it("keeps the saved words", () => {
    expect(toHomeTopContent({ photoAlt: "Phu", buttonLabel: "Trek planen", secondLabel: "Zum Reiseverlauf" }, "de")).toEqual({
      photoAlt: "Phu",
      buttonLabel: "Trek planen",
      secondLabel: "Zum Reiseverlauf",
    });
  });

  it("gives a blank WhatsApp button the default in the website's language", () => {
    expect(toHomeTopContent({}, "de").buttonLabel).toBe("Trek per WhatsApp planen");
    expect(toHomeTopContent(null, "en").buttonLabel).toBe("Plan my trek on WhatsApp");
  });

  it("reads anything that isn't text as blank", () => {
    expect(toHomeTopContent({ photoAlt: 3, secondLabel: ["x"] }, "en")).toEqual({ photoAlt: "", buttonLabel: "Plan my trek on WhatsApp", secondLabel: "" });
  });
});
