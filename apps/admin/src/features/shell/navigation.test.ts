import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { ADMIN_SECTIONS, isActivePath } from "./navigation";
import { NEW_ITEMS } from "./newItems";

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
