import { TREK_PAGE_SECTIONS, orderTrekSections } from "@ttn/config/trekPageSections";
import { describe, expect, it } from "vitest";

import { TREK_SECTIONS, trekSectionsInPageOrder } from "./sections";

const keysFor = (saved: string[]) => trekSectionsInPageOrder(orderTrekSections(saved)).map((section) => section.key);

describe("trekSectionsInPageOrder", () => {
  it("lists every section once", () => {
    expect(keysFor([]).toSorted()).toEqual(TREK_SECTIONS.map((section) => section.key).toSorted());
  });

  it("follows the page: top and photos first, Google, shared sections and order last", () => {
    const keys = keysFor(["highlights", ...TREK_PAGE_SECTIONS.filter((section) => section !== "highlights")]);
    expect(keys.slice(0, 4)).toEqual(["top", "photos", "highlights", "intro"]);
    expect(keys.slice(-3)).toEqual(["seo", "shared", "order"]);
  });

  it("places the route section where its first heading is", () => {
    const keys = keysFor(["route_map", ...TREK_PAGE_SECTIONS.filter((section) => section !== "route_map")]);
    expect(keys.indexOf("route")).toBe(2);
  });
});
