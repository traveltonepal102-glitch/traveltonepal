/** The first of a row's texts that isn't empty or only spaces, trimmed: ("  ", "Sherpa villages ") → "Sherpa villages". */
export const firstText = (...values: (string | null | undefined)[]): string | undefined => values.map((value) => value?.trim()).find(Boolean);
