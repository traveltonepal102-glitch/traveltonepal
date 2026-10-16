import { redirect } from "next/navigation";
import type { AdminViewServerProps } from "payload";

import { AuthShell } from "./AuthShell";
import { LoginForm } from "./LoginForm";

/** Only same-site admin paths are allowed after login (no open redirect). */
const getRedirectTarget = (value: unknown, adminRoute: string) => {
  if (typeof value !== "string") return adminRoute;
  const isAdminPath = value === adminRoute || value.startsWith(`${adminRoute}/`);
  return isAdminPath && !value.includes("//") ? value : adminRoute;
};

/** Replaces Payload's login screen (payload.config.ts → admin.components.views.login). */
export const LoginView = ({ initPageResult, searchParams }: AdminViewServerProps) => {
  const { req } = initPageResult;
  const { admin: adminRoute, api: apiRoute } = req.payload.config.routes;
  const redirectTo = getRedirectTarget(searchParams?.redirect, adminRoute);

  if (req.user) redirect(redirectTo);

  return (
    <AuthShell>
      <LoginForm loginUrl={`${apiRoute}/${req.payload.config.admin.user}/login`} redirectTo={redirectTo} />
    </AuthShell>
  );
};
