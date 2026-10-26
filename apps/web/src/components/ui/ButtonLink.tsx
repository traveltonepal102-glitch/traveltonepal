import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";
import type { ReactNode } from "react";

import { WhatsAppLogo } from "./WhatsAppLogo";

type ButtonVariant = "primary" | "secondary" | "outline" | "whatsapp" | "accent" | "light" | "outlineOnDark";
type ButtonSize = "md" | "lg";

const VARIANTS: Record<ButtonVariant, { button: string; icon: string }> = {
  primary: { button: "bg-brand font-bold text-on-brand hover:bg-brand-hover focus-visible:outline-ring", icon: "" },
  secondary: {
    button: "border border-line-strong bg-surface font-bold text-ink hover:bg-page focus-visible:outline-ring",
    icon: "text-brand",
  },
  outline: {
    button: "border-[1.5px] border-brand font-bold text-brand hover:bg-brand-tint focus-visible:outline-ring",
    icon: "",
  },
  whatsapp: { button: "bg-whatsapp font-bold text-white hover:bg-whatsapp/90 focus-visible:outline-ring", icon: "" },
  /** Saffron: the one main action on a dark photo (text stays ink, never white). */
  accent: { button: "bg-saffron font-extrabold text-ink hover:bg-saffron/90 focus-visible:outline-white", icon: "" },
  /** White button on a brand-colored band (text color set by the caller, e.g. text-whatsapp). */
  light: { button: "bg-white font-extrabold hover:bg-brand-tint focus-visible:outline-white", icon: "" },
  outlineOnDark: {
    button: "border-[1.5px] border-white/55 font-bold text-white hover:bg-white/10 focus-visible:outline-white",
    icon: "",
  },
};

const SIZES: Record<ButtonSize, { button: string; icon: number }> = {
  md: { button: "min-h-12 gap-2 px-5", icon: 18 },
  lg: { button: "min-h-13.5 gap-2.5 px-7", icon: 20 },
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Icon before the text; "whatsapp" for WhatsApp's logo (every button that opens WhatsApp). */
  icon?: IconName | "whatsapp";
  /** Icon after the text, e.g. an arrow. */
  trailingIcon?: IconName;
  /** Opens in a new tab (WhatsApp, other sites). */
  isExternal?: boolean;
  /** "pill" (default, website buttons) or "rounded" (list pages and panels, e.g. the Treks page). */
  shape?: "pill" | "rounded";
  className?: string;
};

/** A link styled as the website's pill button. */
export const ButtonLink = ({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  trailingIcon,
  isExternal = false,
  shape = "pill",
  className = "",
}: ButtonLinkProps) => {
  const look = VARIANTS[variant];
  const { button: sizeClasses, icon: iconSize } = SIZES[size];
  const classes = `inline-flex items-center justify-center ${shape === "pill" ? "rounded-full" : "rounded-md"} text-body transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${sizeClasses} ${look.button} ${className}`;
  const content = (
    <>
      {icon === "whatsapp" ? <WhatsAppLogo size={iconSize} className={look.icon} /> : icon && <Icon name={icon} size={iconSize} className={look.icon} />}
      {children}
      {trailingIcon && <Icon name={trailingIcon} size={iconSize} className={look.icon} />}
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
};
