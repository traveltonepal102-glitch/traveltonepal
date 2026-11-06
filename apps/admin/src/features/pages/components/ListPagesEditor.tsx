"use client";

import { Icon } from "@ttn/ui/icon";

import type { EditorSaveAction } from "@/components/editor/types";
import type { Photo } from "@/features/photos/types";

import { COUNT_TOKENS_HINT } from "../constants";
import type { ListPage, ListPageSlug } from "../constants";
import { listReadiness } from "../lib/pageReadiness";
import { listSectionErrorsFor, listSectionsFor } from "../sections";
import type { ListPagesValues } from "../types";
import { PageEditorForm } from "./PageEditorForm";
import { PageGoogleCard } from "./PageGoogleCard";
import { PageTopCard } from "./PageTopCard";

type ListPagesEditorProps = {
  action: EditorSaveAction;
  /** The site's list pages (listPagesFor): all four on the main site, only Travel guides on a region site. */
  pages: readonly ListPage[];
  /** The site "Working on" shows, e.g. "Manaslu Trek". */
  siteName: string;
  values: ListPagesValues;
  sharePhotos: Partial<Record<ListPageSlug, Photo | null>>;
  /** The page open first, e.g. from the Pages list's row. */
  initialPage: ListPageSlug;
  websiteUrl: string | null;
  lastSaved: string;
};

const FIXED_NOTE = "The lists fill themselves from your treks, regions and travel guides. Only the text at the top and the Google result are edited here.";

/** Pages › List pages (design: Admin-pages, "List pages"): the site's list pages, one form, one Publish. */
export const ListPagesEditor = ({ action, pages, siteName, values, sharePhotos, initialPage, websiteUrl, lastSaved }: ListPagesEditorProps) => (
  <PageEditorForm
    action={action}
    title="List pages"
    lastSaved={lastSaved}
    websiteUrl={websiteUrl}
    pathFor={(slug) => pages.find((page) => page.slug === slug)?.websitePath ?? "/"}
    sections={listSectionsFor(pages)}
    initialKey={initialPage}
    readiness={listReadiness(values)}
    errorLookup={listSectionErrorsFor(pages)}
    fixedNote={FIXED_NOTE}
  >
    {({ activeKey, errors, onEdit }) => (
      <>
        <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-saffron-line bg-saffron-tint px-3.5 py-3 text-caption text-saffron-ink">
          <Icon name="info" size={18} className="flex-none" />
          Editing for {siteName}. Every website has its own text here.
        </p>
        {pages.map((page) => {
          const top = values[page.slug];
          if (!top) return null;
          return (
            <div key={page.slug} hidden={activeKey !== page.slug} className="flex flex-col gap-4">
              <PageTopCard
                values={top}
                errors={errors}
                fieldPrefix={`${page.slug}.`}
                hint={`${page.hint} ${COUNT_TOKENS_HINT}`}
                eyebrow={{ label: page.slug === "home" ? "Small label above the heading (the yellow badge)" : "Small label above the heading", placeholder: page.slug === "regions" ? "{regions} trekking regions" : "" }}
              />
              <PageGoogleCard
                values={top}
                errors={errors}
                fieldPrefix={`${page.slug}.`}
                websitePath={page.websitePath}
                hint={COUNT_TOKENS_HINT}
                sharePhoto={sharePhotos[page.slug] ?? null}
                shareFallback="the share image in Site settings"
                onEdit={onEdit}
                canHide={page.slug !== "home"}
              />
              <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-border bg-page px-3.5 py-3 text-caption text-text">
                <Icon name="check_circle" size={18} className="flex-none text-whatsapp" />
                {page.auto}
              </p>
            </div>
          );
        })}
      </>
    )}
  </PageEditorForm>
);
