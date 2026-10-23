"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { cn } from "@ttn/ui/lib/utils";
import { useEffect, useId, useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { hintClass, labelClass } from "@/components/ui/formStyles";
import { richTextToPlainText } from "@/lib/richText/richText";
import type { RichTextDoc } from "@/lib/richText/richText";

import { RICH_TEXT_EXTENSIONS } from "./extensions";
import { editorContentClass } from "./richTextStyles";
import { RichTextToolbar } from "./RichTextToolbar";

type RichTextEditorProps = {
  /** The form field: the document as JSON, checked on the server with richTextField(). */
  name: string;
  label: string;
  hint?: string;
  error?: string;
  defaultValue: RichTextDoc;
  /** Words only, not formatting. Shows a counter; the server enforces it. */
  maxLength: number;
  /** "compact" for short answers, "default" for an introduction. */
  size?: "default" | "compact";
  /** Called on every change (the form can't see changes inside the editor). */
  onEdit?: () => void;
};

const MIN_HEIGHT = { default: "min-h-40", compact: "min-h-20" };

/** Rich text field for admin forms: bold, italic, lists and links (see src/lib/richText). */
export const RichTextEditor = ({ name, label, hint, error, defaultValue, maxLength, size = "default", onEdit }: RichTextEditorProps) => {
  const id = useId();
  const [json, setJson] = useState(() => JSON.stringify(defaultValue));
  const [length, setLength] = useState(() => richTextToPlainText(defaultValue).length);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  const editor = useEditor({
    extensions: RICH_TEXT_EXTENSIONS,
    content: defaultValue,
    // The server can't render the editor; it appears once the page is running in the browser.
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      setJson(JSON.stringify(current.getJSON()));
      setLength(current.getText({ blockSeparator: "\n\n" }).trim().length);
      onEdit?.();
    },
  });

  // The editable area is a <div>, not an input: give it its label, hint, error and size.
  useEffect(() => {
    editor?.setOptions({
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-multiline": "true",
          "aria-labelledby": `${id}-label`,
          ...(describedBy && { "aria-describedby": describedBy }),
          ...(error && { "aria-invalid": "true" }),
          class: cn(editorContentClass, MIN_HEIGHT[size]),
        },
      },
    });
  }, [editor, id, describedBy, error, size]);

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span id={`${id}-label`} className={labelClass} onClick={() => editor?.commands.focus()}>
          {label}
        </span>
        <span aria-hidden="true" className={cn("text-caption font-semibold", length > maxLength ? "text-danger" : "text-whatsapp")}>
          {length} / {maxLength}
        </span>
      </div>
      <div
        className={cn(
          "rounded-md border border-solid bg-surface focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/15",
          error ? "border-danger" : "border-input",
        )}
      >
        {editor ? <RichTextToolbar editor={editor} /> : <div className="h-10 rounded-t-md border-b border-solid border-border bg-page" />}
        {editor ? <EditorContent editor={editor} /> : <div className={MIN_HEIGHT[size]} />}
      </div>
      {hint && (
        <p id={`${id}-hint`} className={hintClass}>
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
      <input type="hidden" name={name} value={json} />
    </div>
  );
};
