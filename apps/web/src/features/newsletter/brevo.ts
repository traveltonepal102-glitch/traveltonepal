import type { NewsletterSettings } from "@/env";

/** Brevo's double opt-in: it emails the "please confirm" template and adds the address to the list only on confirm. */
export const BREVO_DOUBLE_OPT_IN_URL = "https://api.brevo.com/v3/contacts/doubleOptinConfirmation";

/** The request for one sign-up; `confirmedUrl` is where Brevo sends them after they click the confirm button. */
export const doubleOptInRequest = (email: string, settings: NewsletterSettings, confirmedUrl: string) => ({
  method: "POST",
  headers: { "api-key": settings.apiKey, "content-type": "application/json", accept: "application/json" },
  body: JSON.stringify({ email, includeListIds: [settings.listId], templateId: settings.templateId, redirectionUrl: confirmedUrl }),
});
