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
    className="m-0 h-11 w-full cursor-pointer rounded-md border-0 bg-brand px-4 font-sans text-body font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-70"
  >
    {isLoading ? loadingLabel : children}
  </button>
);
