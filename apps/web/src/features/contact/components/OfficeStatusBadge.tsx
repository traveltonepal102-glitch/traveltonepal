"use client";

import type { OfficeSchedule } from "@ttn/config/contact";
import { useSyncExternalStore } from "react";

import { isOfficeOpen } from "../officeHours";

const MINUTE_MS = 60_000;

/** Re-checks every minute, so the badge flips at opening and closing time. */
const subscribe = (onChange: () => void) => {
  const timer = setInterval(onChange, MINUTE_MS);
  return () => clearInterval(timer);
};

const STATES = {
  open: { dot: "bg-whatsapp-on-dark", text: "Our team is online · Kathmandu" },
  closed: { dot: "bg-navy-text", text: "Office closed now · we reply first thing in the morning" },
  // Before the browser knows the time (the pre-built page): true at any hour.
  unknown: { dot: "bg-whatsapp-on-dark", text: "Local team in Kathmandu" },
} as const;

/** "Our team is online" only while the office is really open (by Nepal time), else when we will reply. */
export const OfficeStatusBadge = ({ schedule }: { schedule: OfficeSchedule }) => {
  const isOpen = useSyncExternalStore(subscribe, () => isOfficeOpen(schedule, new Date()), () => null);
  const state = STATES[isOpen === null ? "unknown" : isOpen ? "open" : "closed"];

  return (
    <p className="inline-flex items-center gap-2 self-start rounded-full border border-whatsapp-on-dark/50 bg-whatsapp/25 px-3 py-1.25 text-caption font-bold text-[#bbf7d0]">
      <span aria-hidden="true" className={`size-2 rounded-full ${state.dot}`} />
      {state.text}
    </p>
  );
};
