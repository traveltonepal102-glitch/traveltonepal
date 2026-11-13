"use client";

import { createContext, use, useMemo, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { groupIndexFor, groupRanges } from "../groupSizes";
import type { GroupRange } from "../groupSizes";
import { todayInNepal } from "../startDate";
import type { HomeGroupPrice } from "../types";

type Booking = {
  prices: readonly HomeGroupPrice[];
  ranges: readonly GroupRange[];
  travellers: number;
  setTravellers: (travellers: number) => void;
  /** The group price these travellers pay. */
  chosenIndex: number;
  /** Choosing a group price sets the travellers to its smallest group. */
  choose: (index: number) => void;
  /** "" until the browser has read the date. */
  today: string;
  startDate: string;
  setStartDate: (date: string) => void;
};

const BookingContext = createContext<Booking | null>(null);

/** The date is read once per visit: nothing to listen to. */
const subscribeToNothing = () => () => undefined;

/** The travellers and day chosen on the page: the price list, the booking card, the request form and the phone's bar follow them. */
export const BookingProvider = ({ prices, children }: { prices: readonly HomeGroupPrice[]; children: ReactNode }) => {
  const ranges = useMemo(() => groupRanges(prices), [prices]);
  // Every trek is private from one person, so the card starts with one traveller ("Most chosen" only marks a price).
  const [travellers, setTravellers] = useState(1);
  // Starts on today, which only the browser knows: the page is built ahead. A day picked (or the field cleared) replaces it.
  const today = useSyncExternalStore(subscribeToNothing, todayInNepal, () => "");
  const [pickedDate, setPickedDate] = useState<string | null>(null);

  const value: Booking = {
    prices,
    ranges,
    travellers,
    setTravellers,
    chosenIndex: groupIndexFor(ranges, travellers),
    choose: (index) => setTravellers(ranges[index]?.min ?? travellers),
    today,
    startDate: pickedDate ?? today,
    setStartDate: setPickedDate,
  };
  return <BookingContext value={value}>{children}</BookingContext>;
};

export const useBooking = () => {
  const booking = use(BookingContext);
  if (!booking) throw new Error("useBooking needs a BookingProvider around it.");
  return booking;
};
