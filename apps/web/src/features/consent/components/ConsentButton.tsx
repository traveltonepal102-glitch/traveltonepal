import type { ReactNode } from "react";

type ConsentButtonProps = {
  onClick: () => void;
  children: ReactNode;
  /** "Accept all": filled. Reject and Save are outlined, with the same weight (no nudging towards Accept). */
  isPrimary?: boolean;
};

/** Buttons of the cookie banner, settings window and Cookie settings page. Their container sets the width. */
export const ConsentButton = ({ onClick, children, isPrimary = false }: ConsentButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`min-h-11.5 cursor-pointer rounded-md border border-brand px-5 font-bold whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
      isPrimary ? "bg-brand text-on-brand hover:bg-brand-hover" : "bg-surface text-brand hover:bg-brand-tint"
    }`}
  >
    {children}
  </button>
);
