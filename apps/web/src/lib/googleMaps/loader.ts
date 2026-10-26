/*
 * Loads the Google Maps JavaScript API with its documented <script> URL, once per page, and types
 * only the parts this site uses (no extra npm packages).
 */

export type LatLng = { lat: number; lng: number };

export type GoogleMap = {
  panTo: (position: LatLng) => void;
  fitBounds: (bounds: LatLngBounds, padding?: number) => void;
  /** Undefined until the map has a size and position. */
  getBounds: () => LatLngBounds | undefined;
};

type LatLngBounds = { extend: (position: LatLng) => void; contains: (position: LatLng) => boolean };

export type AdvancedMarker = {
  content: HTMLElement;
  zIndex: number | null;
  map: GoogleMap | null;
  addListener: (event: "click", handler: () => void) => void;
};

export type MapOptions = {
  center: LatLng;
  zoom: number;
  mapId: string;
  mapTypeId?: "roadmap" | "terrain" | "satellite" | "hybrid";
  /** "cooperative": one finger scrolls the page on phones, two fingers move the map. */
  gestureHandling?: "cooperative" | "greedy" | "none" | "auto";
  streetViewControl?: boolean;
};

export type GoogleMapsApi = {
  Map: new (element: HTMLElement, options: MapOptions) => GoogleMap;
  LatLngBounds: new () => LatLngBounds;
  marker: {
    AdvancedMarkerElement: new (options: {
      map: GoogleMap;
      position: LatLng;
      content: HTMLElement;
      title: string;
      gmpClickable: boolean;
      zIndex?: number;
    }) => AdvancedMarker;
  };
};

type GoogleMapsWindow = Window & {
  google?: { maps?: GoogleMapsApi };
  /** Called by the script once loaded (the URL's callback parameter). */
  __ttnGoogleMapsReady?: () => void;
  /** Called by Google when the key is invalid or not allowed on this domain. */
  gm_authFailure?: () => void;
};

let loading: Promise<GoogleMapsApi> | null = null;

/** The Maps API with the marker library; the script is added on the first call only. */
export const loadGoogleMaps = (apiKey: string): Promise<GoogleMapsApi> => {
  if (loading) return loading;

  loading = new Promise<GoogleMapsApi>((resolve, reject) => {
    const scope = window as GoogleMapsWindow;
    scope.__ttnGoogleMapsReady = () => {
      const maps = scope.google?.maps;
      if (maps) resolve(maps);
      else reject(new Error("Google Maps loaded without its API"));
    };
    scope.gm_authFailure = () => reject(new Error("Google Maps rejected the API key"));

    const script = document.createElement("script");
    const params = new URLSearchParams({
      key: apiKey,
      v: "weekly",
      libraries: "marker",
      loading: "async",
      callback: "__ttnGoogleMapsReady",
    });
    script.src = `https://maps.googleapis.com/maps/api/js?${params}`;
    script.async = true;
    script.onerror = () => {
      loading = null; // let a later attempt try again (e.g. after a network blip)
      reject(new Error("Could not load Google Maps"));
    };
    document.head.append(script);
  });

  return loading;
};
