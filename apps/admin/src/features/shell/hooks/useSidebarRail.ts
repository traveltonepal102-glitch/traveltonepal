"use client";

import { useState } from "react";

import { RAIL_COOKIE, RAIL_COOKIE_MAX_AGE } from "../constants";

/** "Show icons only" on wide screens. The choice is kept in a cookie so the server renders the same width. */
export const useSidebarRail = (isRailInitially: boolean) => {
  const [isRail, setIsRail] = useState(isRailInitially);

  const toggleRail = () => {
    const next = !isRail;
    setIsRail(next);
    document.cookie = `${RAIL_COOKIE}=${next ? "1" : "0"}; path=/; max-age=${RAIL_COOKIE_MAX_AGE}; samesite=lax`;
  };

  return { isRail, toggleRail };
};
