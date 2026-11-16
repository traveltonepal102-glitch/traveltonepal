import { describe, expect, it } from "vitest";

import { editSiteSchema } from "./editSiteSchema";

describe("editSiteSchema", () => {
  it("reads the switch: on when sent, off when not", () => {
    expect(editSiteSchema.parse({ name: "Manaslu Trek", url: "https://manaslutrek.com", isLive: "on" }).isLive).toBe(true);
    expect(editSiteSchema.parse({ name: "Manaslu Trek", url: "", isLive: "" }).isLive).toBe(false);
  });

  it("needs an address before the site goes live", () => {
    const result = editSiteSchema.safeParse({ name: "Manaslu Trek", url: "", isLive: "on" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["url"]);
  });

  it("takes a language and currency only when sent (a live site sends none)", () => {
    expect(editSiteSchema.parse({ name: "Annapurna Trekking", url: "", isLive: "", language: "de", currency: "EUR" })).toMatchObject({ language: "de", currency: "EUR" });
    expect(editSiteSchema.parse({ name: "Manaslu Trek", url: "", isLive: "" }).language).toBeUndefined();
    expect(editSiteSchema.safeParse({ name: "Manaslu Trek", url: "", isLive: "", language: "fr" }).success).toBe(false);
  });

  it("checks the name and the address like Add a site", () => {
    expect(editSiteSchema.safeParse({ name: " ", url: "", isLive: "" }).success).toBe(false);
    expect(editSiteSchema.safeParse({ name: "Manaslu Trek", url: "https://manaslutrek.com/treks", isLive: "" }).success).toBe(false);
  });
});
