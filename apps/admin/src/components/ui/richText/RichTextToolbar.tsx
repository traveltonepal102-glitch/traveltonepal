"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { Icon } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";

import { LinkButton } from "./LinkButton";
import { toolbarButtonClass } from "./richTextStyles";

type ToolbarButtonProps = {
  icon: IconName;
  label: string;
  /** Shown in the tooltip, e.g. "B" → "Bold (Ctrl+B / ⌘B)". */
  shortcutKey?: string;
  isActive: boolean;
  onClick: () => void;
};

const ToolbarButton = ({ icon, label, shortcutKey, isActive, onClick }: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-keyshortcuts={shortcutKey ? `Control+${shortcutKey} Meta+${shortcutKey}` : undefined}
    title={shortcutKey ? `${label} (Ctrl+${shortcutKey} / ⌘${shortcutKey})` : label}
    aria-pressed={isActive}
    onClick={onClick}
    className={toolbarButtonClass}
  >
    <Icon name={icon} />
  </button>
);

const Divider = () => <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />;

const SMALL_HEADING = { level: 3 } as const;

type RichTextToolbarProps = {
  editor: Editor;
};

/** Normal text or small heading, bold, italic, the two list types, link, undo and redo: everything the rich text allows. */
export const RichTextToolbar = ({ editor }: RichTextToolbarProps) => {
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      isBold: current.isActive("bold"),
      isItalic: current.isActive("italic"),
      isBulletList: current.isActive("bulletList"),
      isOrderedList: current.isActive("orderedList"),
      isSmallHeading: current.isActive("heading", SMALL_HEADING),
      canUndo: current.can().undo(),
      canRedo: current.can().redo(),
    }),
  });

  return (
    <div role="group" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 rounded-t-md border-b border-solid border-border bg-page px-1.5 py-1">
      <select
        aria-label="Text type"
        value={active.isSmallHeading ? "heading" : "paragraph"}
        onChange={(event) =>
          event.target.value === "heading" ? editor.chain().focus().setHeading(SMALL_HEADING).run() : editor.chain().focus().setParagraph().run()
        }
        className="m-0 h-8 cursor-pointer rounded-sm border-0 bg-transparent px-1.5 font-sans text-caption font-semibold text-text hover:bg-surface focus-visible:outline-2 focus-visible:outline-ring"
      >
        <option value="paragraph">Normal text</option>
        <option value="heading">Small heading</option>
      </select>
      <Divider />
      <ToolbarButton
        icon="format_bold"
        label="Bold"
        shortcutKey="B"
        isActive={active.isBold}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        icon="format_italic"
        label="Italic"
        shortcutKey="I"
        isActive={active.isItalic}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <Divider />
      <ToolbarButton
        icon="format_list_bulleted"
        label="Bullet list"
        isActive={active.isBulletList}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        icon="format_list_numbered"
        label="Numbered list"
        isActive={active.isOrderedList}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <Divider />
      <LinkButton editor={editor} />
      <span className="flex-1" />
      <button type="button" aria-label="Undo" title="Undo (Ctrl+Z / ⌘Z)" disabled={!active.canUndo} onClick={() => editor.chain().focus().undo().run()} className={toolbarButtonClass}>
        <Icon name="undo" />
      </button>
      <button type="button" aria-label="Redo" title="Redo (Ctrl+Shift+Z / ⌘⇧Z)" disabled={!active.canRedo} onClick={() => editor.chain().focus().redo().run()} className={toolbarButtonClass}>
        <Icon name="redo" />
      </button>
    </div>
  );
};
