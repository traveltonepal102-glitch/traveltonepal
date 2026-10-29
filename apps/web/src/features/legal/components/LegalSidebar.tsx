import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { LEGAL_MENU, LEGAL_PATHS } from "../legalDocs";
import type { LegalDoc } from "../types";
import { PrintButton } from "./PrintButton";
import { FOCUS, PANEL } from "./styles";

/** Desktop side column: the legal pages, this page’s sections, and Download as PDF. Stays in view while reading. */
export const LegalSidebar = ({ doc }: { doc: LegalDoc }) => (
  <aside className="sticky top-5 hidden flex-col gap-3.5 lg:flex print:hidden">
    <nav aria-label="Legal pages" className={`${PANEL} p-2.5`}>
      <ul className="flex flex-col gap-1">
        {LEGAL_MENU.map((item) => {
          const isCurrent = item.slug === doc.slug;
          return (
            <li key={item.slug}>
              <Link
                href={LEGAL_PATHS[item.slug]}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex items-center gap-2.5 rounded-md border px-3 py-2.75 text-body-sm ${FOCUS} ${
                  isCurrent ? "border-[#d3e3f1] bg-brand-tint font-bold text-brand" : "border-transparent font-semibold text-text hover:bg-page"
                }`}
              >
                <Icon name={item.icon} size={20} className="flex-none" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>

    <nav aria-labelledby="legal-toc-title" className={`${PANEL} flex flex-col gap-2 p-4`}>
      <p id="legal-toc-title" className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
        On this page
      </p>
      <ol className="flex flex-col gap-1.5">
        {doc.sections.map((section, index) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className={`rounded-sm text-caption font-normal text-text hover:text-brand ${FOCUS}`}>
              {index + 1}. {section.heading}
            </a>
          </li>
        ))}
      </ol>
    </nav>

    <PrintButton />
  </aside>
);
