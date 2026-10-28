import "server-only";

import { newsletterSettings } from "@/env";
import { ROUTES } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

import { BREVO_DOUBLE_OPT_IN_URL, doubleOptInRequest } from "./brevo";
import type { NewsletterResult } from "./schema";

/**
 * True once Brevo is set up (BREVO_* in the website's env). Until then the sign-up only shows in `pnpm dev`, so
 * production never offers a form that cannot subscribe anyone.
 */
export const IS_NEWSLETTER_CONNECTED = newsletterSettings !== null;

const NOT_SENT: NewsletterResult = { status: "error", message: "We couldn't send the confirmation email. Please try again in a moment." };

/** How long a visitor waits for Brevo before seeing "try again". */
const BREVO_TIMEOUT_MS = 10_000;

/** The address, without the name before the @ (kept out of logs). */
const masked = (email: string) => email.replace(/^(.).*@/, "$1***@");

/**
 * Starts double opt-in (GDPR): Brevo emails the "please confirm" template and adds the address to the list only
 * once its link is clicked. An address already on the list gets the same answer, so the form never tells anyone
 * who is subscribed.
 */
export const requestSubscription = async (email: string): Promise<NewsletterResult> => {
  if (!newsletterSettings) {
    console.error(`Newsletter sign-up for ${masked(email)} failed: Brevo is not set up.`);
    return { status: "error", message: "Sign-up is not open yet. Please try again soon." };
  }

  try {
    const response = await fetch(BREVO_DOUBLE_OPT_IN_URL, {
      ...doubleOptInRequest(email, newsletterSettings, absoluteUrl(ROUTES.newsletterConfirmed)),
      signal: AbortSignal.timeout(BREVO_TIMEOUT_MS),
    });
    if (response.ok) return { status: "confirmation-sent" };

    const problem = await response.text().catch(() => "");
    console.error(`Newsletter sign-up for ${masked(email)} failed: Brevo answered ${response.status} ${problem.slice(0, 300)}`);
    return NOT_SENT;
  } catch (error) {
    console.error(`Newsletter sign-up for ${masked(email)} failed:`, error);
    return NOT_SENT;
  }
};
