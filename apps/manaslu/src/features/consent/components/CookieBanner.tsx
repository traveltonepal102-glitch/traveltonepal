"use client";

import { ALL_ALLOWED, ONLY_NECESSARY } from "@ttn/site-data/consent";
import type { ConsentChoices } from "@ttn/site-data/consent";
import { saveConsent } from "@ttn/site-data/consentStore";
import Link from "next/link";
import { useEffect, useState } from "react";

import { outlineButton, primaryButton } from "@/components/ui/buttonStyles";
import { ROUTES } from "@/lib/routes";

import { useConsent } from "../useConsent";

const NOTE_MS = 6000;

/** What we tell the visitor after they choose (announced to screen readers too). */
const savedNote = (choices: ConsentChoices, isStored: boolean) => {
  const what = choices.analytics ? "Everything allowed." : "Only necessary functions are on. Maps and videos ask before loading.";
  return isStored ? `${what} Change it any time in Cookie settings.` : `${what} Your browser blocks saving this, so we will ask again next visit.`;
};

/**
 * The first-visit cookie banner. Not modal: the page stays usable, and nothing optional loads until the visitor allows
 * it. Hidden until the browser's stored choice is read, so it never flashes for visitors who already decided. Single
 * choices are made on the Cookie settings page.
 */
export const CookieBanner = () => {
  const consent = useConsent();
  const [note, setNote] = useState<string | null>(null);

  // The confirmation fades after a few seconds.
  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setNote(null), NOTE_MS);
    return () => clearTimeout(timer);
  }, [note]);

  const choose = (choices: ConsentChoices) => setNote(savedNote(choices, saveConsent(choices)));

  return (
    <div className="print:hidden">
      {/* Always in the page (visually hidden while empty), so screen readers announce the note when it appears. */}
      <p
        role="status"
        className={
          note ? "fixed bottom-4 left-1/2 z-50 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl border border-solid border-line bg-snow px-4 py-3 text-[15px] leading-5.5 text-ink shadow-card" : "sr-only"
        }
      >
        {note}
      </p>

      {consent === null && (
        <section aria-labelledby="cookie-banner-h" className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-295 rounded-2xl border border-solid border-line bg-snow p-5 shadow-card md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-8">
            <div className="flex flex-1 flex-col gap-1">
              <h2 id="cookie-banner-h" className="text-xl! leading-6.5!">
                Your privacy, your choice
              </h2>
              <p className="text-[15px] leading-5.5">
                We use only what is needed to run this site. With your permission we also count page visits (Google Analytics, loaded through Google Tag Manager) and show
                maps and videos from other services. Choose one by one, or change your mind at any time, under <Link href={ROUTES.cookies}>Cookie settings</Link>. Read our{" "}
                <Link href={ROUTES.privacy}>privacy policy</Link>.
              </p>
            </div>
            <div className="flex flex-none flex-col gap-2.5 sm:flex-row">
              <button type="button" onClick={() => choose(ONLY_NECESSARY)} className={`${outlineButton} cursor-pointer`}>
                Reject all
              </button>
              <button type="button" onClick={() => choose(ALL_ALLOWED)} className={`${primaryButton} cursor-pointer border-0`}>
                Accept all
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
