"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { InsertPhotoButton } from "@/components/ui/richText/InsertPhotoButton";
import { LinkButton } from "@/components/ui/richText/LinkButton";
import { toolbarButtonClass } from "@/components/ui/richText/richTextStyles";

const SECTION_HEADING = { level: 2 } as const;
const SMALL_HEADING = { level: 3 } as const;

const ToolbarButton = ({ icon, label, isActive, onClick }: { icon: IconName; label: string; isActive?: boolean; onClick: () => void }) => (
  <button type="button" aria-label={label} title={label} aria-pressed={isActive} onClick={onClick} className={toolbarButtonClass}>
    <Icon name={icon} />
  </button>
);

const textButton = cn(toolbarButtonClass, "w-auto px-2 text-xs font-bold");
const Divider = () => <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />;

/**
 * The legal editor's toolbar (design: "lg-bar"): text type (normal, numbered section heading, small heading), bold,
 * italic, lists, link, table (with row and column buttons while inside one), undo and redo.
 */
export const LegalTextToolbar = ({ editor }: { editor: Editor }) => {
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      textType: current.isActive("heading", SECTION_HEADING) ? "section" : current.isActive("heading", SMALL_HEADING) ? "small" : "paragraph",
      isBold: current.isActive("bold"),
      isItalic: current.isActive("italic"),
      isBulletList: current.isActive("bulletList"),
      isOrderedList: current.isActive("orderedList"),
      isInTable: current.isActive("table"),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });
  const chain = () => editor.chain().focus();

  return (
    <div role="group" aria-label="Formatting" className="sticky top-31 z-10 flex flex-wrap items-center gap-0.5 rounded-t-md border-b border-solid border-border bg-page px-1.5 py-1">
      <select
        aria-label="Text type"
        value={active.textType}
        onChange={(event) => {
          const type = event.target.value;
          if (type === "section") chain().setHeading(SECTION_HEADING).run();
          else if (type === "small") chain().setHeading(SMALL_HEADING).run();
          else chain().setParagraph().run();
        }}
        className="m-0 h-8 cursor-pointer rounded-sm border-0 bg-transparent px-1.5 font-sans text-caption font-semibold text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
      >
        <option value="paragraph">Normal text</option>
        <option value="section">Section heading (numbered)</option>
        <option value="small">Small heading</option>
      </select>
      <Divider />
      <ToolbarButton icon="format_bold" label="Bold" isActive={active.isBold} onClick={() => chain().toggleBold().run()} />
      <ToolbarButton icon="format_italic" label="Italic" isActive={active.isItalic} onClick={() => chain().toggleItalic().run()} />
      <Divider />
      <ToolbarButton icon="format_list_bulleted" label="Bulleted list" isActive={active.isBulletList} onClick={() => chain().toggleBulletList().run()} />
      <ToolbarButton icon="format_list_numbered" label="Numbered list" isActive={active.isOrderedList} onClick={() => chain().toggleOrderedList().run()} />
      <LinkButton editor={editor} />
      <InsertPhotoButton editor={editor} />
      <Divider />
      <ToolbarButton icon="table" label="Insert a table (3 × 2, with a heading row)" isActive={active.isInTable} onClick={() => chain().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()} />
      {active.isInTable && (
        <>
          <button type="button" className={textButton} onClick={() => chain().addRowAfter().run()}>+ Row</button>
          <button type="button" className={textButton} onClick={() => chain().addColumnAfter().run()}>+ Column</button>
          <button type="button" className={textButton} onClick={() => chain().deleteRow().run()}>− Row</button>
          <button type="button" className={textButton} onClick={() => chain().deleteColumn().run()}>− Column</button>
          <button type="button" className={cn(textButton, "text-danger")} onClick={() => chain().deleteTable().run()}>Delete table</button>
        </>
      )}
      <span className="flex-1" />
      <button type="button" aria-label="Undo" title="Undo (Ctrl+Z / ⌘Z)" disabled={!active.canUndo} onClick={() => chain().undo().run()} className={toolbarButtonClass}>
        <Icon name="undo" />
      </button>
      <button type="button" aria-label="Redo" title="Redo (Ctrl+Shift+Z / ⌘⇧Z)" disabled={!active.canRedo} onClick={() => chain().redo().run()} className={toolbarButtonClass}>
        <Icon name="redo" />
      </button>
    </div>
  );
};
