"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { cn } from "@ttn/ui/lib/utils";
import { useEffect, useId, useState } from "react";

import { FieldError } from "@/components/ui/FieldError";
import { LEGAL_TEXT_EXTENSIONS } from "@/components/ui/richText/legalExtensions";
import { editorContentClass } from "@/components/ui/richText/richTextStyles";
import { legalTextToPlainText, splitLegalSections, toLegalTextDoc } from "@/lib/richText/legalText";
import type { LegalTextDoc } from "@/lib/richText/legalText";

import { LegalTextToolbar } from "./LegalTextToolbar";

type LegalTextEditorProps = {
  /** The form field: the text as JSON, checked on the server with legalTextField(). */
  name: string;
  /** The page's title, for screen readers ("Terms and booking conditions"). */
  label: string;
  defaultValue: LegalTextDoc;
  error?: string;
  onEdit: () => void;
};

/** Section headings numbered as on the website, tables with lines (design: .lg-doc). */
const LEGAL_DOC_CLASS = cn(
  editorContentClass,
  "min-h-130 px-5 py-4 text-body [counter-reset:legal] [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-extrabold [&_h2:first-child]:mt-0",
  "[&_h2]:[counter-increment:legal] [&_h2]:before:mr-2 [&_h2]:before:text-brand [&_h2]:before:content-[counter(legal)'.']",
  "[&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-solid [&_td]:border-border [&_td]:p-2 [&_th]:border [&_th]:border-solid [&_th]:border-border [&_th]:bg-page [&_th]:p-2 [&_th]:text-left",
);

const wordCount = (doc: LegalTextDoc) => legalTextToPlainText(doc).split(/\s+/).filter(Boolean).length;

/**
 * One legal page's whole text in one editor (design: Admin-pages, "Legal pages"): "Section heading (numbered)" lines
 * become the page's sections and its "On this page" list. Write or paste it (from Word too: tables are kept).
 */
export const LegalTextEditor = ({ name, label, defaultValue, error, onEdit }: LegalTextEditorProps) => {
  const id = useId();
  const [doc, setDoc] = useState(defaultValue);
  const editor = useEditor({
    extensions: LEGAL_TEXT_EXTENSIONS,
    content: defaultValue,
    // The server can't render the editor; it appears once the page is running in the browser.
    immediatelyRender: false,
    onUpdate: ({ editor: current }) => {
      setDoc(toLegalTextDoc(current.getJSON()));
      onEdit();
    },
  });

  useEffect(() => {
    editor?.setOptions({
      editorProps: {
        attributes: { role: "textbox", "aria-multiline": "true", "aria-label": label, ...(error && { "aria-invalid": "true", "aria-describedby": `${id}-error` }), class: LEGAL_DOC_CLASS },
      },
    });
  }, [editor, error, id, label]);

  const { sections } = splitLegalSections(doc);
  // What the editor holds, sent as typed (the server checks it, and says what can't be saved).
  const json = editor ? JSON.stringify(editor.getJSON()) : JSON.stringify(defaultValue);

  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <div className="flex flex-col gap-1.5 rounded-t-lg border border-b-0 border-solid border-border bg-page px-4 py-3">
        <span className="flex flex-wrap items-baseline gap-2">
          <strong className="text-ink">On this page</strong>
          <span className="text-xs text-muted-foreground">Made from your section headings. Numbers are added by themselves.</span>
        </span>
        {sections.length ? (
          <ol className="m-0 flex list-none flex-wrap gap-1.5 p-0">
            {sections.map((section, index) => (
              <li key={`${index}-${section.heading}`} className="rounded-full border border-solid border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-text">
                {index + 1}. {section.heading}
              </li>
            ))}
          </ol>
        ) : (
          <span className="text-caption text-saffron-ink">No sections yet: pick “Section heading (numbered)” for each heading.</span>
        )}
      </div>
      <div className={cn("-mt-1.5 rounded-b-md border border-solid bg-surface focus-within:border-brand focus-within:ring-3 focus-within:ring-brand/15", error ? "border-danger" : "border-input")}>
        {editor ? <LegalTextToolbar editor={editor} /> : <div className="h-10 border-b border-solid border-border bg-page" />}
        {editor ? <EditorContent editor={editor} /> : <div className="min-h-130" />}
      </div>
      <div className="flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {sections.length} sections · {wordCount(doc)} words
        </span>
        <span>Allowed: section headings, small headings, bold, italic, lists, links and tables. Colours and font sizes come from the design.</span>
      </div>
      <FieldError id={`${id}-error`} message={error} />
      <input type="hidden" name={name} value={json} />
    </div>
  );
};
