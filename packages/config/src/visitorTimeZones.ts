/**
 * Places the Contact page can show the office hours for ("Time difference"), in the visitor's summer and winter
 * time. The admin picks up to four in Pages › Contact; the website shows them in this order.
 */
export const VISITOR_TIME_ZONES = [
  { timeZone: "Europe/Berlin", place: "Germany (Berlin)" },
  { timeZone: "Europe/Zurich", place: "Switzerland (Zurich)" },
  { timeZone: "Europe/Paris", place: "France (Paris)" },
  { timeZone: "Europe/Amsterdam", place: "Netherlands (Amsterdam)" },
  { timeZone: "Europe/London", place: "United Kingdom (London)" },
  { timeZone: "America/New_York", place: "USA (New York)" },
  { timeZone: "America/Los_Angeles", place: "USA (Los Angeles)" },
  { timeZone: "America/Toronto", place: "Canada (Toronto)" },
  { timeZone: "Australia/Sydney", place: "Australia (Sydney)" },
  { timeZone: "Asia/Kolkata", place: "India (Delhi)" },
  { timeZone: "Asia/Singapore", place: "Singapore" },
  { timeZone: "Asia/Tokyo", place: "Japan (Tokyo)" },
] as const;

export type VisitorTimeZone = (typeof VISITOR_TIME_ZONES)[number]["timeZone"];

export const MAX_VISITOR_TIME_ZONES = 4;
