/*
 * What a travel guide's "Embed" section may show: a frame from one of these services only, loaded on the website
 * after a click or the visitor's "External media" consent. Checked when saved (admin) and again when read (website).
 * A new service needs a line in the Privacy policy, and shows in the cookie table by itself (cookieTable.ts).
 */

export type EmbedProvider = {
  id: "google-maps" | "vimeo" | "komoot" | "wikiloc";
  /** As the website names it, e.g. "Load Komoot map". */
  name: string;
  /** Who sees the visitor's IP address, e.g. "Google". */
  company: string;
  /** "map" or "video", for the button and the frame's title. */
  kind: "map" | "video";
  isEmbedUrl: (url: URL) => boolean;
};

export const EMBED_PROVIDERS: readonly EmbedProvider[] = [
  {
    id: "google-maps",
    name: "Google Maps",
    company: "Google",
    kind: "map",
    // "Embed a map" (/maps/embed?pb=…) and Google My Maps (/maps/d/embed?mid=…).
    isEmbedUrl: (url) => url.hostname === "www.google.com" && (url.pathname === "/maps/embed" || url.pathname === "/maps/d/embed"),
  },
  { id: "vimeo", name: "Vimeo", company: "Vimeo", kind: "video", isEmbedUrl: (url) => url.hostname === "player.vimeo.com" && /^\/video\/\d+$/.test(url.pathname) },
  {
    id: "komoot",
    name: "Komoot",
    company: "Komoot",
    kind: "map",
    isEmbedUrl: (url) => /^www\.komoot\.(com|de)$/.test(url.hostname) && /^(\/[a-z]{2}-[a-z]{2})?\/(tour|collection)\/\d+\/embed$/.test(url.pathname),
  },
  { id: "wikiloc", name: "Wikiloc", company: "Wikiloc", kind: "map", isEmbedUrl: (url) => url.hostname === "www.wikiloc.com" && url.pathname === "/wikiloc/embedv2.do" },
];

export type Embed = { url: string; provider: EmbedProvider };

const parse = (value: string) => {
  try {
    return new URL(value);
  } catch {
    return null;
  }
};

/** Links people copy from the address bar, as the address of their embed. */
const fromPageLink = (url: URL) => {
  // Google My Maps: …/maps/d/viewer?mid=… or …/maps/d/u/0/edit?mid=… (the map's view, e.g. ll and z, is kept).
  if (url.hostname === "www.google.com" && /^\/maps\/d\/(u\/\d+\/)?(viewer|edit|embed)$/.test(url.pathname) && /^[\w-]+$/.test(url.searchParams.get("mid") ?? "")) {
    return new URL(`https://www.google.com/maps/d/embed${url.search}`);
  }
  const vimeoId = /^\/(\d+)$/.exec(url.pathname)?.[1];
  if ((url.hostname === "vimeo.com" || url.hostname === "www.vimeo.com") && vimeoId) return new URL(`https://player.vimeo.com/video/${vimeoId}`);
  return url;
};

/**
 * The embed from what was pasted: the service's whole `<iframe …>` code (its Share › Embed) or a link. Null when it
 * isn't from one of the services above. Vimeo is asked not to track the visitor.
 */
export const toEmbed = (pasted: string): Embed | null => {
  const text = pasted.trim();
  const src = /<iframe[^>]*\ssrc\s*=\s*["']([^"']+)["']/i.exec(text)?.[1] ?? text;
  const parsed = parse(src.trim().replace(/&amp;/g, "&"));
  if (!parsed || parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.port) return null;

  const url = fromPageLink(parsed);
  const provider = EMBED_PROVIDERS.find((item) => item.isEmbedUrl(url));
  if (!provider) return null;
  if (provider.id === "vimeo") url.searchParams.set("dnt", "1");
  url.hash = "";
  return { url: url.toString(), provider };
};

/** How tall the frame is on the website. */
export const EMBED_HEIGHTS = { short: 320, medium: 450, tall: 600 } as const;

export type EmbedHeight = keyof typeof EMBED_HEIGHTS;
