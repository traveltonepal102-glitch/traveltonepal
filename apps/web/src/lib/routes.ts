/** Top-level website paths, one place so links and active states agree. */
export const ROUTES = {
  home: "/",
  treks: "/treks",
  regions: "/regions",
  guides: "/travel-guides",
  about: "/about",
  contact: "/contact",
  german: "/de",
} as const;

export const trekPath = (slug: string) => `${ROUTES.treks}/${slug}`;
export const regionPath = (slug: string) => `${ROUTES.regions}/${slug}`;
export const guidePath = (slug: string) => `${ROUTES.guides}/${slug}`;

/** True when `pathname` is `section` or a page under it ("/treks" matches "/treks/everest-base-camp"). */
export const isInSection = (pathname: string, section: string) =>
  pathname === section || pathname.startsWith(`${section}/`);
