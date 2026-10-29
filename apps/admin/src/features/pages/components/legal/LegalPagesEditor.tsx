"use client";

import { Icon } from "@ttn/ui/icon";

import type { EditorSaveAction } from "@/components/editor/types";
import { FormSection } from "@/components/ui/FormSection";

import { LEGAL_PAGES, LEGAL_PLACEHOLDERS } from "../../constants";
import type { LegalPageSlug } from "../../constants";
import { legalReadiness } from "../../lib/pageReadiness";
import { LEGAL_SECTIONS, legalSectionErrors } from "../../sections";
import type { LegalPagesValues } from "../../types";
import { PageEditorForm } from "../PageEditorForm";
import { LegalPageCard } from "./LegalPageCard";
import { LegalTextEditor } from "./LegalTextEditor";

type LegalPagesEditorProps = {
  action: EditorSaveAction;
  values: LegalPagesValues;
  /** The page open first, e.g. from the Pages list's row. */
  initialPage: LegalPageSlug;
  websiteUrl: string | null;
  lastSaved: string;
};

const FIXED_NOTE = "The layout, the “On this page” list and “Download as PDF” come from the design. Company details come from Site settings through the placeholders below.";

const pathOf = (slug: LegalPageSlug) => LEGAL_PAGES.find((page) => page.slug === slug)?.websitePath ?? "/";

/** Pages › Legal pages (design: Admin-pages, "Legal pages"): Terms, Privacy, Impressum and Cookie settings, one form. */
export const LegalPagesEditor = ({ action, values, initialPage, websiteUrl, lastSaved }: LegalPagesEditorProps) => (
  <PageEditorForm
    action={action}
    title="Legal pages"
    lastSaved={lastSaved}
    websiteUrl={websiteUrl}
    pathFor={pathOf}
    sections={LEGAL_SECTIONS}
    initialKey={initialPage}
    readiness={legalReadiness(values)}
    errorLookup={legalSectionErrors}
    fixedNote={FIXED_NOTE}
  >
    {({ activeKey, errors, onEdit }) => (
      <>
        {LEGAL_PAGES.map((page) => (
          <div key={page.slug} hidden={activeKey !== page.slug} className="flex flex-col gap-4">
            <LegalPageCard slug={page.slug} values={values[page.slug]} uncheckedNote={page.note} errors={errors} />
            <LegalTextEditor name={`${page.slug}.body`} label={values[page.slug].heading} defaultValue={values[page.slug].body} error={errors[`${page.slug}.body`]} onEdit={onEdit} />
            {page.slug === "cookies" && (
              <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-border bg-page px-3.5 py-3 text-caption text-text">
                <Icon name="lock" size={18} className="flex-none text-muted-foreground" />
                The “Your current choices” box with the switches is part of the page design and works by itself. Only the text is edited here.
              </p>
            )}
          </div>
        ))}
        <FormSection title="Company details in the text" hint="Write these instead of typing the detail: the website fills them in from Site settings, so a changed number is changed everywhere.">
          <dl className="m-0 grid gap-x-4 gap-y-1.5 tablet:grid-cols-2">
            {LEGAL_PLACEHOLDERS.map((placeholder) => (
              <div key={placeholder.token} className="flex items-baseline gap-2 text-caption">
                <dt>
                  <code className="rounded-xs bg-muted px-1.5 py-px text-xs text-ink">{placeholder.token}</code>
                </dt>
                <dd className="m-0 text-text">{placeholder.meaning}</dd>
              </div>
            ))}
          </dl>
        </FormSection>
      </>
    )}
  </PageEditorForm>
);
