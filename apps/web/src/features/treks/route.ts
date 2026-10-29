import type { TrekRouteRegion, TrekSummary } from "./types";

type Routed = Pick<TrekSummary, "region" | "regionSlug" | "route">;

/** Whether the trek starts in or passes through the region (filters, the Regions page, similar treks). */
export const passesThrough = (trek: Pick<TrekSummary, "route">, regionSlug: string) => trek.route.some((stop) => stop.slug === regionSlug);

/** The route in full, e.g. "Langtang → Ganesh Himal → Manaslu" (the trek page). */
export const routeText = (trek: Routed) => trek.route.map((stop) => stop.name).join(" → ");

/** Short enough for a card: "Langtang", or "Langtang → Manaslu" (first and last region) for a longer route. */
export const routeLabel = (trek: Routed) => {
  const first = trek.route[0];
  const last = trek.route.at(-1);
  return first && last && first !== last ? `${first.name} → ${last.name}` : trek.region;
};

/** The route as the database gives it (main region first), or just the main region when it can't be read. */
export const readRoute = (value: unknown, main: TrekRouteRegion): TrekRouteRegion[] => {
  const stops = Array.isArray(value)
    ? value.flatMap((item: unknown): TrekRouteRegion[] => {
        if (typeof item !== "object" || item === null) return [];
        const { slug, name } = item as Record<string, unknown>;
        return typeof slug === "string" && typeof name === "string" && slug && name.trim() ? [{ slug, name: name.trim() }] : [];
      })
    : [];
  return stops[0]?.slug === main.slug ? stops : [main];
};
