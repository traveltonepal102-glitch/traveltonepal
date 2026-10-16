import type { ReactNode } from "react";

import { fontVariables } from "@/lib/fonts";
import "@/styles/admin.css";

type AuthShellProps = {
  children: ReactNode;
};

/** Full-screen frame for the signed-out screens; covers Payload's minimal template. */
export const AuthShell = ({ children }: AuthShellProps) => (
  <div
    className={`${fontVariables} fixed inset-0 z-50 overflow-y-auto bg-page font-sans text-body-sm text-text antialiased`}
  >
    <main className="flex min-h-full items-center justify-center px-4 py-10">
      <div className="w-full max-w-100">
        <p className="mb-6 text-center font-display text-h4 text-navy">
          Travel To Nepal <span className="font-sans text-caption text-muted-foreground">Admin</span>
        </p>
        <section className="flex flex-col gap-6 rounded-lg border border-line bg-surface p-6 shadow-card sm:p-8">
          {children}
        </section>
      </div>
    </main>
  </div>
);
