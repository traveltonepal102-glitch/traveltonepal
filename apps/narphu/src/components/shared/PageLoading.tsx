import type { ReactNode } from "react";

/**
 * The page area while a clicked link's page loads (a route's `loading.tsx`). Shown on clicks only: a direct visit
 * gets the finished page (prerendered; `[slug]` and the blog pages wait for it with `ensureStatic = "navigation"`),
 * so Google never sees it.
 */
export const PageLoading = ({ children }: { children: ReactNode }) => (
  <main id="main" aria-busy="true">
    <p role="status" className="sr-only">
      Loading the page…
    </p>
    {children}
  </main>
);
