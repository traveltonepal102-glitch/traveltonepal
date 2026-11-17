import { z } from "zod";

import { formatStartDate } from "@/features/home/bookingMessage";

/** The longest message we pass on (WhatsApp and mail links get unwieldy beyond this). */
export const MAX_MESSAGE_LENGTH = 1000;

/** What the contact form asks; the name, email and message are needed to answer anyone. Checked before WhatsApp or the email app opens. */
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  email: z.string().trim().email("Please enter a valid email address, like anna@example.com.").max(120, "Please keep your email under 120 characters."),
  phone: z.string().trim().max(30, "Please keep your phone number under 30 characters.").regex(/^[+\d\s().-]*$/, "Please use only numbers and + ( ) - in your phone number."),
  country: z.string().trim().max(60, "Please keep the country under 60 characters."),
  trek: z.string().trim().max(120),
  startDate: z.string().trim().regex(/^(\d{4}-\d{2}-\d{2})?$/, "Please choose a date from the calendar."),
  group: z.string().trim().max(40),
  message: z.string().trim().min(10, "Please tell us a little more, at least 10 characters.").max(MAX_MESSAGE_LENGTH, `Please keep your message under ${MAX_MESSAGE_LENGTH} characters.`),
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
    "Hello! I have a question about a trek.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    ...(phone ? [`Phone: ${phone}`] : []),
    ...(country ? [`Country: ${country}`] : []),
    ...(trek ? [`Trek: ${trek}`] : []),
    ...(startDate ? [`Preferred start date: ${formatStartDate(startDate)}`] : []),
    ...(group ? [`Group: ${group}`] : []),
    "",
    message,
  ].join("\n");

/** The email's subject, naming the person so it is easy to find. */
export const contactEmailSubject = ({ name, trek }: Pick<ContactFormValues, "name" | "trek">) => `Trek enquiry from ${name}${trek ? `: ${trek}` : ""}`;
