"use client";

import { useState } from "react";

import { EMPTY_RICH_TEXT } from "@/lib/richText/richText";

import { parseAltitude } from "../lib/altitudeProfile";
import type { DayAltitude } from "../lib/elevationSummary";
import type { ItineraryDay } from "../types";

/**
 * A day as the editor holds it (as the design asks): the sleep altitude, the highest point only when the day
 * goes higher, both as typed (e.g. "4,773"), plus a key that never changes.
 */
export type DayRow = Omit<ItineraryDay, "altitudeM" | "sleepAltitudeM"> & {
  key: string;
  topAltitude: string;
  sleepAltitude: string;
};

const asText = (value: number | null) => (value === null ? "" : String(value));

/** Saved as altitudeM (the highest point) and sleepAltitudeM (only when lower). */
const toRow = (day: ItineraryDay, index: number): DayRow => ({
  ...day,
  key: day.id ?? `new-${index}`,
  topAltitude: day.sleepAltitudeM === null ? "" : asText(day.altitudeM),
  sleepAltitude: asText(day.sleepAltitudeM ?? day.altitudeM),
});

/** The day's highest point as typed: the hike's top, else where you sleep. */
export const dayPeak = (day: Pick<DayRow, "topAltitude" | "sleepAltitude">) => parseAltitude(day.topAltitude) ?? parseAltitude(day.sleepAltitude);

/** A day's altitudes as typed, for the altitude chart and its boxes. */
export const toDayAltitude = (day: DayRow): DayAltitude => ({
  place: day.place,
  duration: day.duration,
  altitudeM: dayPeak(day),
  sleepAltitudeM: parseAltitude(day.sleepAltitude),
});

/** The id of a day's altitude fields, so the chart can open the day there. */
export const dayAltitudesId = (key: string) => `day-${key}-altitudes`;

const emptyRow = (): DayRow => ({
  key: crypto.randomUUID(),
  id: null,
  place: "",
  title: "",
  subtitle: "",
  duration: "",
  topAltitude: "",
  sleepAltitude: "",
  meals: ["breakfast", "lunch", "dinner"],
  isHighPoint: false,
  description: EMPTY_RICH_TEXT,
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

  return { days, openKey, add, duplicate, remove, move, toggleHighPoint, update, toggleOpen, open: setOpenKey };
};

export type ItineraryPlan = ReturnType<typeof useItineraryDays>;
