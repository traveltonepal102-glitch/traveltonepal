"use client";

import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";

import { toolbarButtonClass } from "./richTextStyles";

const textButton = cn(toolbarButtonClass, "w-auto px-2 text-xs font-bold");

/**
 * "Insert a table" in a text editor's toolbar, and while the cursor is in a table, its row and column buttons.
 * A table can't go inside a list or another table (the shared format allows neither).
 */
export const TableButtons = ({ editor }: { editor: Editor }) => {
  const { isInTable, isInList } = useEditorState({
    editor,
    selector: ({ editor: current }) => ({ isInTable: current.isActive("table"), isInList: current.isActive("listItem") }),
  });
  const chain = () => editor.chain().focus();
  const insertLabel = isInTable
    ? "Tables can't go inside a table"
    : isInList
      ? "Tables can't go inside a list"
      : "Insert a table (3 × 2, with a heading row)";

  return (
    <>
      <button
        type="button"
        aria-label={insertLabel}
        title={insertLabel}
        aria-pressed={isInTable}
        disabled={isInList || isInTable}
        onClick={() => chain().insertTable({ rows: 3, cols: 2, withHeaderRow: true }).run()}
        className={toolbarButtonClass}
      >
        <Icon name="table" />
      </button>
      {isInTable && (
        <>
          <button type="button" className={textButton} onClick={() => chain().addRowAfter().run()}>+ Row</button>
          <button type="button" className={textButton} onClick={() => chain().addColumnAfter().run()}>+ Column</button>
          <button type="button" className={textButton} onClick={() => chain().deleteRow().run()}>− Row</button>
          <button type="button" className={textButton} onClick={() => chain().deleteColumn().run()}>− Column</button>
          <button type="button" className={cn(textButton, "text-danger")} onClick={() => chain().deleteTable().run()}>Delete table</button>
        </>
      )}
    </>
  );
};
