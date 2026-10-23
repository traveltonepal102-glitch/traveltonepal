import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { env } from "@/env";
import { REMEMBER_COOKIE } from "@/features/auth/constants";

import { authCookieOptions, readRememberChoice } from "./cookieOptions";
import type { Database } from "./database.types";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Supabase client for one request (Server Components and Server Actions), signed in as the visitor through
 * their session cookies. Create a new one per request; never share it.
 * `remember` overrides the stored "Keep me signed in" choice (used while signing in).
 */
export const createSupabaseServerClient = async ({ remember }: { remember?: boolean } = {}) => {
  const cookieStore = await cookies();
  const isRemembered = remember ?? readRememberChoice(cookieStore.get(REMEMBER_COOKIE)?.value);

  return createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, authCookieOptions(options, isRemembered, isProduction)),
          );
        } catch {
          // Server Components can't set cookies. Nothing is lost: proxy.ts refreshes the session cookies
          // on every request, and Server Actions (where sign-in happens) can set them.
        }
      },
    },
  });
};
