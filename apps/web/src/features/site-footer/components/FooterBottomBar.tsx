import { cacheLife } from "next/cache";
import Link from "next/link";

import { LEGAL_LINKS } from "../footerLinks";
import { FOOTER_LINK } from "./footerStyles";

/**
 * Cache Components forbids a bare `new Date()` while prerendering, so the year is read in a
 * cached function: fixed at build time and refreshed by the nightly rebuild (TRD). "max", not a
 * short profile: the footer is in the root layout, so its lifetime becomes every page's.
 */
const getCurrentYear = async () => {
  "use cache";
  cacheLife("max");
  return new Date().getFullYear();
};

export const FooterBottomBar = async () => {
  const year = await getCurrentYear();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5.5 text-caption font-normal text-footer-muted">
      <p>© {year} Travel To Nepal. All rights reserved.</p>
      <nav aria-label="Legal">
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {LEGAL_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={FOOTER_LINK}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
