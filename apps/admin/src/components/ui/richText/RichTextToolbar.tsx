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

type RichTextToolbarProps = {
  editor: Editor;
};

/** Bold, italic, the two list types and link: everything the rich text allows. */
export const RichTextToolbar = ({ editor }: RichTextToolbarProps) => {
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      isBold: current.isActive("bold"),
      isItalic: current.isActive("italic"),
      isBulletList: current.isActive("bulletList"),
      isOrderedList: current.isActive("orderedList"),
    }),
  });

  return (
    <div role="group" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 rounded-t-md border-b border-solid border-border bg-page px-1.5 py-1">
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
    </div>
  );
};
