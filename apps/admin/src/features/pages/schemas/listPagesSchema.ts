import { z } from "zod";

import { LIST_PAGES } from "../constants";
import type { ListPagesValues } from "../types";
import { pageTopFields, readPageTop } from "./pageTopSchema";

const listPage = z.object(pageTopFields);

/** Pages › List pages, checked on the server before saving: the four pages' tops and Google results. */
export const listPagesSchema = z.object({
  home: listPage,
  treks: listPage,
  regions: listPage,
  "travel-guides": listPage,
}) satisfies z.ZodType<ListPagesValues, unknown>;

/** The list editor's FormData: each page's fields start with its slug ("treks.heading"). */
export const readListPagesForm = (formData: FormData) =>
  Object.fromEntries(LIST_PAGES.map((page) => [page.slug, readPageTop(formData, `${page.slug}.`)]));
