"use client";

import { ONLY_NECESSARY } from "@ttn/site-data/consent";
import type { ConsentChoices } from "@ttn/site-data/consent";
import { saveConsent } from "@ttn/site-data/consentStore";
import { useId, useState } from "react";

import { useConsent } from "../useConsent";

/** Only what this website really loads has a choice: it has no analytics, so that stays off (add it here, and a banner, with them). */
const ALLOW_MEDIA: ConsentChoices = { analytics: false, externalMedia: true };

const BUTTON = "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-[10px] border-[1.5px] border-solid border-navy px-4 text-[15px] font-semibold";

type ConsentRowProps = { name: string; text: string; isOn: boolean; onToggle?: () => void };

/** One kind of cookie with its switch; without `onToggle` it is always on. */
const ConsentRow = ({ name, text, isOn, onToggle }: ConsentRowProps) => {
  const nameId = useId();
  const textId = useId();
  return (
    <li className="flex items-start justify-between gap-4 bg-snow px-5 py-4">
      <span className="flex flex-col gap-0.5">
        <span id={nameId} className="font-semibold text-ink">
          {name}
        </span>
        <span id={textId} className="text-[15px] leading-5.5">
          {text}
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-labelledby={nameId}
        aria-describedby={textId}
        aria-disabled={onToggle ? undefined : true}
        onClick={onToggle}
        className={`relative mt-0.5 h-7 w-12 flex-none rounded-full border-0 ${isOn ? "bg-navy" : "bg-field"} ${onToggle ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
      >
        <span aria-hidden="true" className={`absolute top-0.5 size-6 rounded-full bg-snow shadow-card transition-[left] motion-reduce:transition-none ${isOn ? "left-5.5" : "left-0.5"}`} />
      </button>
    </li>
  );
};

/** "Your current choices" on the Cookie settings page: the stored choice, editable, saved on the buttons. */
export const CookieSettingsPanel = () => {
  const consent = useConsent();
  // The visitor's edit; until they touch the switch, the panel shows what is stored.
  const [draft, setDraft] = useState<ConsentChoices | null>(null);
  const [status, setStatus] = useState("");
  const shown = draft ?? (consent ? { analytics: false, externalMedia: consent.externalMedia } : ONLY_NECESSARY);

  const save = (choices: ConsentChoices) => {
    const isStored = saveConsent(choices);
    setDraft(null);
    setStatus(isStored ? "Saved. Your choice applies right away." : "Applied for this visit. Your browser blocks saving it, so we will ask again next time.");
  };

  return (
    <section aria-labelledby="cookie-choices-h" className="overflow-hidden rounded-[14px] border border-solid border-line bg-cloud print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 py-4">
        <h2 id="cookie-choices-h" className="text-xl! leading-6.5!">
          Your current choices
        </h2>
        <p className="text-sm leading-5 text-muted">{consent === null ? "You have not chosen yet: only necessary functions are on." : "Changes apply right away"}</p>
      </div>
      <ul className="divide-y divide-solid divide-line border-y border-solid border-line">
        <ConsentRow name="Necessary" text="Keeps the site working and remembers this choice. Always on." isOn />
        <ConsentRow
          name="External media"
          text="The office map on the Contact page, and videos and embeds in blogs. They send data to Google or another service when they load, so without this each one asks first. Route maps on trek pages always load."
          isOn={shown.externalMedia}
          onToggle={() => {
            setDraft({ analytics: false, externalMedia: !shown.externalMedia });
            setStatus("");
          }}
        />
      </ul>
      <div className="flex flex-col gap-2.5 px-5 py-4">
        <div className="grid gap-2 sm:grid-cols-3">
          <button type="button" onClick={() => save(ONLY_NECESSARY)} className={`${BUTTON} bg-transparent text-navy`}>
            Reject all
          </button>
          <button type="button" onClick={() => save(ALLOW_MEDIA)} className={`${BUTTON} bg-transparent text-navy`}>
            Accept all
          </button>
          <button type="button" onClick={() => save(shown)} className={`${BUTTON} bg-navy text-snow`}>
            Save my choices
          </button>
        </div>
        <p role="status" className="text-[15px] leading-5.5 font-semibold text-navy">
          {status}
        </p>
      </div>
    </section>
  );
};
