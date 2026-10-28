import { Icon } from "@ttn/ui/icon";

import { getSiteSettings } from "@/features/site-settings/services/siteSettingsRepository";
import { ROUTES } from "@/lib/routes";

const LINK = "inline-flex items-center gap-1 rounded-sm font-bold text-brand underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * Under a list of reviews: how they were chosen (EU rules ask sites to say), every review on Google, and where to
 * write one (/review, from Site settings). Links that aren't set are left out.
 */
export const GoogleReviewLinks = async () => {
  const { googleReviews } = await getSiteSettings();

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-caption">
      <p className="m-0 text-muted-foreground">Real reviews, copied word for word. Each links to the original.</p>
      {googleReviews.profileUrl && (
        <a href={googleReviews.profileUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
          See all our reviews on Google
          <Icon name="open_in_new" size={16} />
        </a>
      )}
      {googleReviews.writeUrl && (
        <a href={ROUTES.review} target="_blank" rel="noopener noreferrer" className={LINK}>
          <Icon name="rate_review" size={16} />
          Write a review
        </a>
      )}
    </div>
  );
};
