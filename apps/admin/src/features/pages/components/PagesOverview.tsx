import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { EditablePageSlug, LegalPageSlug, ListPageSlug } from "../constants";
import { EDITABLE_PAGES, LEGAL_PAGES, LIST_PAGES, PAGE_GROUPS, legalPagePath, listPagePath, pagePath } from "../constants";

const SECTION = ADMIN_SECTIONS.pages;

const TONES = {
  blue: "bg-[#EAF1F7] text-brand",
  navy: "bg-[#E6ECF3] text-navy",
  sand: "bg-saffron-tint text-saffron-deep",
} as const;

/** Every page the list shows: where its row opens, and what is edited there. */
const PAGE_ROWS: { slug: EditablePageSlug | ListPageSlug | LegalPageSlug; label: string; websitePath: string; icon: IconName; what: string; href: string }[] = [
  ...EDITABLE_PAGES.map((page) => ({ ...page, what: page.summary, href: pagePath(page.slug) })),
  ...LIST_PAGES.map((page) => ({ ...page, what: "Big heading, text under it, Google title and description", href: listPagePath(page.slug) })),
  ...LEGAL_PAGES.map((page) => ({ ...page, href: legalPagePath(page.slug) })),
];

const ROW = "flex w-full items-center gap-3 border-t border-solid border-[#EEF2F6] px-5 py-3.5 text-left no-underline first:border-t-0";

type PageRowProps = { icon: IconName; tone: keyof typeof TONES; label: string; websitePath: string; what: string; note: ReactNode };

/** One page in a group: icon, name, its address, what is edited, and when it was saved. */
const PageRowContent = ({ icon, tone, label, websitePath, what, note }: PageRowProps) => (
  <>
    <span className={cn("inline-flex size-10 flex-none items-center justify-center rounded-[10px]", TONES[tone])}>
      <Icon name={icon} size={20} />
    </span>
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-2">
        <strong className="text-[15px] text-ink">{label}</strong>
        <code className="rounded-xs bg-muted px-1.5 py-px text-xs text-text">{websitePath}</code>
      </span>
      <span className="mt-0.5 block text-caption text-muted-foreground">{what}</span>
    </span>
    <span className="w-44 flex-none text-right text-xs font-semibold text-muted-foreground max-tablet:hidden">{note}</span>
  </>
);

type PagesOverviewProps = {
  /** "Saved 26 Oct, 11:32" per page that can be edited. */
  savedLabels: Partial<Record<EditablePageSlug | ListPageSlug | LegalPageSlug, string>>;
};

/** Pages (design: Admin-pages, list view): the pages that are not treks, regions or travel guides, in groups. */
export const PagesOverview = ({ savedLabels }: PagesOverviewProps) => (
  <div className="flex max-w-295 flex-col gap-5.5">
    <div className="flex flex-wrap items-start gap-3.5">
      <span className="inline-flex size-12 flex-none items-center justify-center rounded-lg bg-brand-tint text-brand">
        <Icon name={SECTION.icon} size={26} />
      </span>
      <div className="min-w-60 flex-1">
        <h1 className="m-0 font-display text-[28px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">{SECTION.label}</h1>
        <p className="m-0 mt-1 max-w-190 text-muted-foreground">The pages that are not treks, regions or travel guides. Change the words here; the design stays the same.</p>
      </div>
    </div>

    {PAGE_GROUPS.map((group) => (
      <section key={group.title} aria-labelledby={`pages-${group.tone}`} className="overflow-hidden rounded-xl border border-solid border-border bg-surface">
        <div className="border-b border-solid border-[#EEF2F6] px-5 py-4">
          <h2 id={`pages-${group.tone}`} className="m-0 flex items-center gap-2 font-display text-lg font-bold text-ink">
            {group.title}
            {group.tag && <span className="rounded-full bg-muted px-2 py-0.5 font-sans text-[11px] font-bold text-text">{group.tag}</span>}
          </h2>
          <p className="m-0 mt-0.5 max-w-190 text-caption text-muted-foreground">{group.description}</p>
        </div>
        {group.pages.map((slug) => {
          const row = PAGE_ROWS.find((candidate) => candidate.slug === slug);
          if (!row) return null;
          return (
            <Link key={row.slug} href={row.href} className={cn(ROW, "hover:bg-page focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring")}>
              <PageRowContent icon={row.icon} tone={group.tone} label={row.label} websitePath={row.websitePath} what={row.what} note={savedLabels[row.slug] ?? "Not saved yet"} />
              <Icon name="chevron_right" size={20} className="flex-none text-subtle" />
            </Link>
          );
        })}
      </section>
    ))}

    <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-border bg-page px-3.5 py-3 text-caption text-text">
      <Icon name="info" size={18} className="flex-none text-brand" />
      <span>
        Phone, WhatsApp, email, address and opening hours are kept in one place,{" "}
        <Link href={ADMIN_SECTIONS.settings.href} className="font-bold text-brand">
          Site settings
        </Link>
        , and shown on every page. They are read-only here, so they can never be different on two pages.
      </span>
    </p>
  </div>
);
