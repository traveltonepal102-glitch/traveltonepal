"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { isInSection } from "@/lib/routes";

import { useHeaderMenu } from "./HeaderMenuProvider";
import { tabClassName } from "./tabClassName";

type NavTabLinkProps = {
  label: string;
  href: string;
};

/** A main-nav tab without a menu (Contact). */
export const NavTabLink = ({ label, href }: NavTabLinkProps) => {
  const { variant } = useHeaderMenu();
  const isActive = isInSection(usePathname(), href);

  return (
    <Link href={href} aria-current={isActive ? "page" : undefined} className={tabClassName({ variant, isActive })}>
      {label}
    </Link>
  );
};
