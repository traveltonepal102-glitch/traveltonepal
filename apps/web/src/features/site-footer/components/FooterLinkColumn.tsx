import Link from "next/link";

import type { FooterLink } from "../footerLinks";
import { FOOTER_LINK } from "./footerStyles";

type FooterLinkColumnProps = {
  title: string;
  links: readonly FooterLink[];
};

/** A titled list of links, as its own navigation landmark. */
export const FooterLinkColumn = ({ title, links }: FooterLinkColumnProps) => (
  <nav aria-label={title} className="flex flex-col gap-4">
    <h2 className="font-display text-eyebrow text-white uppercase">{title}</h2>
    <ul className="flex flex-col gap-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className={FOOTER_LINK}>
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
