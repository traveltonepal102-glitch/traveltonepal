import type { ReactNode } from "react";

type PageLoadingProps = {
  children: ReactNode;
  /** The page's own ground, as on its `<main>`. */
  className?: string;
};

/**
 * The page area while a clicked link's page loads (a route's `loading.tsx`). Shown on clicks only: a direct visit
 * gets the finished page (prerendered; detail routes wait for it with `ensureStatic = "navigation"`), so Google never
 * sees it.
 */
export const PageLoading = ({ children, className = "bg-page" }: PageLoadingProps) => (
  <main aria-busy="true" className={`flex-1 ${className}`}>
    <p role="status" className="sr-only">
      Loading the page…
    </p>
    {children}
  </main>
);
