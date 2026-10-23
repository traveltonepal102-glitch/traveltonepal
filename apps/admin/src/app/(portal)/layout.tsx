import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import Link from "next/link";

import { LOGIN_PATH } from "@/features/auth/constants";

// Placeholder details until sign-in is connected (design only, no real account).
const PLACEHOLDER_ADMIN = { name: "[Admin name]", role: "Super admin" };

/** Header for the signed-in screens. Static for now: there is no sign-in check yet. */
const PortalLayout = ({ children }: LayoutProps<"/">) => (
  <div className="flex min-h-dvh flex-col">
    <header className="flex items-center justify-between gap-4 border-b border-solid border-border bg-surface px-4 py-3 sm:px-6">
      <Image src="/brand/logo.svg" alt="Travel To Nepal" width={58} height={34} className="h-8.5 w-auto" />
      <div className="flex items-center gap-4">
        <div className="hidden flex-col items-end sm:flex">
          <span className="font-bold text-ink">{PLACEHOLDER_ADMIN.name}</span>
          <span className="text-caption text-muted-foreground">{PLACEHOLDER_ADMIN.role}</span>
        </div>
        <Link
          href={LOGIN_PATH}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-solid border-border bg-surface px-3.5 font-semibold text-ink no-underline hover:bg-page focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <Icon name="logout" size={18} />
          Sign out
        </Link>
      </div>
    </header>
    <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
  </div>
);

export default PortalLayout;
