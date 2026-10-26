"use client";

import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import type { ReactNode } from "react";

import { EditorHeader } from "@/components/editor/EditorHeader";
import { EditorSectionHeading } from "@/components/editor/EditorSectionHeading";
import { EditorSectionNav } from "@/components/editor/EditorSectionNav";
import type { EditorSaveAction, EditorSection, SectionReadiness } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { secondaryButton } from "@/components/ui/buttonStyles";
import { FormAlert } from "@/components/ui/FormAlert";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import { PAGES_PATH } from "../constants";

type PageEditorFormProps<Key extends string> = {
  action: EditorSaveAction;
  /** e.g. "About us". */
  title: string;
  /** e.g. "Published · saved 26 Oct, 11:32 Nepal time". */
  lastSaved: string;
  /** The website's address (WEBSITE_URL), when it is set up: "View on site" opens the page of the open section. */
  websiteUrl: string | null;
  /** The address on the website of the page the section belongs to, e.g. "/about". */
  pathFor: (key: Key) => string;
  sections: EditorSection<Key>[];
  /** The section open first (default: the first). */
  initialKey?: Key;
  readiness: Partial<Record<Key, SectionReadiness>>;
  errorLookup: { sectionsWithErrors: (fields: string[]) => Set<Key>; firstSectionWithError: (fields: string[]) => Key | undefined };
  /** What the page shows that is not edited here (design: the grey note with a lock). */
  fixedNote: string;
  /** The sections' cards, given the open section, the form's errors and its "something changed" callback. */
  children: (form: { activeKey: Key; errors: FieldErrors; onEdit: () => void }) => ReactNode;
};

/**
 * One page's editor (design: Admin-pages): back to Pages, the save state, View on site and Publish; the page's
 * sections on the left, top to bottom as on the page. All sections are one form: switching keeps what you typed.
 */
export const PageEditorForm = <Key extends string>({ action, title, lastSaved, websiteUrl, pathFor, sections, initialKey, readiness, errorLookup, fixedNote, children }: PageEditorFormProps<Key>) => {
  const form = useEditorForm<Key>({ action, firstKey: initialKey ?? sections[0].key, firstSectionWithError: errorLookup.firstSectionWithError, isNew: false, lastSaved });
  const [status, statusTone] = form.saveStatus;
  const active = sections.find((section) => section.key === form.activeKey) ?? sections[0];
  const viewHref = websiteUrl ? new URL(pathFor(active.key), websiteUrl).href : null;

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={form.markDirty} className="flex flex-col gap-5">
      <EditorHeader back={{ href: PAGES_PATH, label: "Pages" }} title={title} status={status} statusTone={statusTone} saveLabel="Publish" isSaving={form.isSaving}>
        {viewHref && (
          <a href={viewHref} target="_blank" rel="noopener noreferrer" className={cn(secondaryButton, "max-tablet:hidden")}>
            <Icon name="open_in_new" size={18} />
            View on site
          </a>
        )}
      </EditorHeader>
      {form.state.status === "error" && <FormAlert message={form.state.message} />}

      <div className="grid items-start gap-6 desktop:grid-cols-[260px_minmax(0,1fr)]">
        <EditorSectionNav
          label={`On the ${title} page, top to bottom`}
          progressTitle={`${title} page ready`}
          sections={sections}
          activeKey={form.activeKey}
          onSelect={form.setActiveKey}
          readiness={readiness}
          errorKeys={errorLookup.sectionsWithErrors(Object.keys(form.errors))}
        />
        <div className="flex min-w-0 flex-col gap-4">
          <EditorSectionHeading section={active} name={title} />
          <p className="m-0 flex items-start gap-2.5 rounded-xl border border-solid border-border bg-page px-3.5 py-3 text-caption text-text">
            <Icon name="lock" size={18} className="mt-px flex-none text-muted-foreground" />
            {fixedNote}
          </p>
          {children({ activeKey: form.activeKey, errors: form.errors, onEdit: form.markDirty })}
        </div>
      </div>
    </form>
  );
};
