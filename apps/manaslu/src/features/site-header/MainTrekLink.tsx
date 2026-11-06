"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ROUTES } from "@/lib/routes";

type MainTrekLinkProps = { name: string; className: string };

/** The main trek in the menu (it is the home page), underlined while it is the page shown. */
export const MainTrekLink = ({ name, className }: MainTrekLinkProps) => {
  const isCurrent = usePathname() === ROUTES.home;
  return (
    <Link href={ROUTES.home} aria-current={isCurrent ? "page" : undefined} className={`${className} ${isCurrent ? "shadow-[inset_0_-2px_0_var(--color-saffron)]" : ""}`}>
      {name}
    </Link>
  );
};
