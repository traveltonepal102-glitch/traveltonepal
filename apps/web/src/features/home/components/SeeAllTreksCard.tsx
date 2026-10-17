import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";

/** Last card of the phone swipe row: a way on to the full Treks page. */
export const SeeAllTreksCard = () => (
  <Link
    href={ROUTES.treks}
    className="flex h-full min-h-105 flex-col items-start justify-end gap-3 rounded-xl bg-navy p-6 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <span className="inline-flex size-13 items-center justify-center rounded-full bg-saffron text-ink">
      <Icon name="hiking" size={26} />
    </span>
    <span className="font-display text-h2-sm">See all treks in Nepal</span>
    <span className="text-navy-text">Filter by region, days, difficulty and season.</span>
    <span
      aria-hidden="true"
      className="mt-1 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-white px-4.5 text-body-sm font-extrabold text-brand"
    >
      All treks
      <Icon name="arrow_forward" size={18} />
    </span>
  </Link>
);
