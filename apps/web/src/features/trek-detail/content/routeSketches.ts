import type { RouteSketch } from "../types";

/**
 * Hand-drawn route sketches (design: Trek.dc.html), by trek address. A trek without one shows its Google map
 * only. Drawn in code: the admin has no sketch editor.
 */
export const ROUTE_SKETCHES: Readonly<Record<string, RouteSketch>> = {
  "langtang-valley": {
    description: "Sketch map of the route from Syabrubesi to Kyanjin Ri",
    caption: "Langtang Valley Trek route overview (Kathmandu – Syabrubesi – Kyanjin Gompa)",
    groundPath: "M0 330 C 120 300, 260 330, 380 300 S 560 230, 700 240 S 900 260, 1000 250 L1000 560 L0 560 Z",
    peaksPath: "M470 30 L520 70 L560 40 L610 85 L560 110 L500 100 Z M660 40 L720 75 L770 50 L840 95 L790 120 L700 105 Z",
    riverPath: "M20 470 C 80 450, 100 448, 140 442 S 300 398, 380 382 S 540 300, 620 272 S 760 228, 820 220 S 930 205, 1000 196",
    routePath: "M120 430 C 200 405, 280 385, 360 360 S 520 285, 610 250 S 730 212, 780 205",
    sideHikePath: "M780 205 C 790 175, 795 150, 805 120",
    pins: [
      { name: "Syabrubesi", altitudeM: 1503, x: 120, y: 430, kind: "start" },
      { name: "Lama Hotel", altitudeM: 2470, x: 360, y: 360, kind: "stop" },
      { name: "Langtang", altitudeM: 3430, x: 610, y: 250, kind: "stop" },
      { name: "Kyanjin Gompa", altitudeM: 3870, x: 780, y: 205, kind: "stop" },
      { name: "Kyanjin Ri", altitudeM: 4773, x: 805, y: 120, kind: "summit", labelSide: "left" },
      { name: "Tserko Ri", altitudeM: 4984, x: 905, y: 232, kind: "option" },
    ],
    labels: [
      { text: "Syabrubesi", x: 120, y: 480 },
      { text: "Langtang", x: 610, y: 300 },
      { text: "Kyanjin", x: 780, y: 255 },
      { text: "Kyanjin Ri", x: 805, y: 95 },
    ],
    approachPath: "M0 548 C 50 520, 90 470, 120 430",
    optionPath: "M780 205 C 830 214, 870 222, 905 232",
    mapLabels: [
      { text: "Langtang National Park", x: 300, y: 250, kind: "park" },
      { text: "▲ Langtang Lirung 7,227 m", x: 500, y: 140, kind: "peak" },
      { text: "To Kathmandu", x: 60, y: 520, kind: "road" },
      { text: "Langtang Khola", x: 700, y: 290, kind: "water" },
    ],
  },
};
