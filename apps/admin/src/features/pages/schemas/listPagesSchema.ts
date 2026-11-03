import { z } from "zod";

import type { ListPage } from "../constants";
import { LIST_PAGES } from "../constants";
import type { ListPagesValues } from "../types";
import { pageTopFields, readPageTop } from "./pageTopSchema";

const listPage = z.object(pageTopFields);

/** Pages › List pages of a site (listPagesFor), checked on the server before saving: each page's top and Google result. */
export const listPagesSchemaFor = (pages: readonly ListPage[] = LIST_PAGES) =>
  z.object(Object.fromEntries(pages.map((page) => [page.slug, listPage]))) satisfies z.ZodType<ListPagesValues, unknown>;

/** The list editor's FormData: each page's fields start with its slug ("treks.heading"). */
export const readListPagesForm = (formData: FormData, pages: readonly ListPage[] = LIST_PAGES) =>
  Object.fromEntries(pages.map((page) => [page.slug, readPageTop(formData, `${page.slug}.`)]));
