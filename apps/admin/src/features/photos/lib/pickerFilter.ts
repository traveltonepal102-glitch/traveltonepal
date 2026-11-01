import type { PickerFilter } from "./pickerSearch";

/** A filter as the window's dropdown keeps it: "all", "trek:<id>" or "region:<id>". */
export const filterValue = (filter: PickerFilter) => (filter.kind === "all" ? "all" : `${filter.kind}:${filter.id}`);

/** The dropdown's choice back as a filter; anything unknown shows all photos. */
export const parseFilterValue = (value: string): PickerFilter => {
  const [kind, id] = value.split(":");
  if ((kind === "trek" || kind === "region") && id) return { kind, id };
  return { kind: "all" };
};

/** Says which search a page of results belongs to, so an old answer never replaces a newer search. */
export const searchKey = (query: string, filter: PickerFilter) => `${filterValue(filter)}|${query.trim().toLowerCase()}`;
