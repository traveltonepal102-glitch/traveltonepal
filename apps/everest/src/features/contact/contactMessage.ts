import { z } from "zod";

import { formatStartDate } from "@/features/home/bookingMessage";

/** The longest message we pass on (WhatsApp and mail links get unwieldy beyond this). */
export const MAX_MESSAGE_LENGTH = 1000;

/** What the contact form asks; the name, email and message are needed to answer anyone. Checked before WhatsApp or the email app opens. */
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Bitte gib deinen Namen ein.").max(80, "Dein Name darf höchstens 80 Zeichen lang sein."),
  email: z.string().trim().email("Bitte gib eine gültige E-Mail-Adresse ein, z. B. anna@example.com.").max(120, "Deine E-Mail-Adresse darf höchstens 120 Zeichen lang sein."),
  phone: z.string().trim().max(30, "Deine Telefonnummer darf höchstens 30 Zeichen lang sein.").regex(/^[+\d\s().-]*$/, "Bitte verwende für die Telefonnummer nur Ziffern und + ( ) -."),
  country: z.string().trim().max(60, "Das Land darf höchstens 60 Zeichen lang sein."),
  trek: z.string().trim().max(120),
  startDate: z.string().trim().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Bitte wähle ein Datum im Kalender aus."),
  group: z.string().trim().max(40),
  message: z.string().trim().min(10, "Bitte schreib uns etwas mehr, mindestens 10 Zeichen.").max(MAX_MESSAGE_LENGTH, `Deine Nachricht darf höchstens ${MAX_MESSAGE_LENGTH} Zeichen lang sein.`),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

/** The form's values when they are all right, else the first problem with each field. */
export const checkContactForm = (values: Record<string, unknown>): { values: ContactFormValues; errors?: undefined } | { values?: undefined; errors: ContactFieldErrors } => {
  const result = contactFormSchema.safeParse(values);
  if (result.success) return { values: result.data };
  const errors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as keyof ContactFormValues;
    errors[field] ??= issue.message;
  }
  return { errors };
};

/** The filled-in form as the message we receive on WhatsApp or by email: blank fields are left out. */
export const buildContactMessage = ({ name, email, phone, country, trek, startDate, group, message }: ContactFormValues) =>
  [
    "Hallo! Ich habe eine Frage zu einem Trek.",
    "",
    `Name: ${name}`,
    `E-Mail: ${email}`,
    ...(phone ? [`Telefon: ${phone}`] : []),
    ...(country ? [`Land: ${country}`] : []),
    ...(trek ? [`Trek: ${trek}`] : []),
    ...(startDate ? [`Gewünschtes Startdatum: ${formatStartDate(startDate)}`] : []),
    ...(group ? [`Gruppe: ${group}`] : []),
    "",
    message,
  ].join("\n");

/** The email's subject, naming the person so it is easy to find. */
export const contactEmailSubject = ({ name, trek }: Pick<ContactFormValues, "name" | "trek">) => `Trek-Anfrage von ${name}${trek ? `: ${trek}` : ""}`;
