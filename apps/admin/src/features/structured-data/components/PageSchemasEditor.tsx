"use client";

import { Icon } from "@ttn/ui/icon";

import { EditorHeader } from "@/components/editor/EditorHeader";
import type { EditorSaveAction } from "@/components/editor/types";
import { useEditorForm } from "@/components/editor/useEditorForm";
import { FormAlert } from "@/components/ui/FormAlert";
import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { AutomaticSchema } from "../constants";
import type { SchemaBlock, SchemaPage } from "../types";
import { AutomaticSchemasCard } from "./AutomaticSchemasCard";
import { SchemaBlockList } from "./SchemaBlockList";

type PageSchemasEditorProps = {
  action: EditorSaveAction;
  page: SchemaPage;
  blocks: SchemaBlock[];
  automaticSchemas: AutomaticSchema[];
  /** The live page; null when the website address isn't set up. */
  pageUrl: string | null;
  /** Only a Super admin may save. */
  canEdit: boolean;
  /** e.g. "Saved 23 Oct, 11:32". */
  lastSaved?: string;
};

const SECTION = ADMIN_SECTIONS.structuredData;

const Notice = ({ children }: { children: string }) => (
  <p className="m-0 flex items-start gap-2.5 rounded-md bg-brand-tint px-3.5 py-3 text-ink">
    <Icon name="info" size={20} className="flex-none text-brand" />
    {children}
  </p>
);

/** One page's structured data: what the website writes by itself, and the page's own JSON-LD blocks. One Save. */
export const PageSchemasEditor = ({ action, page, blocks, automaticSchemas, pageUrl, canEdit, lastSaved }: PageSchemasEditorProps) => {
  const form = useEditorForm({ action, firstKey: "schemas", firstSectionWithError: () => undefined, isNew: false, lastSaved });
  const [status, statusTone] = form.saveStatus;

  return (
    <form noValidate onSubmit={form.handleSubmit} onChange={form.markDirty} className="flex max-w-240 flex-col gap-4">
      <fieldset disabled={!canEdit} className="m-0 flex min-w-0 flex-col gap-4 border-0 p-0">
        <EditorHeader
          back={{ href: SECTION.href, label: SECTION.label }}
          title={`${page.name} · structured data`}
          status={status}
          statusTone={statusTone}
          saveLabel="Save"
          isSaving={form.isSaving}
        />
        {form.state.status === "error" && <FormAlert message={form.state.message} />}
        {!canEdit && <Notice>Only a Super admin can change structured data. You can see it here.</Notice>}
        {page.offlineNote && <Notice>{`${page.offlineNote}. Its schemas are saved now and appear once the page is on the website.`}</Notice>}
        <AutomaticSchemasCard schemas={automaticSchemas} pageUrl={pageUrl} />
        <SchemaBlockList blocks={blocks} automaticTypes={automaticSchemas.map((schema) => schema.type)} errors={form.errors} onEdit={form.markDirty} />
      </fieldset>
    </form>
  );
};
