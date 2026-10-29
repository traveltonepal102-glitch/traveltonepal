"use client";

import { Icon } from "@ttn/ui/icon";

import type { EditorSaveAction } from "@/components/editor/types";
import type { Photo } from "@/features/photos/types";

import { COUNT_TOKENS_HINT, LIST_PAGES } from "../constants";
import type { ListPageSlug } from "../constants";
import { listReadiness } from "../lib/pageReadiness";
import { LIST_SECTIONS, listSectionErrors } from "../sections";
import type { ListPagesValues } from "../types";
import { PageEditorForm } from "./PageEditorForm";
import { PageGoogleCard } from "./PageGoogleCard";
import { PageTopCard } from "./PageTopCard";

type ListPagesEditorProps = {
  action: EditorSaveAction;
  values: ListPagesValues;
  sharePhotos: Record<ListPageSlug, Photo | null>;
  /** The page open first, e.g. from the Pages list's row. */
  initialPage: ListPageSlug;
  websiteUrl: string | null;
  lastSaved: string;
};

const FIXED_NOTE = "The lists fill themselves from your treks, regions and travel guides. Only the text at the top and the Google result are edited here.";

const pathOf = (slug: ListPageSlug) => LIST_PAGES.find((page) => page.slug === slug)?.websitePath ?? "/";

/** Pages › List pages (design: Admin-pages, "List pages"): Home, Treks, Regions and Travel guides, one form, one Publish. */
export const ListPagesEditor = ({ action, values, sharePhotos, initialPage, websiteUrl, lastSaved }: ListPagesEditorProps) => (
  <PageEditorForm
    action={action}
    title="List pages"
    lastSaved={lastSaved}
    websiteUrl={websiteUrl}
    pathFor={pathOf}
    sections={LIST_SECTIONS}
    initialKey={initialPage}
    readiness={listReadiness(values)}
    errorLookup={listSectionErrors}
    fixedNote={FIXED_NOTE}
  >
    {({ activeKey, errors, onEdit }) => (
      <>
        <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-saffron-line bg-saffron-tint px-3.5 py-3 text-caption text-saffron-ink">
          <Icon name="info" size={18} className="flex-none" />
          Editing for Travel To Nepal (main site). The region websites get their own text when they open.
        </p>
        {LIST_PAGES.map((page) => (
          <div key={page.slug} hidden={activeKey !== page.slug} className="flex flex-col gap-4">
            <PageTopCard
              values={values[page.slug]}
              errors={errors}
              fieldPrefix={`${page.slug}.`}
              hint={`${page.hint} ${COUNT_TOKENS_HINT}`}
              eyebrow={{ label: page.slug === "home" ? "Small label above the heading (the yellow badge)" : "Small label above the heading", placeholder: page.slug === "regions" ? "{regions} trekking regions" : "" }}
            />
            <PageGoogleCard
              values={values[page.slug]}
              errors={errors}
              fieldPrefix={`${page.slug}.`}
              websitePath={page.websitePath}
              hint={COUNT_TOKENS_HINT}
              sharePhoto={sharePhotos[page.slug]}
              shareFallback="the share image in Site settings"
              onEdit={onEdit}
              canHide={page.slug !== "home"}
            />
            <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-border bg-page px-3.5 py-3 text-caption text-text">
              <Icon name="check_circle" size={18} className="flex-none text-whatsapp" />
              {page.auto}
            </p>
          </div>
        ))}
      </>
    )}
  </PageEditorForm>
);
