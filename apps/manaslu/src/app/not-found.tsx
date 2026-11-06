import Link from "next/link";

import { primaryButton } from "@/components/ui/buttonStyles";
import { ROUTES } from "@/lib/routes";

/** A page that doesn't exist. */
const NotFound = () => (
  <main className="wrap flex flex-col items-start gap-4 py-24">
    <span className="eyebrow">Page not found</span>
    <h1>This trail doesn’t go anywhere</h1>
    <p>The page may have moved. The home page has the trek, its prices and how to reach us.</p>
    <Link href={ROUTES.home} className={primaryButton}>
      Back to the home page
    </Link>
  </main>
);

export default NotFound;
