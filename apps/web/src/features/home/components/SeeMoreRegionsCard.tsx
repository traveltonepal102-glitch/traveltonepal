import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { ROUTES } from "@/lib/routes";

import { moreRegionsText } from "../homeContent";

/** Said when every region already shows on the home page. */
const COMPARE_TEXT =
  "Compare every region on one map, with how hard each one is.";

/**
 * The last place in the home regions grid, always there: the way on to the Regions page, naming the regions the
 * grid leaves out (if any).
 */
export const SeeMoreRegionsCard = ({ names }: { names: readonly string[] }) => (
  <Link
    href={ROUTES.regions}
    className="group flex h-full flex-col justify-center gap-2.5 rounded-xl border-4 border-dashed border-line-strong bg-surface p-6 text-text hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    <span
      aria-hidden="true"
      className="inline-flex size-11 items-center justify-center rounded-lg bg-brand-tint text-brand"
    >
      <Icon name="travel_explore" size={24} />
    </span>
    <span className="font-display text-h3 text-ink">See more regions</span>
    <span className="text-body-sm text-muted-foreground">
      {moreRegionsText(names) || COMPARE_TEXT}
    </span>
    <span className="inline-flex items-center gap-1.5 font-bold text-brand">
      All regions
      <Icon
        name="arrow_forward"
        size={18}
        className="transition-transform group-hover:translate-x-0.5"
      />
    </span>
  </Link>
);
