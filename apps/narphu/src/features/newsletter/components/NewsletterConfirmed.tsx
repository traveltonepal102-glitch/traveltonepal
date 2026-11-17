import Link from "next/link";

import { outlineButton, primaryButton } from "@/components/ui/buttonStyles";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

/** Shown after a new subscriber clicks the confirm button in Brevo's email. */
export const NewsletterConfirmed = () => (
  <main id="main" className="wrap flex flex-col gap-4 py-16 md:py-24">
    <span aria-hidden="true" className="inline-flex size-14 items-center justify-center rounded-2xl bg-saffron-tint text-maroon">
      <TrailIcon name="check" size={28} />
    </span>
    <h1>You&apos;re subscribed</h1>
    <p className="text-lg leading-7.5">
      Thank you for confirming. We&apos;ll send you news from the Nar Phu valley a few times a year: the season, Kang La Pass and new treks. Every email has an
      unsubscribe link, so you can leave any time.
    </p>
    <div className="actions pt-1.5">
      <Link href={ROUTES.home} className={primaryButton}>
        See the Nar Phu trek
      </Link>
      <Link href={ROUTES.blogs} className={outlineButton}>
        Read the blog
      </Link>
    </div>
  </main>
);
