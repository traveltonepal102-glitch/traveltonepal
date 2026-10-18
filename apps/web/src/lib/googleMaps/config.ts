export type GoogleMapsConfig = { apiKey: string; mapId: string };

/**
 * Google Maps JavaScript API settings, or null when no key is set (pages then keep their drawn maps).
 * The key is public by design: restrict it to the site's domains in Google Cloud. Numbered pins
 * (Advanced Markers) need a Map ID; DEMO_MAP_ID is Google's ID for testing only.
 */
export const GOOGLE_MAPS_CONFIG: GoogleMapsConfig | null = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  ? {
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID",
    }
  : null;
