"use client";

import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { useId } from "react";

import { ICON_TONES } from "@/components/shared/iconTones";
import type { IconTone } from "@/components/shared/iconTones";
import { SwitchTrack } from "@/components/ui/ToggleSwitch";

import type { ConsentChoices } from "../consent";

type ConsentRowProps = {
  icon: IconName;
  tone: IconTone;
  name: string;
  text: string;
  isOn: boolean;
  /** Necessary functions: shown on, can't be switched off. */
  isLocked?: boolean;
  onToggle?: () => void;
};

const ConsentRow = ({ icon, tone, name, text, isOn, isLocked = false, onToggle }: ConsentRowProps) => {
  const nameId = useId();
  const textId = useId();

  return (
    <li className="flex items-start justify-between gap-3.5 bg-surface px-4 py-3.5 md:px-5">
      <span className="flex gap-3">
        <span aria-hidden="true" className={`inline-flex size-9.5 flex-none items-center justify-center rounded-md ${ICON_TONES[tone]}`}>
          <Icon name={icon} size={20} />
        </span>
        <span className="flex flex-col gap-0.5">
          <span id={nameId} className="font-bold text-ink">
            {name}
          </span>
          <span id={textId} className="text-caption font-normal text-text">
            {text}
          </span>
        </span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-labelledby={nameId}
        aria-describedby={textId}
        aria-disabled={isLocked || undefined}
        onClick={isLocked ? undefined : onToggle}
        className={`mt-1 flex-none rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${isLocked ? "cursor-not-allowed" : "cursor-pointer"}`}
      >
        <SwitchTrack isOn={isOn} isLocked={isLocked} />
      </button>
    </li>
  );
};

type ConsentOptionsProps = {
  choices: ConsentChoices;
  onChange: (choices: ConsentChoices) => void;
};

/** One row per cookie category, with its switch. Only categories the site really uses are listed. */
export const ConsentOptions = ({ choices, onChange }: ConsentOptionsProps) => (
  <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
    <ConsentRow
      icon="shield_person"
      tone="green"
      name="Necessary"
      text="Keeps the site working and remembers these choices. Always on."
      isOn
      isLocked
    />
    <ConsentRow
      icon="map"
      tone="saffron"
      name="External media"
      text="Google Maps on trek and region pages. It sends data to Google when it loads."
      isOn={choices.externalMedia}
      onToggle={() => onChange({ ...choices, externalMedia: !choices.externalMedia })}
    />
  </ul>
);
