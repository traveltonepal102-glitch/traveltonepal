"use server";

import { newsletterSchema } from "./schema";
import type { NewsletterResult } from "./schema";
import { requestSubscription } from "./service";

/** Server action behind the sign-up form. Validates again on the server: the browser check is only a convenience. */
export const subscribeToNewsletter = async (input: unknown): Promise<NewsletterResult> => {
  const parsed = newsletterSchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Bitte prüf deine E-Mail-Adresse." };
  }
  // A filled honeypot means a bot: report success so it learns nothing, and subscribe no one.
  if (parsed.data.website) return { status: "confirmation-sent" };
  return requestSubscription({ email: parsed.data.email, name: parsed.data.name });
};
