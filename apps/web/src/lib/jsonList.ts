import type { z } from "zod";

/**
 * A JSON list from the database, item by item: items that don't fit the schema are left out, so one broken
 * item never empties the whole section. Anything other than a list is an empty list.
 */
export const listOf = <T>(value: unknown, item: z.ZodType<T>): T[] =>
  Array.isArray(value) ? value.flatMap((entry) => item.safeParse(entry).data ?? []) : [];
