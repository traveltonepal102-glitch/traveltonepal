import { Icon } from "@ttn/ui/icon";
import type { ReactNode } from "react";

type SubmitButtonProps = {
  children: ReactNode;
  isLoading: boolean;
  loadingLabel: string;
};

export const SubmitButton = ({ children, isLoading, loadingLabel }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={isLoading}
    className="m-0 inline-flex min-h-12.5 w-full cursor-pointer items-center justify-center gap-2.5 rounded-xl border-0 bg-brand px-4 font-sans text-[15px] font-bold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-70"
  >
    {isLoading ? (
      loadingLabel
    ) : (
      <>
        {children}
        <Icon name="arrow_forward" size={20} />
      </>
    )}
  </button>
);
