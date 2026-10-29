"use client";

import { useState } from "react";

import { ALL_ALLOWED, ONLY_NECESSARY } from "../consent";
import type { ConsentChoices } from "../consent";
import { saveConsent } from "../consentStore";
import { useConsent } from "../useConsent";
import { ConsentButton } from "./ConsentButton";
import { ConsentOptions } from "./ConsentOptions";

/** "Your current choices" on the Cookie settings page: the stored choice, editable, saved on the buttons. */
export const CookieSettingsPanel = () => {
  const consent = useConsent();
  // The visitor's edits; until they touch a switch, the panel shows what is stored.
  const [draft, setDraft] = useState<ConsentChoices | null>(null);
  const [status, setStatus] = useState("");
  const shown = draft ?? (consent ? { analytics: consent.analytics, externalMedia: consent.externalMedia } : ONLY_NECESSARY);

  const save = (choices: ConsentChoices) => {
    const isStored = saveConsent(choices);
    setDraft(null);
    setStatus(isStored ? "Saved. Your choices apply right away." : "Applied for this visit. Your browser blocks saving it, so we will ask again next time.");
  };

  return (
    <section aria-labelledby="cookie-choices-title" className="overflow-hidden rounded-2xl border border-[#d3e3f1] bg-[#f4f8fc] print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-5 py-4">
        <h2 id="cookie-choices-title" className="text-lg font-bold">
          Your current choices
        </h2>
        <p className="text-xs text-muted-foreground">
          {consent === null ? "You have not chosen yet: only necessary functions are on." : "Changes apply right away"}
        </p>
      </div>
      <div className="px-3 pb-3 md:px-4">
        <ConsentOptions
          choices={shown}
          onChange={(choices) => {
            setDraft(choices);
            setStatus("");
          }}
        />
      </div>
      <div className="flex flex-col gap-2.5 border-t border-[#d3e3f1] px-5 py-3.5">
        <div className="grid gap-2 sm:grid-cols-3">
          <ConsentButton onClick={() => save(ONLY_NECESSARY)}>Reject all</ConsentButton>
          <ConsentButton onClick={() => save(ALL_ALLOWED)}>Accept all</ConsentButton>
          <ConsentButton onClick={() => save(shown)} isPrimary>
            Save my choices
          </ConsentButton>
        </div>
        <p role="status" className="text-caption font-semibold text-whatsapp">
          {status}
        </p>
      </div>
    </section>
  );
};
