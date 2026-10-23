import { REGION_LIMITS } from "../constants";

/** "Nar Phu (Upper)" → "nar-phu-upper": a web address suggested from the region name. */
export const slugify = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, REGION_LIMITS.slug)
    .replace(/-+$/, "");
