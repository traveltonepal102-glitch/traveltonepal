import type { RoutePinKind } from "../../types";

/** Pin colors: green start, red overnight stops, saffron high point. */
export const PIN_STYLES: Record<RoutePinKind, { fill: string; stroke: string }> = {
  start: { fill: "fill-whatsapp", stroke: "stroke-[#0f5e2e]" },
  stop: { fill: "fill-[#d93025]", stroke: "stroke-[#a50e0e]" },
  summit: { fill: "fill-saffron", stroke: "stroke-saffron-deep" },
};

/** Map-pin shape in a 24×24 box, its tip at (12, 22). */
export const PIN_PATH = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z";
