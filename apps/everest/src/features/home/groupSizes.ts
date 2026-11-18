import type { HomeGroupPrice } from "./types";

/** The most travellers the booking card counts; a bigger group talks to us first. */
export const MAX_TRAVELLERS = 20;

export type GroupRange = { min: number; max: number };

/**
 * "3–5 Personen", "3 bis 5" and "3 to 5" → 3 and 5, "11+ Personen" and "ab 11" → 11 and up, "2 Personen" → 2,
 * "bis 4" and "Up to 4" → from the next free size to 4. The labels are typed in the admin, in German or English.
 */
const rangeOf = (label: string, nextFree: number): GroupRange => {
  const from = /\bab\s+(\d+)/i.exec(label);
  if (from) return { min: Number(from[1]), max: MAX_TRAVELLERS };
  const upTo = /(?:up\s+to|^\s*bis)\s+(\d+)/i.exec(label);
  if (upTo) return { min: nextFree, max: Number(upTo[1]) };
  const [, first, second, plus] = /(\d+)\s*(?:(?:[–-]|to|bis)\s*(\d+)|(\+))?/i.exec(label) ?? [];
  if (!first) return { min: nextFree, max: nextFree };
  if (plus) return { min: Number(first), max: MAX_TRAVELLERS };
  return { min: Number(first), max: Number(second ?? first) };
};

/** How many travellers each group price is for, read from its label; a label without a number follows the one before. */
export const groupRanges = (prices: readonly Pick<HomeGroupPrice, "label">[]) =>
  prices.reduce<GroupRange[]>((ranges, price) => [...ranges, rangeOf(price.label, (ranges.at(-1)?.max ?? 0) + 1)], []);

/**
 * The group price for this many travellers: the biggest group they are enough for, so a gap between the labels never
 * quotes less than a smaller group pays. Fewer than the smallest group pay its price.
 */
export const groupIndexFor = (ranges: readonly GroupRange[], travellers: number) =>
  Math.max(0, ranges.findLastIndex((range) => travellers >= range.min));

/** 1 → "1 Person", 3 → "3 Personen" */
export const travellersText = (travellers: number) => `${travellers} ${travellers === 1 ? "Person" : "Personen"}`;

/** "Add 1 more and the price drops…" needs the next cheaper group: null when there is none. */
export const nextGroupTip = (ranges: readonly GroupRange[], prices: readonly Pick<HomeGroupPrice, "price" | "currency">[], travellers: number) => {
  const next = groupIndexFor(ranges, travellers) + 1;
  const range = ranges[next];
  const price = prices[next];
  const current = prices[next - 1];
  return range && price && current && travellers < range.min && price.price < current.price ? { more: range.min - travellers, price: price.price, currency: price.currency } : null;
};
