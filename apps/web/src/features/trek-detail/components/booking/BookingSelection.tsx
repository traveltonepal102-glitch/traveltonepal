"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type BookingSelection = {
  groupIndex: number;
  selectGroup: (index: number) => void;
  departureIndex: number;
  selectDeparture: (index: number) => void;
};

const BookingSelectionContext = createContext<BookingSelection | null>(null);

type BookingSelectionProviderProps = {
  defaultGroupIndex: number;
  children: ReactNode;
};

/**
 * The group size and departure the visitor picked. Shared by the booking card, the date picker and
 * the group rates table, so choosing in one place updates the others.
 */
export const BookingSelectionProvider = ({ defaultGroupIndex, children }: BookingSelectionProviderProps) => {
  const [groupIndex, selectGroup] = useState(defaultGroupIndex);
  const [departureIndex, selectDeparture] = useState(0);

  return (
    <BookingSelectionContext value={{ groupIndex, selectGroup, departureIndex, selectDeparture }}>
      {children}
    </BookingSelectionContext>
  );
};

export const useBookingSelection = () => {
  const selection = useContext(BookingSelectionContext);
  if (!selection) throw new Error("useBookingSelection must be used inside BookingSelectionProvider");
  return selection;
};
