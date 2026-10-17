import type { HeaderVariant } from "./HeaderMenuProvider";

type TabState = {
  variant: HeaderVariant;
  isActive: boolean;
  isOpen?: boolean;
};

const BASE =
  "inline-flex h-full cursor-pointer items-center gap-0.5 border-b-2 px-3 text-body transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2";

/** Main-nav tab look: the current section is bold and underlined; an open menu is tinted. */
export const tabClassName = ({ variant, isActive, isOpen = false }: TabState) => {
  const weight = isActive ? "font-bold" : "font-semibold";

  if (variant === "overlay") {
    const underline = isActive ? "border-saffron" : "border-transparent";
    return `${BASE} ${weight} ${underline} text-white hover:text-navy-text focus-visible:outline-white`;
  }

  const underline = isActive ? "border-brand" : "border-transparent";
  const color = isActive || isOpen ? "text-brand" : "text-text hover:text-brand";
  const background = isOpen ? "bg-brand-tint" : "";
  return `${BASE} ${weight} ${underline} ${color} ${background} focus-visible:outline-ring`;
};
