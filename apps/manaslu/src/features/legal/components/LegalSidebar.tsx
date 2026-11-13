import Link from "next/link";

import { TrailIcon } from "@/components/ui/TrailIcon";

import { LEGAL_PAGES } from "../legalPages";
import type { LegalDoc } from "../types";
import { PrintButton } from "./PrintButton";

const PANEL = "rounded-[14px] border border-solid border-line bg-snow";

/** Desktop side column: the legal pages, this page's sections, and Download as PDF. Stays in view while reading. */
export const LegalSidebar = ({ doc }: { doc: LegalDoc }) => (
  <div className="sticky top-5 hidden max-h-[calc(100dvh-40px)] flex-col gap-3.5 overflow-y-auto [scrollbar-width:thin] lg:flex print:hidden">
    <nav aria-label="Legal pages" className={`${PANEL} p-2.5`}>
      <ul className="flex flex-col gap-1">
        {LEGAL_PAGES.map((page) => {
          const isCurrent = page.slug === doc.slug;
          return (
            <li key={page.slug}>
              <Link
                href={page.path}
                aria-current={isCurrent ? "page" : undefined}
                className={`flex min-h-11 items-center gap-2.5 rounded-[10px] px-3 text-[15px] no-underline ${isCurrent ? "bg-forest-tint font-semibold text-forest-deep" : "font-semibold text-text hover:bg-stone"}`}
              >
                <TrailIcon name={page.icon} />
                {page.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
    {doc.sections.length > 0 && (
      <nav aria-labelledby="legal-toc" className={`${PANEL} flex flex-col gap-2 p-4`}>
        <p id="legal-toc" className="text-eyebrow font-semibold tracking-[0.12em] text-muted uppercase">
          On this page
        </p>
        <ol className="flex flex-col">
          {doc.sections.map((section, index) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="block py-1 text-sm leading-5 text-text no-underline hover:text-forest hover:underline">
                {index + 1}. {section.heading}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    )}
    <PrintButton />
  </div>
);
