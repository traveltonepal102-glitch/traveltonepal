/*
 * One SVG sprite for a whole icon set, served once at a cached address and referenced by every icon on the page with
 * <use href="/icons.svg?v=…#name">: the page's HTML (and the React payload that repeats it) then carry ~80 bytes per
 * icon instead of its whole path. The address carries a short hash of the set, so a changed icon is fetched again.
 */

/** A short, stable hash of the icon set (djb2 over its paths), for the sprite's address. */
export const iconSetVersion = (paths: Record<string, string>): string => {
  let hash = 5381;
  for (const char of JSON.stringify(paths)) hash = ((hash << 5) + hash + char.charCodeAt(0)) >>> 0;
  return hash.toString(36);
};

/** The sprite's address for this set, e.g. "/icons.svg?v=1k2j3h". The route serves `iconSpriteSvg` of the same set. */
export const iconSpriteUrl = (paths: Record<string, string>): string => `/icons.svg?v=${iconSetVersion(paths)}`;

/** The sprite document: a <symbol> per icon, each with the set's viewBox. Presentation (fill, stroke) comes from the <svg> that uses it. */
export const iconSpriteSvg = (paths: Record<string, string>, viewBox: string): string =>
  `<svg xmlns="http://www.w3.org/2000/svg">${Object.entries(paths)
    .map(([name, d]) => `<symbol id="${name}" viewBox="${viewBox}"><path d="${d}"/></symbol>`)
    .join("")}</svg>`;

/** The cached answer for the sprite route: a year, the address changes with the set. */
export const iconSpriteResponse = (paths: Record<string, string>, viewBox: string): Response =>
  new Response(iconSpriteSvg(paths, viewBox), {
    headers: { "content-type": "image/svg+xml; charset=utf-8", "cache-control": "public, max-age=31536000, immutable" },
  });
