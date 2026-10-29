/**
 * Each day's region on a route (ids, main region first): the day's own pick when it is on the route, else the day
 * before's (day 1: the main region), as the website reads them. Empty without a route.
 */
export const dayRegionIds = (picked: readonly (string | null)[], routeIds: readonly string[]): string[] => {
  const [main] = routeIds;
  if (!main) return [];
  let current = main;
  return picked.map((id) => (current = id && routeIds.includes(id) ? id : current));
};
