"use client";

import { Popover } from "@base-ui/react/popover";
import type { Editor } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import { Icon } from "@ttn/ui/icon";
import { cn } from "@ttn/ui/lib/utils";
import { useId, useState } from "react";
import type { KeyboardEvent } from "react";

import { primaryButton, secondaryButton } from "@/components/ui/buttonStyles";
import { FieldError } from "@/components/ui/FieldError";
import { hintClass, inputClass, labelClass } from "@/components/ui/formStyles";
import { isSafeHref, normalizeHref } from "@/lib/richText/richText";

import { toolbarButtonClass } from "./richTextStyles";

type LinkButtonProps = {
  editor: Editor;
};

const smallButton = "min-h-8 px-3 text-caption";

/** Add, change or remove a link on the selected words (or insert the address as a link). */
export const LinkButton = ({ editor }: LinkButtonProps) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const currentHref = useEditorState({
    editor,
    selector: ({ editor: current }) => {
      const href: unknown = current.getAttributes("link").href;
      return typeof href === "string" ? href : "";
    },
  });

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) return;
    setAddress(currentHref);
    setError("");
  };

  const apply = () => {
    const href = normalizeHref(address);
    if (!isSafeHref(href)) {
      setError("Use a web address (nepal.gov.np), an email, or a page on our site (/treks/…).");
      return;
    }
    const chain = editor.chain().focus();
    if (editor.state.selection.empty && !editor.isActive("link")) {
      chain.insertContent({ type: "text", text: href, marks: [{ type: "link", attrs: { href } }] }).run();
    } else {
      chain.extendMarkRange("link").setLink({ href }).run();
    }
    setIsOpen(false);
  };

  const remove = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setIsOpen(false);
  };

  // Enter applies the link instead of reaching anything else.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    apply();
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger
        aria-label={currentHref ? "Change link" : "Add link"}
        title={currentHref ? "Change link" : "Add link"}
        data-active={currentHref ? "" : undefined}
        className={toolbarButtonClass}
      >
        <Icon name="link" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="bottom" align="start" sideOffset={6} collisionPadding={12} className="z-100">
          <Popover.Popup className="flex w-80 max-w-[calc(100vw-24px)] flex-col gap-2 rounded-lg border border-solid border-border bg-surface p-3 shadow-popover outline-none">
            <label htmlFor={`${id}-href`} className={labelClass}>
              Link address
            </label>
            <input
              id={`${id}-href`}
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="nepal.gov.np or /treks/langtang-valley"
              aria-invalid={error ? true : undefined}
              aria-describedby={`${id}-hint ${id}-error`}
              className={inputClass}
            />
            <p id={`${id}-hint`} className={hintClass}>
              Select words first to turn them into the link; otherwise the address itself is added.
            </p>
            <FieldError id={`${id}-error`} message={error} />
            <div className="flex justify-end gap-2">
              {currentHref && (
                <button type="button" onClick={remove} className={cn(secondaryButton, smallButton)}>
                  <Icon name="link_off" size={16} />
                  Remove link
                </button>
              )}
              <button type="button" onClick={apply} className={cn(primaryButton, smallButton)}>
                Apply
              </button>
            </div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
};
