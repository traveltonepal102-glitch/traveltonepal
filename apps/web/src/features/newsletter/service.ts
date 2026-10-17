import "server-only";

import type { NewsletterResult } from "./schema";

/**
 * True once an email provider is connected. Until then the sign-up only shows in `pnpm dev`, so
 * production never offers a form that cannot subscribe anyone.
 */
export const IS_NEWSLETTER_CONNECTED = false;

/**
 * Starts double opt-in: the provider stores the address as pending and sends the confirmation email
 * (GDPR). TODO(owner): choose the provider (e.g. Brevo, Mailchimp or a Payload collection + Resend).
 */
export const requestSubscription = async (email: string): Promise<NewsletterResult> => {
  console.error(`Newsletter sign-up for ${email.replace(/^(.).*@/, "$1***@")} failed: no email provider is connected.`);
  return { status: "error", message: "Sign-up is not open yet. Please try again soon." };
};
