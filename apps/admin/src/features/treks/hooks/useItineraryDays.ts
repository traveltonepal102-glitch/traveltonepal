"use client";

import { useState } from "react";

import type { ItineraryDay } from "../types";

/** A day as the editor holds it: altitudes as typed (e.g. "4,773"), plus a key that never changes. */
export type DayRow = Omit<ItineraryDay, "altitudeM" | "sleepAltitudeM"> & {
  key: string;
  altitude: string;
  sleepAltitude: string;
};

const toRow = (day: ItineraryDay, index: number): DayRow => ({
  ...day,
  key: day.id ?? `new-${index}`,
  altitude: day.altitudeM === null ? "" : String(day.altitudeM),
  sleepAltitude: day.sleepAltitudeM === null ? "" : String(day.sleepAltitudeM),
});

const emptyRow = (): DayRow => ({
  key: crypto.randomUUID(),
  id: null,
  place: "",
  title: "",
  subtitle: "",
  duration: "",
  altitude: "",
  sleepAltitude: "",
  isHighPoint: false,
  description: "",
  photo: null,
});

/**
 * The day-by-day plan in the editor: add, duplicate, reorder and delete days, one highlight day at most,
 * and one day open at a time (like the design). Day numbers follow the order by themselves.
 */
export const useItineraryDays = (initial: ItineraryDay[], onEdit: () => void) => {
  const [days, setDays] = useState<DayRow[]>(() => initial.map(toRow));
  const [openKey, setOpenKey] = useState<string | null>(null);

  const change = (update: (current: DayRow[]) => DayRow[]) => {
    setDays(update);
    onEdit();
  };

  const add = () => {
    const row = emptyRow();
    change((current) => [...current, row]);
    setOpenKey(row.key);
  };

  /** A copy right after the day, as a new day (its own id on Save, never the highlight). */
  const duplicate = (key: string) => {
    const copyKey = crypto.randomUUID();
    change((current) =>
      current.flatMap((day) => (day.key === key ? [day, { ...day, key: copyKey, id: null, isHighPoint: false }] : [day])),
    );
    setOpenKey(copyKey);
  };

  const remove = (key: string) => change((current) => current.filter((day) => day.key !== key));

  const move = (from: number, to: number) =>
    change((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [day] = next.splice(from, 1);
      next.splice(to, 0, day);
      return next;
    });

  /** On for this day turns it off everywhere else; on again turns it off. */
  const toggleHighPoint = (key: string) =>
    change((current) => current.map((day) => ({ ...day, isHighPoint: day.key === key ? !day.isHighPoint : false })));

  const update = (key: string, patch: Partial<DayRow>) =>
    change((current) => current.map((day) => (day.key === key ? { ...day, ...patch } : day)));

  const toggleOpen = (key: string) => setOpenKey((current) => (current === key ? null : key));

  return { days, openKey, add, duplicate, remove, move, toggleHighPoint, update, toggleOpen };
};
