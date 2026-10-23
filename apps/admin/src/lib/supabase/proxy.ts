import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { env } from "@/env";
import { LOGIN_PATH, REMEMBER_COOKIE } from "@/features/auth/constants";

import { authCookieOptions, readRememberChoice } from "./cookieOptions";
import type { Database } from "./database.types";

const isProduction = process.env.NODE_ENV === "production";

/**
 * Runs before every admin page: refreshes the Supabase session cookies, and sends signed-out visitors to
 * the sign-in page. It only checks that a valid session exists. Whether that user is an admin is checked
 * by requireAdmin() on every page and Server Action, which is the real gate.
 * `requestHeaders` are added to the request the page renders with (e.g. the CSP nonce).
 */
export const updateSession = async (request: NextRequest, requestHeaders: Record<string, string> = {}) => {
  // Built again after a cookie refresh, so the page sees the new cookies and the extra headers.
  const nextResponse = () => {
    const headers = new Headers(request.headers);
    Object.entries(requestHeaders).forEach(([key, value]) => headers.set(key, value));
    return NextResponse.next({ request: { headers } });
  };

  let response = nextResponse();
  const isRemembered = readRememberChoice(request.cookies.get(REMEMBER_COOKIE)?.value);

  const supabase = createServerClient<Database>(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet, headers) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = nextResponse();
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, authCookieOptions(options, isRemembered, isProduction)),
        );
        // Responses that set session cookies must never be cached (one user's session served to another).
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Verifies the session token (and refreshes it when it is about to expire).
  const { data } = await supabase.auth.getClaims();
  const isSignedIn = Boolean(data?.claims);
  const { pathname, search } = request.nextUrl;

  if (!isSignedIn && pathname !== LOGIN_PATH) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return response;
};
