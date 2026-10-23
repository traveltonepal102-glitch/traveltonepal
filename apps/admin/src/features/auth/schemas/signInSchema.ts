import { z } from "zod";

/** The sign-in form as the server accepts it (checked again on the server: the browser is not trusted). */
export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  // Supabase Auth hashes at most 72 bytes; anything longer can't be a real admin password.
  password: z.string().min(1).max(72),
  remember: z.literal("on").optional(),
  next: z.string().max(2048).optional(),
});

export type SignInFields = z.output<typeof signInSchema>;

/** FormData as a plain object (a missing checkbox stays missing). */
export const signInFormValues = (formData: FormData) => ({
  email: formData.get("email") ?? "",
  password: formData.get("password") ?? "",
  remember: formData.get("remember") ?? undefined,
  next: formData.get("next") ?? undefined,
});
