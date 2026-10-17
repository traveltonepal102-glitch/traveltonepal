/**
 * A simple outline of Nepal for "Where it is" maps, in a 1010×500 SVG box. Longitude/latitude are
 * projected linearly (fine at this size): about 118 units per degree east, 110 per degree north.
 */
export const NEPAL_MAP_VIEWBOX = "0 0 1010 500";

const WEST_LON = 80;
const NORTH_LAT = 30.5;
const MARGIN = 20;

export const projectToMap = (lon: number, lat: number) => ({
  x: Math.round((lon - WEST_LON) * 118 + MARGIN),
  y: Math.round((NORTH_LAT - lat) * 110 + MARGIN),
});

/** Border points (longitude, latitude), clockwise from the far west. */
const BORDER: readonly (readonly [number, number])[] = [
  [80.06, 28.9], [80.5, 29.6], [81.0, 30.2], [81.5, 30.4], [82.2, 30.1], [83.0, 29.6], [83.6, 29.2], [84.2, 29.3],
  [85.0, 28.7], [85.5, 28.4], [86.0, 28.1], [86.7, 28.0], [87.4, 27.9], [88.1, 27.9], [88.2, 27.0], [88.1, 26.4],
  [87.3, 26.4], [86.5, 26.5], [85.8, 26.6], [85.0, 26.9], [84.2, 27.4], [83.5, 27.4], [82.5, 27.6], [81.5, 28.1],
  [80.6, 28.6],
];

export const NEPAL_OUTLINE_PATH = `M${BORDER.map(([lon, lat]) => {
  const { x, y } = projectToMap(lon, lat);
  return `${x} ${y}`;
}).join(" L")} Z`;

/** Kathmandu, the starting point of every trek. */
export const KATHMANDU = projectToMap(85.32, 27.7);
