import { z } from "zod";

export const newsletterSchema = z.object({
  /** Optional: Brevo greets them by it (its FIRSTNAME attribute). */
  name: z.string().trim().max(80, "That name is too long.").optional().default(""),
  email: z.string().trim().toLowerCase().max(254, "That email address is too long.").pipe(z.email({ error: "Please enter a valid email address." })),
  /** Honeypot: hidden from people, so only bots fill it in. */
  website: z.string().optional(),
});

export type NewsletterResult = { status: "confirmation-sent" } | { status: "error"; message: string };
