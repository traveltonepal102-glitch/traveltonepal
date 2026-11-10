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
    {/* Not a heading: footer titles would add the same generic headings to every page's outline. The nav is named by aria-label. */}
    <p className="font-display text-eyebrow text-white uppercase">{title}</p>
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
