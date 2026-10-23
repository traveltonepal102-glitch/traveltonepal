import Image from "next/image";

import { SignOutButton } from "@/features/auth/components/SignOutButton";
import { ROLE_LABELS } from "@/features/auth/constants";
import { requireAdmin } from "@/features/auth/lib/currentAdmin";

/**
 * Every signed-in screen. Layouts don't run again on every navigation, so each page and Server Action under
 * here calls requireAdmin() too; this check decides what the header shows.
 */
const PortalLayout = async ({ children }: LayoutProps<"/">) => {
  const admin = await requireAdmin();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between gap-4 border-b border-solid border-border bg-surface px-4 py-3 sm:px-6">
        <Image src="/brand/logo.svg" alt="Travel To Nepal" width={58} height={34} className="h-8.5 w-auto" />
        <div className="flex items-center gap-4">
          <div className="hidden flex-col items-end sm:flex">
            <span className="font-bold text-ink">{admin.full_name || admin.email}</span>
            <span className="text-caption text-muted-foreground">{ROLE_LABELS[admin.role]}</span>
          </div>
          <SignOutButton />
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
};

export default PortalLayout;
