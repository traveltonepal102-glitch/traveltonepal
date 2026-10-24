const COUNT_WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"];

/** Small counts in words for headings: 6 → "six", 12 → "12" */
export const formatCountWord = (count: number) => COUNT_WORDS[count] ?? String(count);

/** A counted noun: (1, "trek") → "1 trek", (4, "trek") → "4 treks" */
export const formatCount = (count: number, singular: string, plural = `${singular}s`) => `${count} ${count === 1 ? singular : plural}`;

/** "nine regions" → "Nine regions" */
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
