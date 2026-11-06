import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { ADMIN_SECTIONS, NAV_GROUPS, REGION_SITE_START, isActivePath, isInSiteMenu, navGroupsFor } from "./navigation";
import { NEW_ITEMS, newItemsFor } from "./newItems";

const PORTAL = path.resolve(import.meta.dirname, "../../app/(portal)");
/** The page a link opens ("?guide=new" only changes what that page shows). */
const pageFileFor = (href: string) => path.join(PORTAL, href.split("?")[0], "page.tsx");

describe("admin menu", () => {
  it.each(Object.values(ADMIN_SECTIONS))("$label ($href) has a page", ({ href }) => {
    expect(existsSync(pageFileFor(href))).toBe(true);
  });

  it.each(NEW_ITEMS)("New → $label ($href) has a page", ({ href }) => {
    expect(existsSync(pageFileFor(href))).toBe(true);
  });
});

describe("newItemsFor", () => {
  it("gives a Super admin every item, with Region", () => {
    expect(newItemsFor("super_admin")).toEqual(NEW_ITEMS);
    expect(newItemsFor("super_admin").map((item) => item.label)).toContain("Region");
  });

  it("leaves out what only a Super admin can add for an editor", () => {
    const labels = newItemsFor("editor").map((item) => item.label);
    expect(labels).not.toContain("Region");
    expect(labels).toContain("Trek");
  });
});

describe("isActivePath", () => {
  it("marks the dashboard only on the dashboard", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/treks", "/")).toBe(false);
  });

  it("marks a section on its own page and its sub-pages", () => {
    expect(isActivePath("/treks", "/treks")).toBe(true);
    expect(isActivePath("/treks/langtang-valley", "/treks")).toBe(true);
  });

  it("doesn't mark a section whose name only starts the same", () => {
    expect(isActivePath("/trekking-guides", "/treks")).toBe(false);
    expect(isActivePath("/treks-archive", "/treks")).toBe(false);
  });
});

describe("the menu per site", () => {
  const labels = (kind: "main" | "region") => navGroupsFor(kind).flatMap((group) => group.items.map((item) => item.label));

  it("gives the main site every section", () => {
    expect(navGroupsFor("main")).toBe(NAV_GROUPS);
  });

  it("gives a region site only its own sections and Sites", () => {
    expect(labels("region")).toEqual(["Pages", "Treks", "Travel guides", "Photos and videos", "Reviews", "Sites"]);
  });

  it("knows which screens a region site has (Site settings too)", () => {
    expect(isInSiteMenu("/treks/abc", "region")).toBe(true);
    expect(isInSiteMenu("/settings", "region")).toBe(true);
    expect(isInSiteMenu("/regions", "region")).toBe(false);
    expect(isInSiteMenu("/", "region")).toBe(false);
    expect(isInSiteMenu("/regions", "main")).toBe(true);
  });

  it("opens a region site on a screen in its menu", () => {
    expect(isInSiteMenu(REGION_SITE_START, "region")).toBe(true);
  });
});
