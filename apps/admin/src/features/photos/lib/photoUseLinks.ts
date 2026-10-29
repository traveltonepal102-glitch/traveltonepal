import { adventurePath, ADVENTURES_PATH } from "@/features/adventures/constants";
import { authorPath } from "@/features/authors/constants";
import { EDITABLE_PAGES, LEGAL_PAGES, legalPagePath, LIST_PAGES, listPagePath, pagePath, PAGES_PATH } from "@/features/pages/constants";
import { regionPath } from "@/features/regions/constants";
import { reviewPath } from "@/features/reviews/constants";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";
import { articlePath } from "@/features/travel-guides/constants";
import { guidePath } from "@/features/trekking-guides/constants";
import { trekPath } from "@/features/treks/constants";

import type { PhotoUse } from "../types";

const pageHref = (slug: string) => {
  const editable = EDITABLE_PAGES.find((page) => page.slug === slug);
  if (editable) return pagePath(editable.slug);
  const list = LIST_PAGES.find((page) => page.slug === slug);
  if (list) return listPagePath(list.slug);
  const legal = LEGAL_PAGES.find((page) => page.slug === slug);
  return legal ? legalPagePath(legal.slug) : PAGES_PATH;
};

/** The page's name as the Pages screen shows it ("About us"), else its slug. */
export const pageLabel = (slug: string) =>
  [...EDITABLE_PAGES, ...LIST_PAGES, ...LEGAL_PAGES].find((page) => page.slug === slug)?.label ?? slug;

/** Where to change the photo: the editor of what uses it. */
export const photoUseHref = ({ kind, itemId }: PhotoUse) => {
  switch (kind) {
    case "trek":
      return trekPath(itemId);
    case "region":
      return regionPath(itemId);
    case "guide":
      return articlePath(itemId);
    case "page":
      return pageHref(itemId);
    case "adventure":
      return itemId === "section" ? ADVENTURES_PATH : adventurePath(itemId);
    case "author":
      return authorPath(itemId);
    case "trekking_guide":
      return guidePath(itemId);
    case "review":
      return reviewPath(itemId);
    case "settings":
      return ADMIN_SECTIONS.settings.href;
  }
};

const PEOPLE_ROLES: Partial<Record<PhotoUse["kind"], string>> = { author: "Author", trekking_guide: "Trekking guide", review: "Reviewer" };

/** "Mardi Himal Trek · Day 3", "About us · Photo 1", "Pema Sherpa · Trekking guide". */
export const photoUseLabel = (use: PhotoUse) => {
  const name = use.kind === "page" ? pageLabel(use.itemId) : use.itemLabel;
  return `${name} · ${PEOPLE_ROLES[use.kind] ?? use.detail}`;
};
