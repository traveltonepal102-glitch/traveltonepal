import { IS_NEWSLETTER_CONNECTED } from "../service";
import { NewsletterSignup } from "./NewsletterSignup";

/** The footer's sign-up: shown in `pnpm dev` always, in production only once Brevo is set up (BREVO_* env). */
export const NewsletterBox = () => {
  if (!IS_NEWSLETTER_CONNECTED && process.env.NODE_ENV !== "development") return null;
  return <NewsletterSignup />;
};
