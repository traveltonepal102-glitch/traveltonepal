import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { REMEMBERED_EMAIL_COOKIE } from "@/features/auth/constants";
import { getCurrentAdmin } from "@/features/auth/lib/currentAdmin";
import { getSafeRedirectPath } from "@/features/auth/lib/redirectTarget";
import { readRememberedEmail } from "@/features/auth/lib/rememberedEmail";

export const metadata: Metadata = { title: "Sign in" };

/** Sign-in screen (design: Admin-login.dc.html). Admins who are already signed in go straight on. */
const LoginPage = async ({ searchParams }: PageProps<"/login">) => {
  const redirectTo = getSafeRedirectPath((await searchParams).next);
  if (await getCurrentAdmin()) redirect(redirectTo);

  const rememberedEmail = readRememberedEmail((await cookies()).get(REMEMBERED_EMAIL_COOKIE)?.value);

  return (
    <AuthShell>
      <LoginForm redirectTo={redirectTo} rememberedEmail={rememberedEmail} />
    </AuthShell>
  );
};

export default LoginPage;
