"use client";

import { primaryButton } from "@/components/ui/buttonStyles";

/** A page that couldn't load (usually the database, for a moment). */
const ErrorPage = ({ reset }: { reset: () => void }) => (
  <main className="wrap flex flex-col items-start gap-4 py-24">
    <span className="eyebrow">Etwas ist schiefgelaufen</span>
    <h1>Diese Seite konnte nicht geladen werden</h1>
    <p>Bitte versuchen Sie es gleich noch einmal.</p>
    <button type="button" onClick={reset} className={`${primaryButton} cursor-pointer`}>
      Erneut versuchen
    </button>
  </main>
);

export default ErrorPage;
