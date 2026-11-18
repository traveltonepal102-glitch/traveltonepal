"use client";

import { ALL_ALLOWED, ONLY_NECESSARY } from "@ttn/site-data/consent";
import type { ConsentChoices } from "@ttn/site-data/consent";
import { saveConsent } from "@ttn/site-data/consentStore";
import { useId, useState } from "react";

import { TrailIcon } from "@/components/ui/TrailIcon";

import { useConsent } from "../useConsent";

const BUTTON = "inline-flex min-h-12 cursor-pointer items-center justify-center rounded-full px-5 text-[15px] font-bold";
const QUIET = `${BUTTON} border-[1.5px] border-solid border-white/45 bg-transparent text-snow hover:bg-white/10`;

type ConsentRowProps = { name: string; text: string; isOn: boolean; onToggle?: () => void };

/** One kind of cookie with its switch; without `onToggle` it is always on ("Immer aktiv"). */
const ConsentRow = ({ name, text, isOn, onToggle }: ConsentRowProps) => {
  const nameId = useId();
  const textId = useId();
  return (
    <li className="flex items-start justify-between gap-5 border-0 border-t border-solid border-white/15 py-5">
      <span className="flex flex-col gap-1.5">
        <span id={nameId} className="font-display text-[19px] leading-6 font-bold text-snow">
          {name}
        </span>
        <span id={textId} className="text-[15px] leading-6 text-on-ocean-muted">
          {text}
        </span>
      </span>
      {onToggle ? (
        <button
          type="button"
          role="switch"
          aria-checked={isOn}
          aria-labelledby={nameId}
          aria-describedby={textId}
          onClick={onToggle}
          className={`relative mt-0.5 h-8 w-14 flex-none cursor-pointer rounded-full border-[1.5px] border-solid ${isOn ? "border-glacier bg-glacier" : "border-white/45 bg-white/12"}`}
        >
          <span aria-hidden="true" className={`absolute top-0.5 size-6 rounded-full bg-snow shadow-card transition-[left] motion-reduce:transition-none ${isOn ? "left-6.5" : "left-0.5"}`} />
        </button>
      ) : (
        <span className="inline-flex h-8 flex-none items-center gap-1.5 rounded-full bg-white/12 px-3 text-[13px] font-bold text-on-ocean-muted">
          <TrailIcon name="lock" size={14} />
          Immer aktiv
        </span>
      )}
    </li>
  );
};

/** "Deine Auswahl" on the Cookie settings page (design: Cookies, the dark panel): the stored choice, editable, saved on the buttons. */
export const CookieSettingsPanel = () => {
  const consent = useConsent();
  // The visitor's edit; until they touch the switch, the panel shows what is stored.
  const [draft, setDraft] = useState<ConsentChoices | null>(null);
  const [status, setStatus] = useState("");
  const shown = draft ?? (consent ? { analytics: consent.analytics, externalMedia: consent.externalMedia } : ONLY_NECESSARY);

  const save = (choices: ConsentChoices) => {
    const isStored = saveConsent(choices);
    setDraft(null);
    setStatus(isStored ? "Gespeichert. Deine Auswahl gilt sofort." : "Für diesen Besuch übernommen. Dein Browser verhindert das Speichern, daher fragen wir beim nächsten Mal erneut.");
  };

  return (
    <section aria-labelledby="cookie-choices-h" className="rounded-[28px] bg-ink p-6 text-on-ocean-muted shadow-raised sm:p-8 print:hidden">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="cookie-choices-h" className="text-[28px]! leading-8.5! font-extrabold text-snow">
          Deine Auswahl
        </h2>
        <p className="text-sm leading-5">{consent === null ? "Du hast noch nicht gewählt: Nur Notwendiges ist aktiv." : "Änderungen gelten sofort"}</p>
      </div>
      <ul className="m-0 mt-4 list-none p-0">
        <ConsentRow name="Notwendig" text="Hält die Website am Laufen und speichert diese Auswahl." isOn />
        <ConsentRow
          name="Analyse"
          text="Google Analytics, geladen über den Google Tag Manager, zählt Seitenaufrufe, damit wir sehen, welche Seiten weiterhelfen. Nie für Werbung genutzt."
          isOn={shown.analytics}
          onToggle={() => {
            setDraft({ ...shown, analytics: !shown.analytics });
            setStatus("");
          }}
        />
        <ConsentRow
          name="Externe Medien"
          text="Die Bürokarte auf der Kontaktseite sowie Videos und eingebettete Inhalte in Blogs. Beim Laden senden sie Daten an Google oder einen anderen Dienst, daher fragt ohne diese Zustimmung jedes Element zuerst. Routenkarten auf den Trekseiten werden immer geladen."
          isOn={shown.externalMedia}
          onToggle={() => {
            setDraft({ ...shown, externalMedia: !shown.externalMedia });
            setStatus("");
          }}
        />
      </ul>
      <div className="grid gap-2.5 border-0 border-t border-solid border-white/15 pt-5.5 sm:grid-cols-3">
        <button type="button" onClick={() => save(ONLY_NECESSARY)} className={QUIET}>
          Alle ablehnen
        </button>
        <button type="button" onClick={() => save(ALL_ALLOWED)} className={QUIET}>
          Alle akzeptieren
        </button>
        <button type="button" onClick={() => save(shown)} className={`${BUTTON} border-0 bg-snow text-ink hover:bg-ice`}>
          Auswahl speichern
        </button>
      </div>
      <p role="status" className="mt-3 min-h-6 text-[15px] leading-6 font-semibold text-snow">
        {status}
      </p>
    </section>
  );
};
