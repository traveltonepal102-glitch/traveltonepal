import type { Metadata } from "next";

import { AuthShell } from "@/features/auth/components/AuthShell";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

/** Sign-in screen (design: Admin-login.dc.html). Design only: sign-in is not connected yet. */
const LoginPage = () => (
  <AuthShell>
    <LoginForm />
  </AuthShell>
);

export default LoginPage;
