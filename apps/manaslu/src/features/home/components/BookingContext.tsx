"use client";

import { createContext, use, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { groupIndexFor, groupRanges } from "../groupSizes";
import type { GroupRange } from "../groupSizes";
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
  startDate: string;
  setStartDate: (date: string) => void;
};

const BookingContext = createContext<Booking | null>(null);

/** The travellers and day chosen on the page: the price list, the booking card, the request form and the phone's bar follow them. */
export const BookingProvider = ({ prices, children }: { prices: readonly HomeGroupPrice[]; children: ReactNode }) => {
  const ranges = useMemo(() => groupRanges(prices), [prices]);
  const [travellers, setTravellers] = useState(() => ranges[Math.max(0, prices.findIndex((price) => price.isDefault))]?.min ?? 1);
  const [startDate, setStartDate] = useState("");

  const value: Booking = {
    prices,
    ranges,
    travellers,
    setTravellers,
    chosenIndex: groupIndexFor(ranges, travellers),
    choose: (index) => setTravellers(ranges[index]?.min ?? travellers),
    startDate,
    setStartDate,
  };
  return <BookingContext value={value}>{children}</BookingContext>;
};

export const useBooking = () => {
  const booking = use(BookingContext);
  if (!booking) throw new Error("useBooking needs a BookingProvider around it.");
  return booking;
};
