import { z } from "zod";

/** How many photos the "Choose a photo" window shows at a time ("Load more" asks for the next ones). */
export const PICKER_PAGE_SIZE = 40;
export const PICKER_QUERY_MAX = 80;
/** Far past any real library; stops a runaway "Load more". */
const MAX_OFFSET = 10_000;

const id = z.uuid("Pick the filter again.");

/** What the window asks the library for: the words typed, one filter, and how many photos it already shows. */
export const pickerSearchSchema = z.object({
  query: z.string().trim().max(PICKER_QUERY_MAX, `Search for up to ${PICKER_QUERY_MAX} characters.`),
  filter: z.discriminatedUnion("kind", [
    z.object({ kind: z.literal("all") }),
    z.object({ kind: z.literal("region"), id }),
    z.object({ kind: z.literal("trek"), id }),
  ]),
  offset: z.number().int().min(0).max(MAX_OFFSET),
});

export type PickerSearch = z.infer<typeof pickerSearchSchema>;
export type PickerFilter = PickerSearch["filter"];

/** The page's rows when one more than a page was asked for: that extra row only says there are more. */
export const toPage = <Row>(rows: Row[], pageSize = PICKER_PAGE_SIZE) => ({
  rows: rows.slice(0, pageSize),
  hasMore: rows.length > pageSize,
});

/** The badge on a photo: "Not used yet", "Used in 1 place", "Used in 3 places". */
export const usageLabel = (count: number) => (count ? `Used in ${count} ${count === 1 ? "place" : "places"}` : "Not used yet");
