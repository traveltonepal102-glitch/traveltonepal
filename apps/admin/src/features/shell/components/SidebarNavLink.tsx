import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import type { AdminSection } from "../navigation";

type SidebarNavLinkProps = {
  section: AdminSection;
  isActive: boolean;
  onNavigate: () => void;
};

/** One menu item. With "icons only" the label stays for screen readers and shows as a tooltip. */
export const SidebarNavLink = ({ section, isActive, onNavigate }: SidebarNavLinkProps) => (
  <Link
    href={section.href}
    onClick={onNavigate}
    title={section.label}
    aria-current={isActive ? "page" : undefined}
    className={cn(
      "flex items-center gap-3 rounded-md px-3 py-2.25 text-body-sm font-semibold no-underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-sidebar-ring rail:justify-center rail:px-0 rail:py-2.75",
      isActive
        ? "bg-sidebar-accent text-white shadow-[inset_3px_0_0_var(--color-saffron)]"
        : "text-navy-text hover:bg-white/8 hover:text-white",
    )}
  >
    <Icon name={section.icon} size={22} className="flex-none" />
    <span className="flex-1 rail:sr-only">{section.label}</span>
  </Link>
);
