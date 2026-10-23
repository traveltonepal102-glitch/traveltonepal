import { Icon } from "@ttn/ui/icon";
import Image from "next/image";
import type { ReactNode } from "react";

import { env } from "@/env";

import { AdminBadge } from "./AdminBadge";
import { AuthPhotoPanel } from "./AuthPhotoPanel";

type AuthShellProps = {
  children: ReactNode;
};

/**
 * Full-screen frame for the signed-out screens (design: Admin-login.dc.html): the photo panel fills
 * the left half on wide screens, the form fills the right half (no card). Phones get a navy bar
 * instead of the photo.
 */
export const AuthShell = ({ children }: AuthShellProps) => (
  <div className="min-h-dvh bg-surface">
    <div className="grid min-h-dvh lg:grid-cols-2">
      <AuthPhotoPanel />

      <div className="flex min-h-full flex-col">
        <div className="flex items-center justify-between bg-navy px-5 py-4.5 lg:hidden">
          <Image src="/brand/logo-white.svg" alt="Travel To Nepal" width={68} height={40} className="h-10 w-auto" />
          <AdminBadge />
        </div>

        <div className="flex flex-1 flex-col px-4 pt-5 pb-7 sm:px-12 sm:pt-7 sm:pb-8">
          {env.WEBSITE_URL && (
            <a
              href={env.WEBSITE_URL}
              className="inline-flex items-center gap-2 self-end rounded-sm font-semibold text-text no-underline hover:text-brand focus-visible:outline-2 focus-visible:outline-ring"
            >
              <Icon name="public" size={18} />
              View website
            </a>
          )}

          <main className="flex flex-1 items-center justify-center py-7">
            <section className="flex w-full max-w-110 flex-col gap-5">{children}</section>
          </main>

          <footer className="flex flex-wrap justify-between gap-2 text-xs text-subtle">
            <span>© {new Date().getFullYear()} Travel To Nepal · Admin portal</span>
            {/* True: every admin response sends "noindex, nofollow" (next.config.ts and the root layout). */}
            <span className="inline-flex items-center gap-1.5">
              <Icon name="lock" size={14} />
              Secure connection · not indexed by Google
            </span>
          </footer>
        </div>
      </div>
    </div>
  </div>
);
