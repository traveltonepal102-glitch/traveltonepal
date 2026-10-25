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

/** Kathmandu, the starting point of every trek, and Pokhara, the gateway to the Annapurna treks. */
export const KATHMANDU = projectToMap(85.32, 27.7);
export const POKHARA = projectToMap(83.98, 28.21);

/** The main Himalayan range as a band along the northern border, for the Regions map. */
const HIMALAYA: readonly (readonly [number, number])[] = [
  [81.2, 29.9], [82.4, 29.5], [83.5, 28.8], [84.6, 28.6], [85.6, 28.2], [86.8, 27.95], [88.0, 27.75],
];

export const HIMALAYA_PATH = `M${HIMALAYA.map(([lon, lat]) => {
  const { x, y } = projectToMap(lon, lat - 0.05);
  return `${x} ${y}`;
}).join(" L")}`;

/** Close enough to show the whole region around its centre. */
const REGION_ZOOM = "9";

/** The classic Google place embed of a region: no API key, one pin at its map pin, terrain view. */
export const regionMapEmbedUrl = ({ lat, lon }: { lat: number; lon: number }) =>
  `https://maps.google.com/maps?${new URLSearchParams({ q: `${lat},${lon}`, z: REGION_ZOOM, t: "p", output: "embed" })}`;
