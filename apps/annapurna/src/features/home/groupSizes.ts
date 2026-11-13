import type { HomeGroupPrice } from "./types";

/** The most travellers the booking card counts; a bigger group talks to us first. */
export const MAX_TRAVELLERS = 20;

export type GroupRange = { min: number; max: number };

/** "3–5 people" and "3 to 5" → 3 and 5, "11+ people" → 11 and up, "2 people" → 2, "Up to 4" → from the next free size to 4. */
const rangeOf = (label: string, nextFree: number): GroupRange => {
  const upTo = /up\s+to\s+(\d+)/i.exec(label);
  if (upTo) return { min: nextFree, max: Number(upTo[1]) };
  const [, first, second, plus] = /(\d+)\s*(?:(?:[–-]|to)\s*(\d+)|(\+))?/i.exec(label) ?? [];
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

/** 1 → "1 traveller", 3 → "3 travellers" */
export const travellersText = (travellers: number) => `${travellers} ${travellers === 1 ? "traveller" : "travellers"}`;

/** "Add 1 more and the price drops…" needs the next cheaper group: null when there is none. */
export const nextGroupTip = (ranges: readonly GroupRange[], prices: readonly Pick<HomeGroupPrice, "priceUsd">[], travellers: number) => {
  const next = groupIndexFor(ranges, travellers) + 1;
  const range = ranges[next];
  const price = prices[next];
  const current = prices[next - 1];
  return range && price && current && travellers < range.min && price.priceUsd < current.priceUsd ? { more: range.min - travellers, priceUsd: price.priceUsd } : null;
};
