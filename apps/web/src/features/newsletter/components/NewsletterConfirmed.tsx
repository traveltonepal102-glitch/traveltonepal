import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/routes";

/** Shown after a new subscriber clicks the confirm button in Brevo's email. */
export const NewsletterConfirmed = () => (
  <main className="flex-1 bg-surface">
    <div className="mx-auto flex max-w-content flex-col gap-4 px-4 pt-10 pb-16 md:px-6 md:pt-14 md:pb-24">
      <span aria-hidden="true" className="inline-flex size-14 items-center justify-center rounded-xl bg-green-tint text-whatsapp">
        <Icon name="mark_email_read" size={30} />
      </span>
      <h1 className="max-w-155 text-h1-sm md:text-h1">You&apos;re subscribed</h1>
      <p className="max-w-155 text-body-lg">
        Thank you for confirming. We&apos;ll send you trail updates, packing guides and new treks now and then. Every email has an
        unsubscribe link, so you can leave any time.
      </p>
      <div className="flex flex-wrap gap-2.5 pt-1.5">
        <ButtonLink href={ROUTES.treks} variant="primary" icon="hiking" className="max-md:w-full">
          Browse treks
        </ButtonLink>
        <ButtonLink href={ROUTES.home} variant="secondary" className="max-md:w-full">
          Back to the home page
        </ButtonLink>
      </div>
    </div>
  </main>
);
