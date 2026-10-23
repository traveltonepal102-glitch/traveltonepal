type SwitchTrackProps = {
  isOn: boolean;
  /** Always on and not changeable (e.g. "Necessary" cookies): a muted green track. */
  isLocked?: boolean;
};

/** A switch's track and knob (decorative: the button around it carries role="switch"). */
export const SwitchTrack = ({ isOn, isLocked = false }: SwitchTrackProps) => (
  <span
    aria-hidden="true"
    className={`inline-flex h-5.5 w-10 flex-none rounded-full p-0.5 transition-colors ${isOn ? "justify-end" : "justify-start"} ${
      isLocked ? "bg-whatsapp/55" : isOn ? "bg-brand" : "bg-line-strong"
    }`}
  >
    <span className="size-4.5 rounded-full bg-white shadow-card" />
  </span>
);
