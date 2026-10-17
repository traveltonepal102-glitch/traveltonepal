import type { TrekRouteMap } from "./types";

/** My Maps ids are long and URL-safe (letters, digits, "-" and "_"). */
const MY_MAPS_ID = /^[\w-]{10,}$/;
/** Close enough to show the whole valley around the place. */
const PLACE_ZOOM = "11";

export type GoogleMapLinks = {
  /** For the <iframe>. */
  embedUrl: string;
  /** Opens the same map in Google Maps (app or new tab). */
  openUrl: string;
  /** True when the map draws the GPS trail (a My Maps map), not just the area. */
  hasTrailLine: boolean;
};

/**
 * Google Maps links for a trek, built from a place name or a My Maps id (never a URL from content).
 * An invalid id is a content mistake, so it fails the build instead of embedding a broken map.
 */
export const googleMapLinks = ({ place, myMapsId }: TrekRouteMap): GoogleMapLinks => {
  if (myMapsId !== undefined) {
    if (!MY_MAPS_ID.test(myMapsId)) throw new Error(`Invalid Google My Maps id: "${myMapsId}"`);
    const mid = new URLSearchParams({ mid: myMapsId });
    return {
      embedUrl: `https://www.google.com/maps/d/embed?${mid}`,
      openUrl: `https://www.google.com/maps/d/viewer?${mid}`,
      hasTrailLine: true,
    };
  }

  // No API key needed: the classic place embed and the official Maps URLs search link.
  return {
    embedUrl: `https://maps.google.com/maps?${new URLSearchParams({ q: place, z: PLACE_ZOOM, output: "embed" })}`,
    openUrl: `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: place })}`,
    hasTrailLine: false,
  };
};
