import type { GroupPrice } from "./types";

/** The group size selected when the page opens: the one marked default, else the first. */
export const defaultGroupIndex = (groupPrices: readonly GroupPrice[]) =>
  Math.max(0, groupPrices.findIndex((tier) => tier.isDefault));
