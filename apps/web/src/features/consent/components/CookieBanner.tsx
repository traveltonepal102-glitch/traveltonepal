"use client";

import { Icon } from "@ttn/ui/icon";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ROUTES } from "@/lib/routes";

import { ALL_ALLOWED, ONLY_NECESSARY } from "../consent";
import type { ConsentChoices } from "../consent";
import { saveConsent } from "../consentStore";
import { useConsent } from "../useConsent";
import { ConsentButton } from "./ConsentButton";
import { CookieSettingsDialog } from "./CookieSettingsDialog";

const LINK = "font-bold text-brand underline-offset-2 hover:underline";
const NOTE_MS = 6000;

/** What we tell the visitor after they choose (announced to screen readers too). */
const savedNote = (choices: ConsentChoices, isStored: boolean) => {
  const what = choices.externalMedia ? "Everything allowed." : "Only necessary functions are on. Maps ask before loading.";
  return isStored ? `${what} Change it any time in Cookie settings.` : `${what} Your browser blocks saving this, so we will ask again next visit.`;
};

/**
 * First-visit cookie banner (design: Cookie-banner.dc.html), with a settings window. Not modal: the page
 * stays usable, and nothing optional loads until the visitor allows it. Hidden until the browser's
 * stored choice is read, so it never flashes for visitors who already decided.
 */
export const CookieBanner = () => {
  const consent = useConsent();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  // The confirmation fades after a few seconds.
  useEffect(() => {
    if (!note) return;
    const timer = setTimeout(() => setNote(null), NOTE_MS);
    return () => clearTimeout(timer);
  }, [note]);

  const choose = (choices: ConsentChoices) => {
    setIsSettingsOpen(false);
    setNote(savedNote(choices, saveConsent(choices)));
  };

  return (
    <div className="print:hidden">
      {/* Always in the page (visually hidden while empty), so screen readers announce the note when it appears. */}
      <p
        role="status"
        className={
          note
            ? "fixed bottom-4 left-1/2 z-50 w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-xl bg-surface px-4 py-3 text-body-sm text-ink shadow-popover"
            : "sr-only"
        }
      >
        {note}
      </p>

      {consent === null && (
        <section
          aria-labelledby="cookie-banner-title"
          className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-295 rounded-2xl bg-surface p-4.5 shadow-popover md:px-6 md:py-5.5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
            <span aria-hidden="true" className="hidden size-13 flex-none items-center justify-center rounded-xl bg-brand-tint text-brand sm:inline-flex">
              <Icon name="shield_person" size={28} />
            </span>
            <div className="flex flex-1 flex-col gap-1">
              <h2 id="cookie-banner-title" className="text-lg font-extrabold">
                Your privacy, your choice
              </h2>
              <p className="text-body-sm text-text">
                We use only what is needed to run this site. With your permission we also show Google Maps. You can change
                this at any time under{" "}
                <Link href={ROUTES.cookies} className={LINK}>
                  Cookie settings
                </Link>
                . Read our{" "}
                <Link href={ROUTES.privacy} className={LINK}>
                  privacy policy
                </Link>
                .
              </p>
            </div>
            <div className="flex flex-none flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(true)}
                className="min-h-11.5 cursor-pointer rounded-md px-4 font-bold text-brand underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                Settings
              </button>
              <ConsentButton onClick={() => choose(ONLY_NECESSARY)}>Reject all</ConsentButton>
              <ConsentButton onClick={() => choose(ALL_ALLOWED)} isPrimary>
                Accept all
              </ConsentButton>
            </div>
          </div>
        </section>
      )}

      {isSettingsOpen && <CookieSettingsDialog initial={ONLY_NECESSARY} onClose={() => setIsSettingsOpen(false)} onSave={choose} />}
    </div>
  );
};
