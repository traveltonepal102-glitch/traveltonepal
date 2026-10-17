import type { MapLabel, RoutePinKind } from "../../types";

/** Drawn-map palette from the website design: meadow, valley floor, snow edge, river. */
export const MAP_COLORS = {
  background: "#e9efe3",
  ground: "#d5e7c9",
  lowGround: "#c9e0bc",
  snowfield: "#eef0ea",
  contour: "#d3dbc7",
  lowContour: "#bed6af",
  snowEdge: "#cfe3f2",
  river: "#9cc9ee",
  road: "#f6c26b",
} as const;

/** Pin colors: green start, red overnight stops, saffron high point, grey optional side trip. */
export const PIN_STYLES: Record<RoutePinKind, { fill: string; stroke: string }> = {
  start: { fill: "fill-whatsapp", stroke: "stroke-[#0f5e2e]" },
  stop: { fill: "fill-[#d93025]", stroke: "stroke-[#a50e0e]" },
  summit: { fill: "fill-saffron", stroke: "stroke-saffron-deep" },
  option: { fill: "fill-footer-muted", stroke: "stroke-[#5f6b76]" },
};

/** Area names on the route map, styled like a printed map. */
export const MAP_LABEL_STYLES: Record<MapLabel["kind"], string> = {
  park: "fill-[#4e7a3a] italic",
  peak: "fill-[#4a5560]",
  water: "fill-[#3d7fb8] italic",
  road: "fill-[#8a6a2a]",
};
