import { describe, expect, it } from "vitest";

import { passesThrough, readRoute, routeLabel, routeText } from "./route";

const LANGTANG = { slug: "langtang", name: "Langtang" };
const GANESH = { slug: "ganesh-himal", name: "Ganesh Himal" };
const MANASLU = { slug: "manaslu", name: "Manaslu" };
const crossing = { region: "Langtang", regionSlug: "langtang", route: [LANGTANG, GANESH, MANASLU] };
const single = { region: "Langtang", regionSlug: "langtang", route: [LANGTANG] };

describe("trek routes", () => {
  it("passes through every region on the route, in order", () => {
    expect(passesThrough(crossing, "manaslu")).toBe(true);
    expect(passesThrough(crossing, "everest")).toBe(false);
    expect(routeText(crossing)).toBe("Langtang → Ganesh Himal → Manaslu");
  });

  it("labels a card with the first and last region, or just the region", () => {
    expect(routeLabel(crossing)).toBe("Langtang → Manaslu");
    expect(routeLabel(single)).toBe("Langtang");
  });

  it("reads the database's route, and falls back to the main region when it can't", () => {
    expect(readRoute([{ slug: "langtang", name: " Langtang " }, { slug: "manaslu", name: "Manaslu" }, { slug: "x" }], LANGTANG)).toEqual([LANGTANG, MANASLU]);
    expect(readRoute(null, LANGTANG)).toEqual([LANGTANG]);
    expect(readRoute([MANASLU], LANGTANG)).toEqual([LANGTANG]);
  });
});
