import { formatDepartureDate } from "@/features/treks/format";

import type { Departure, GroupPrice } from "./types";

/** The group size selected when the page opens: the one marked default, else the first. */
export const defaultGroupIndex = (groupPrices: readonly GroupPrice[]) =>
  Math.max(0, groupPrices.findIndex((tier) => tier.isDefault));

export type DepartureOption = {
  /** e.g. "Nov 02, 2026". */
  label: string;
  /** e.g. "Guaranteed · 4 slots left". */
  note: string;
  isGuaranteed: boolean;
};

/** Departures as the date picker and booking card show them. */
export const departureOptions = (departures: readonly Departure[]): DepartureOption[] =>
  departures.map((departure) => ({
    label: formatDepartureDate(departure.date),
    note: departure.isGuaranteed ? `Guaranteed · ${departure.note}` : departure.note,
    isGuaranteed: departure.isGuaranteed,
  }));
