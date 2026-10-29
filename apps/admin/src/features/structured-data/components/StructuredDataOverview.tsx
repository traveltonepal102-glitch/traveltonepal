import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";

import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import { PAGE_KINDS, PAGE_KIND_LABELS, pageSchemasPath } from "../constants";
import type { SchemaPage } from "../types";

const SECTION = ADMIN_SECTIONS.structuredData;

const ROW =
  "flex w-full items-center gap-3 border-t border-solid border-[#EEF2F6] px-5 py-3 text-left no-underline first:border-t-0 hover:bg-page focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring";

/** "2 schemas", "2 schemas · 1 hidden" or "None yet". */
const countLabel = ({ schemaCount, shownCount }: SchemaPage) => {
  if (schemaCount === 0) return "None yet";
  const hidden = schemaCount - shownCount;
  return `${schemaCount} schema${schemaCount === 1 ? "" : "s"}${hidden ? ` · ${hidden} hidden` : ""}`;
};

/** One page: its name and address, why the website doesn't show it (if so), and how many schemas it has. */
const SchemaPageRow = ({ page }: { page: SchemaPage }) => (
  <Link href={pageSchemasPath(page)} className={ROW}>
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-2">
        <strong className="text-[15px] text-ink">{page.name}</strong>
        <code className="rounded-xs bg-muted px-1.5 py-px text-xs text-text">{page.websitePath}</code>
      </span>
      {page.offlineNote && <span className="mt-0.5 block text-caption text-muted-foreground">{page.offlineNote}</span>}
    </span>
    <span className={cn("flex-none text-xs font-semibold", page.schemaCount ? "text-whatsapp" : "text-muted-foreground")}>{countLabel(page)}</span>
    <Icon name="chevron_right" size={20} className="flex-none text-subtle" />
  </Link>
);

/**
 * Structured data: every page the website has, in groups, with how many of the SEO person's own JSON-LD blocks
 * it has. A row opens the page's blocks.
 */
export const StructuredDataOverview = ({ pages }: { pages: SchemaPage[] }) => (
  <div className="flex max-w-240 flex-col gap-5.5">
    <div className="flex flex-wrap items-start gap-3.5">
      <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
        <Icon name={SECTION.icon} size={26} />
      </span>
      <div className="min-w-60 flex-1">
        <h1 className="m-0 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{SECTION.label}</h1>
        <p className="m-0 mt-1 max-w-190 text-muted-foreground">
          The website already tells Google about each page by itself (the company, breadcrumbs, treks, FAQs, articles). Add your
          own schema.org JSON-LD to any page here, as many blocks as it needs.
        </p>
      </div>
    </div>

    {PAGE_KINDS.map((kind) => {
      const group = pages.filter((page) => page.kind === kind);
      if (group.length === 0) return null;
      return (
        <section key={kind} aria-labelledby={`schemas-${kind}`} className="overflow-hidden rounded-xl border border-solid border-border bg-surface">
          <h2 id={`schemas-${kind}`} className="m-0 border-b border-solid border-[#EEF2F6] px-5 py-4 font-display text-lg font-bold text-ink">
            {PAGE_KIND_LABELS[kind]}
          </h2>
          {group.map((page) => (
            <SchemaPageRow key={page.key} page={page} />
          ))}
        </section>
      );
    })}
  </div>
);
