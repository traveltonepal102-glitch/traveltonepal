import type { ComponentProps } from "react";

export const Button = ({ className = "", ...props }: ComponentProps<"button">) => (
  <button
    className={`text-body min-h-11 rounded-full bg-brand px-6 font-semibold text-on-brand transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${className}`}
    {...props}
  />
);
