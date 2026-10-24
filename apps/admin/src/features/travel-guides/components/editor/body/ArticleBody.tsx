"use client";

import { Icon } from "@ttn/ui/icon";
import { useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { SortableList } from "@/components/ui/SortableList";
import type { useRowList } from "@/hooks/useRowList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../lib/sectionContext";
import type { EditorSection } from "../../../lib/sectionDrafts";
import { copySection, newSection, sectionsJson } from "../../../lib/sectionDrafts";
import { SECTION_KINDS, sectionKindOf } from "../../../sectionKinds";
import { AddSectionPanel } from "./AddSectionPanel";
import { SectionCard } from "./SectionCard";

type ArticleBodyProps = {
  /** The editor's sections (useRowList), top to bottom. */
  sections: ReturnType<typeof useRowList<EditorSection>>;
  /** What the sections pick from and share (its months are sent as "months"). */
  context: SectionContext;
  errors: FieldErrors;
};

const ONCE_PER_ARTICLE = SECTION_KINDS.flatMap((kind) => (kind.isOncePerArticle && kind.type ? [kind.type] : []));

const AddHere = ({ onClick }: { onClick: () => void }) => (
  <div className="flex items-center gap-2 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
    <button
      type="button"
      onClick={onClick}
      className="m-0 inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-line-strong bg-surface px-3 font-sans text-xs font-bold text-brand hover:border-brand focus-visible:outline-2 focus-visible:outline-ring"
    >
      <Icon name="add" size={16} />
      Add section here
    </button>
  </div>
);

/**
 * "Article body": the sections, top to bottom, each sent in one JSON field ("sections"). Drag a section by its
 * handle to move it; "Add section here" between them opens the catalog for that spot.
 */
export const ArticleBody = ({ sections, context, errors }: ArticleBodyProps) => {
  /** The section a new one goes after (-1: the top), while the catalog is open. */
  const [insertAfter, setInsertAfter] = useState<number | null>(null);
  const { rows } = sections;
  const usedOnceTypes = ONCE_PER_ARTICLE.filter((type) => rows.some((row) => row.type === type));
  const nameOf = (row: EditorSection) => ("heading" in row && row.heading.trim()) || sectionKindOf(row.type).name;
  const placeLabel =
    insertAfter === null || insertAfter < 0 ? "at the top of the article body" : insertAfter >= rows.length - 1 ? "at the end of the article" : `after “${nameOf(rows[insertAfter])}”`;

  return (
    <div className="flex flex-col gap-3">
      <input type="hidden" name="sections" value={sectionsJson(rows)} />
      <input type="hidden" name="months" value={JSON.stringify(context.months)} />
      <div className="px-0.5 pt-2">
        <h2 className="m-0 font-display text-[17px] font-bold text-ink">
          Article body <span className="font-sans text-caption font-semibold text-muted-foreground">· {rows.length} {rows.length === 1 ? "section" : "sections"}</span>
        </h2>
        <p className="m-0 text-xs text-muted-foreground">The article is built from sections, top to bottom. Drag a section by its handle to move it, or click “Add section here” to put a new one in that spot.</p>
      </div>
      <FieldError id="sections-error" message={errors.sections} />

      <AddHere onClick={() => setInsertAfter(-1)} />
      <SortableList items={rows} itemLabel={(row, index) => `section ${index + 1}, ${nameOf(row)}`} onMove={sections.move} className="gap-3">
        {(row, index, handle) => (
          <div className="flex flex-col gap-3">
            <SectionCard
              section={row}
              index={index}
              count={rows.length}
              context={context}
              handle={handle}
              errors={errors}
              onChange={(section) => sections.update(row.key, section)}
              onMove={(to) => sections.move(index, to)}
              onCopy={ONCE_PER_ARTICLE.includes(row.type) ? null : () => sections.add(copySection(row), index + 1)}
              onRemove={() => sections.remove(row.key)}
            />
            <AddHere onClick={() => setInsertAfter(index)} />
          </div>
        )}
      </SortableList>

      {insertAfter !== null && (
        <AddSectionPanel
          placeLabel={placeLabel}
          usedOnceTypes={usedOnceTypes}
          onAdd={(type) => {
            sections.add(newSection(type), insertAfter + 1);
            setInsertAfter(null);
          }}
          onClose={() => setInsertAfter(null)}
        />
      )}
    </div>
  );
};
