import { Icon } from "@ttn/ui/icon";
import Link from "next/link";

import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ROUTES } from "@/lib/routes";

import { LEGAL_DOCS, LEGAL_PATHS } from "../legalDocs";
import type { LegalDoc } from "../types";
import { WRAP } from "./styles";

/** Breadcrumb, title, intro and "Last updated"; on phones and tablets, the legal pages as tabs. */
export const LegalHeader = ({ doc }: { doc: LegalDoc }) => (
  <section aria-labelledby="legal-title" className="border-b border-line bg-surface">
    <div className={`${WRAP} flex flex-col gap-3 pt-5 pb-7`}>
      <Breadcrumbs items={[{ label: "Home", href: ROUTES.home }, { label: doc.title }]} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex max-w-190 flex-col gap-2">
          <p className="inline-flex items-center gap-2 text-eyebrow text-brand uppercase">
            <Icon name={doc.icon} size={18} />
            Legal information
          </p>
          <h1 id="legal-title" className="text-[30px] leading-tight font-extrabold tracking-tight md:text-[40px]">
            {doc.title}
          </h1>
          <p className="text-base text-text">{doc.intro}</p>
        </div>
        <p className="inline-flex flex-none items-center gap-1.5 text-caption font-normal text-muted-foreground">
          <Icon name="schedule" size={16} />
          Last updated: {doc.updated}
        </p>
      </div>

      <nav aria-label="Legal pages" className="-mx-4 overflow-x-auto px-4 pt-1.5 scrollbar-none lg:hidden [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-1.5">
          {LEGAL_DOCS.map((item) => {
            const isCurrent = item.slug === doc.slug;
            return (
              <li key={item.slug} className="flex-none">
                <Link
                  href={LEGAL_PATHS[item.slug]}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`inline-flex min-h-9.5 items-center rounded-full border px-3.5 text-caption font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                    isCurrent ? "border-navy bg-navy text-white" : "border-line-strong bg-surface text-text hover:border-brand"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  </section>
);
