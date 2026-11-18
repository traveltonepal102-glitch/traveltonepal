import { z } from "zod";

export const newsletterSchema = z.object({
  /** Optional: Brevo greets them by it (its FIRSTNAME attribute). */
  name: z.string().trim().max(80, "Dieser Name ist zu lang.").optional().default(""),
  email: z.string().trim().toLowerCase().max(254, "Diese E-Mail-Adresse ist zu lang.").pipe(z.email({ error: "Bitte gib eine gültige E-Mail-Adresse ein." })),
  /** Honeypot: hidden from people, so only bots fill it in. */
  website: z.string().optional(),
});

export type NewsletterResult = { status: "confirmation-sent" } | { status: "error"; message: string };
