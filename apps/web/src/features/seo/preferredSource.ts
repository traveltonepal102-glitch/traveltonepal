/**
 * Google's "Add as a preferred source" page for this site (Search Central's deeplink option: a plain link, so
 * nothing loads from Google and nothing is sent until the visitor clicks). Google asks for the domain name.
 */
export const preferredSourceUrl = (siteUrl: URL) =>
  `https://www.google.com/preferences/source?${new URLSearchParams({ q: siteUrl.hostname.replace(/^www\./, "") })}`;
