import Link from "next/link";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { TrailIcon } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

import { LEGAL_PAGES } from "../legalPages";
import type { LegalDoc } from "../types";

/** Breadcrumb, title, intro and "Last updated"; on phones and tablets, the legal pages as tabs. */
export const LegalHeader = ({ doc }: { doc: LegalDoc }) => (
  <div className="border-b border-solid border-line bg-cloud">
    <div className="wrap flex flex-col gap-3 pt-5 pb-7">
      <div className="print:hidden">
        <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: "Legal" }, { label: doc.title }]} />
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-190 flex-col gap-2">
          <span className="eyebrow">Legal information</span>
          <h1>{doc.title}</h1>
          {doc.intro && <p>{doc.intro}</p>}
        </div>
        {doc.updated && (
          <p className="inline-flex flex-none items-center gap-1.5 text-sm leading-5 text-muted">
            <TrailIcon name="clock" size={16} />
            Last updated: {doc.updated}
          </p>
        )}
      </div>
      <nav aria-label="Legal pages" className="overflow-x-auto pt-1.5 lg:hidden print:hidden">
        <ul className="flex gap-1.5">
          {LEGAL_PAGES.map((page) => {
            const isCurrent = page.slug === doc.slug;
            return (
              <li key={page.slug} className="flex-none">
                <Link
                  href={page.path}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full border border-solid px-3.5 text-sm font-semibold no-underline ${isCurrent ? "border-navy bg-navy text-snow hover:text-snow" : "border-line bg-snow text-text"}`}
                >
                  {page.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  </div>
);
