type ToggleSwitchProps = {
  label: string;
  isOn: boolean;
  onChange: (isOn: boolean) => void;
};

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
    <span
      aria-hidden="true"
      className={`inline-flex h-5.5 w-10 flex-none rounded-full p-0.5 transition-colors ${isOn ? "justify-end bg-brand" : "justify-start bg-line-strong"}`}
    >
      <span className="size-4.5 rounded-full bg-white shadow-card" />
    </span>
  </button>
);
