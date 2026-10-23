/** My Maps ids are long and URL-safe (the database checks the same pattern). */
const MY_MAPS_ID = /^[A-Za-z0-9_-]{10,100}$/;
const GOOGLE_HOST = /^(www\.)?google\.[a-z]{2,3}(\.[a-z]{2})?$/;

export type MyMapsIdResult = { ok: true; id: string | null } | { ok: false };

/**
 * The id from what an admin pastes: a My Maps link (…/maps/d/viewer?mid=ID or /edit?mid=ID), or the id itself.
 * Empty is "no My Maps map". Only the id is saved, so the website builds the map links itself.
 */
export const parseMyMapsId = (input: string): MyMapsIdResult => {
  const value = input.trim();
  if (!value) return { ok: true, id: null };
  if (MY_MAPS_ID.test(value)) return { ok: true, id: value };

  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return { ok: false };
  }
  const mid = url.searchParams.get("mid");
  if (!GOOGLE_HOST.test(url.hostname) || !url.pathname.startsWith("/maps/d/") || !mid || !MY_MAPS_ID.test(mid)) return { ok: false };
  return { ok: true, id: mid };
};

/** The My Maps map, as a link to show in the editor. */
export const myMapsViewerUrl = (id: string) => `https://www.google.com/maps/d/viewer?${new URLSearchParams({ mid: id })}`;

/** Where "Open in Google Maps" goes on the trek page: the My Maps map, else a search for the place. */
export const googleMapsUrl = ({ place, myMapsId }: { place: string; myMapsId: string | null }) =>
  myMapsId
    ? myMapsViewerUrl(myMapsId)
    : `https://www.google.com/maps/search/?${new URLSearchParams({ api: "1", query: place })}`;
