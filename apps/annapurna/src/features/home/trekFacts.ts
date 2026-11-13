import { formatDays, formatUsd } from "@/lib/format";

import type { HomeTrekCard } from "./types";

/** "12 days · Challenging · from $1,450": what's known of a trek, for a short link to it. */
export const trekFacts = ({ days, difficulty, priceFromUsd }: HomeTrekCard) =>
  [days && formatDays(days), difficulty, priceFromUsd !== null && `from ${formatUsd(priceFromUsd)}`].filter(Boolean).join(" · ");
