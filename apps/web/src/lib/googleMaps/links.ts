/** Opens Google Maps (app or website) searching for a place, e.g. the office by name and address. No API key needed. */
export const googleMapsSearchUrl = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
