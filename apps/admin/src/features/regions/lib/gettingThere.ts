/**
 * Whether "Getting there" mentions a flight ("Fly to Lukla", "Drive or fly to Pokhara"): the Regions page cards then
 * show a plane instead of a road (regions.is_flight). Typed as one text, as many regions can be reached both ways.
 */
export const mentionsFlying = (gettingThere: string) => /\b(fly|flies|flight|flights|flying)\b/i.test(gettingThere);
