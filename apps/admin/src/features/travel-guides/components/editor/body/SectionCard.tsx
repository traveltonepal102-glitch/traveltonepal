import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { ghostIconButton } from "@/components/ui/buttonStyles";
import type { DragHandleProps } from "@/components/ui/SortableList";
import { DragHandle } from "@/components/ui/SortableList";
import type { FieldErrors } from "@/lib/forms/fieldErrors";

import type { SectionContext } from "../../../lib/sectionContext";
import type { EditorSection } from "../../../lib/sectionDrafts";
import { SECTION_GROUPS, sectionKindOf } from "../../../sectionKinds";
import { SectionFields } from "./SectionFields";

type SectionCardProps = {
  section: EditorSection;
  /** Its place in the body (0 first), for the buttons and its errors. */
  index: number;
  count: number;
  context: SectionContext;
  /** The drag handle that moves the section (from SortableList). */
  handle: DragHandleProps;
  errors: FieldErrors;
  onChange: (section: EditorSection) => void;
  onMove: (to: number) => void;
  /** Null when the kind is once per article (no copies). */
  onCopy: (() => void) | null;
  onRemove: () => void;
};

/** One section of the article body (design: .ad-blk): drag to move, its kind, move, copy and delete, then its fields. */
export const SectionCard = ({ section, index, count, context, handle, errors, onChange, onMove, onCopy, onRemove }: SectionCardProps) => {
  const kind = sectionKindOf(section.type);
  const tone = SECTION_GROUPS.find((group) => group.value === kind.group)?.tone;
  const name = "heading" in section && section.heading.trim() ? section.heading : kind.name;

  return (
    <section aria-label={`${kind.name}, section ${index + 1}`} className="overflow-hidden rounded-lg border border-solid border-border bg-surface">
      <div className="flex items-center gap-2 border-b border-solid border-border bg-page py-2 pr-3 pl-1.5">
        <DragHandle {...handle} />
        <span className={cn("inline-flex size-6.5 flex-none items-center justify-center rounded-md", tone)}>
          <Icon name={kind.icon} size={16} />
        </span>
        <span className="min-w-0 flex-1 truncate text-caption font-bold text-ink">{name}</span>
        <button type="button" className={ghostIconButton} aria-label="Move up" title="Move up" disabled={index === 0} onClick={() => onMove(index - 1)}>
          <Icon name="keyboard_arrow_up" size={18} />
        </button>
        <button type="button" className={ghostIconButton} aria-label="Move down" title="Move down" disabled={index === count - 1} onClick={() => onMove(index + 1)}>
          <Icon name="keyboard_arrow_down" size={18} />
        </button>
        {onCopy && (
          <button type="button" className={ghostIconButton} aria-label="Duplicate" title="Duplicate" onClick={onCopy}>
            <Icon name="content_copy" size={18} />
          </button>
        )}
        <button type="button" className={ghostIconButton} aria-label="Delete section" title="Delete" onClick={onRemove}>
          <Icon name="delete" size={18} />
        </button>
      </div>
      <div className="flex flex-col gap-2.5 px-4 py-3.5">
        <SectionFields section={section} index={index} context={context} errors={errors} onChange={onChange} />
      </div>
    </section>
  );
};
