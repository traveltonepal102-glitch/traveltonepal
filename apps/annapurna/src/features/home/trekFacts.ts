import { formatDays, formatPrice } from "@/lib/format";

import type { HomeTrekCard } from "./types";

/** "12 Tage · Anspruchsvoll · ab 1.450 €": what's known of a trek, for a short link to it. */
export const trekFacts = ({ days, difficulty, priceFrom, currency }: HomeTrekCard) =>
  [days && formatDays(days), difficulty, priceFrom !== null && `ab ${formatPrice(priceFrom, currency)}`].filter(Boolean).join(" · ");
