import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import Link from "next/link";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "whatsapp";

const VARIANTS: Record<ButtonVariant, { button: string; icon: string }> = {
  primary: { button: "bg-brand text-on-brand hover:bg-brand-hover", icon: "" },
  secondary: { button: "border border-line-strong bg-surface text-ink hover:bg-page", icon: "text-brand" },
  whatsapp: { button: "bg-whatsapp text-white hover:bg-whatsapp/90", icon: "" },
};

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: IconName;
  /** Opens in a new tab (WhatsApp, other sites). */
  isExternal?: boolean;
  className?: string;
};

/** A link styled as the website's pill button (48px tall). */
export const ButtonLink = ({
  href,
  children,
  variant = "primary",
  icon,
  isExternal = false,
  className = "",
}: ButtonLinkProps) => {
  const look = VARIANTS[variant];
  const classes = `inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-body font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${look.button} ${className}`;
  const content = (
    <>
      {icon && <Icon name={icon} size={18} className={look.icon} />}
      {children}
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
