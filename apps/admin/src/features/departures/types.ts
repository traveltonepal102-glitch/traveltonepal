import type { Photo } from "@/features/photos/types";
import type { DepartureStatus } from "@/features/treks/types";

/** A fixed start date as the Departure dates screen shows it. */
export type DepartureItem = {
  id: string;
  trekId: string;
  /** "YYYY-MM-DD" */
  startDate: string;
  status: DepartureStatus;
  /** Shown on the trek page, e.g. "4 places left". */
  note: string;
  /** Instead of the trek's "From" price, for this date only. */
  specialPriceUsd: number | null;
  /** Never shown on the website. */
  teamNote: string;
};

/** A trek as this screen needs it: to name rows, work out end dates and offer it in "Add date". */
export type DepartureTrek = {
  id: string;
  name: string;
  days: number;
  cover: Photo | null;
  /** Off: the trek page shows "Your dates, your pace" and none of its dates. */
  hasFixedDates: boolean;
  priceFromUsd: number | null;
};

/** What "Add date" and "Edit" save. */
export type DepartureFormValues = Omit<DepartureItem, "id">;

/** Several dates for one trek at once (repeat a pattern, copy a season, copy to next year). */
export type NewDepartures = { trekId: string; status: DepartureStatus; entries: { startDate: string; note: string }[] };
