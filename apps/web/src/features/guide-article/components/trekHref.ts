import type { TrekSummary } from "@/features/treks/types";
import { ROUTES, trekPath } from "@/lib/routes";

/** The trek's page, or the treks list while it has none. */
export const trekHref = (trek: Pick<TrekSummary, "slug" | "hasPage">) => (trek.hasPage ? trekPath(trek.slug) : ROUTES.treks);
