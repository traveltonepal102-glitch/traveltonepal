import { Icon } from "@ttn/ui/icon";

import { IS_NEWSLETTER_CONNECTED } from "../service";
import { NewsletterSignup } from "./NewsletterSignup";

type NewsletterBandProps = {
  /** Small offer above the title, e.g. "Free Langtang packing checklist". */
  badge?: string;
};

/**
 * Navy "Sign up for our newsletter" band. Shown in `pnpm dev` always, and in production only once an
 * email provider is connected, so visitors never meet a form that cannot subscribe them.
 */
export const NewsletterBand = ({ badge }: NewsletterBandProps) => {
  if (!IS_NEWSLETTER_CONNECTED && process.env.NODE_ENV !== "development") return null;

  return (
    <section
      aria-labelledby="newsletter-title"
      className="flex flex-col gap-6 rounded-xl bg-navy p-5 text-white md:flex-row md:items-center md:justify-between md:p-8"
    >
      <div className="flex max-w-140 flex-col gap-2">
        {badge && (
          <p className="inline-flex items-center gap-1.5 self-start rounded-full border border-saffron/45 bg-saffron/20 px-3 py-1 text-xs font-bold text-[#ffd08a]">
            <Icon name="backpack" size={15} />
            {badge}
          </p>
        )}
        <h2 id="newsletter-title" className="text-[22px] leading-tight font-extrabold text-white">
          Sign up for our newsletter
        </h2>
        <p className="text-caption font-normal text-navy-text">Seasonal trail updates, packing guides and new treks, about once a month.</p>
      </div>
      <NewsletterSignup />
    </section>
  );
};
