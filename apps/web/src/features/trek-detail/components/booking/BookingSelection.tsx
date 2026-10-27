"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import type { MonthRating } from "@/features/regions/overviews";

import { defaultStartDate, nepalToday, startMonths } from "../../startDate";
import type { StartMonth } from "../../startDate";

type BookingSelection = {
  groupIndex: number;
  selectGroup: (index: number) => void;
  /** Today in Nepal; null until the browser knows it (the page is built ahead, so its server date can be old). */
  today: string | null;
  /** The next 12 start months (empty while today is unknown). */
  months: readonly StartMonth[];
  /** The chosen start day ("YYYY-MM-DD"): the visitor's pick, else the first best month; null while today is unknown. */
  startDate: string | null;
  selectStartDate: (date: string) => void;
};

const BookingSelectionContext = createContext<BookingSelection | null>(null);

/** Today rarely changes while the page is open; it is read again on each render. */
const subscribe = () => () => {};

type BookingSelectionProviderProps = {
  defaultGroupIndex: number;
  /** The region's best months, Jan–Dec, for the start months' colours and the first date shown. */
  monthRatings: readonly MonthRating[] | null;
  children: ReactNode;
};

/**
 * The group size and start date the visitor picked. Shared by the booking card, the start date picker, the group
 * rates table and the request forms, so choosing in one place updates the others.
 */
export const BookingSelectionProvider = ({ defaultGroupIndex, monthRatings, children }: BookingSelectionProviderProps) => {
  const [groupIndex, selectGroup] = useState(defaultGroupIndex);
  const [chosenDate, selectStartDate] = useState<string | null>(null);
  const today = useSyncExternalStore(subscribe, () => nepalToday(), () => null);
  const months = today ? startMonths(today, monthRatings) : [];
  const startDate = today && (chosenDate && chosenDate >= today ? chosenDate : defaultStartDate(months, today));

  return (
    <BookingSelectionContext value={{ groupIndex, selectGroup, today, months, startDate, selectStartDate }}>
      {children}
    </BookingSelectionContext>
  );
};

export const useBookingSelection = () => {
  const selection = useContext(BookingSelectionContext);
  if (!selection) throw new Error("useBookingSelection must be used inside BookingSelectionProvider");
  return selection;
};
