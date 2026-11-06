"use client";

import { primaryButton } from "@/components/ui/buttonStyles";

/** A page that couldn't load (usually the database, for a moment). */
const ErrorPage = ({ reset }: { reset: () => void }) => (
  <main className="wrap flex flex-col items-start gap-4 py-24">
    <span className="eyebrow">Something went wrong</span>
    <h1>This page didn’t load</h1>
    <p>Please try again in a moment.</p>
    <button type="button" onClick={reset} className={`${primaryButton} cursor-pointer`}>
      Try again
    </button>
  </main>
);

export default ErrorPage;
