import { AuthHeading } from "./AuthHeading";
import { AuthShell } from "./AuthShell";

/** Replaces Payload's "create first user" form: the admin is created by the developer script only. */
export const NoAdminView = () => (
  <AuthShell>
    <AuthHeading
      title="No admin account yet"
      description="The admin account is created by the developer, not on this page."
    />
    <code className="rounded-md bg-muted px-3 py-2 font-mono text-body-sm break-all text-ink">
      pnpm --filter admin admin:reset owner@example.com
    </code>
  </AuthShell>
);
