import { hasTrekPage } from "@/features/trek-detail/trekDetails";
import { ROUTES, trekPath } from "@/lib/routes";

/** The trek's page, or the treks list while it has none. */
export const trekHref = (slug: string) => (hasTrekPage(slug) ? trekPath(slug) : ROUTES.treks);
