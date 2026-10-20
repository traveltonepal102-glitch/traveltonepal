type ToggleSwitchProps = {
  label: string;
  isOn: boolean;
  onChange: (isOn: boolean) => void;
};

/** The switch's track and knob (decorative: the button around it carries role="switch"). */
export const SwitchTrack = ({ isOn, isLocked = false }: { isOn: boolean; isLocked?: boolean }) => (
  <span
    aria-hidden="true"
    className={`inline-flex h-5.5 w-10 flex-none rounded-full p-0.5 transition-colors ${isOn ? "justify-end" : "justify-start"} ${
      isLocked ? "bg-whatsapp/55" : isOn ? "bg-brand" : "bg-line-strong"
    }`}
  >
    <span className="size-4.5 rounded-full bg-white shadow-card" />
  </span>
);

/** On/off switch (role="switch"), the label on the left and the track on the right. */
export const ToggleSwitch = ({ label, isOn, onChange }: ToggleSwitchProps) => (
  <button
    type="button"
    role="switch"
    aria-checked={isOn}
    onClick={() => onChange(!isOn)}
    className="flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-sm text-left text-body-sm text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
  >
    {label}
    <SwitchTrack isOn={isOn} />
  </button>
);
