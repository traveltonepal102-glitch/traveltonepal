import { Icon } from "@ttn/ui/icon";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

/** "Trekked with us?": asks past trekkers for a Google review (/review). Left out until the link is in Site settings. */
export const ReviewInvite = async () => {
  const { googleReviews } = await getSiteSettings();
  if (!googleReviews.writeUrl) return null;

  return (
    <section aria-labelledby="review-invite-title" className="pb-10">
      <div className="mx-auto w-full max-w-content px-4 md:px-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-line bg-surface p-4.5 sm:flex-row sm:items-center sm:justify-between md:p-6">
          <div className="flex items-start gap-3.5">
            <span aria-hidden="true" className="inline-flex size-12 flex-none items-center justify-center rounded-xl bg-saffron-tint text-saffron-ink">
              <Icon name="rate_review" size={26} />
            </span>
            <div className="flex flex-col gap-1">
              <h2 id="review-invite-title" className="text-[22px] font-extrabold">
                Trekked with us?
              </h2>
              <p className="text-body-sm text-text">Tell other trekkers how it went. A review on Google helps them choose, and helps us.</p>
            </div>
          </div>
          <ButtonLink href={ROUTES.review} variant="secondary" icon="rate_review" shape="rounded" isExternal className="flex-none">
            Write a review on Google
          </ButtonLink>
        </div>
      </div>
    </section>
  );
};
