"use client";

import { createContext, use } from "react";
import type { ReactNode } from "react";
import { flushSync } from "react-dom";

import type { EditorSection } from "./types";

type SectionLinks = {
  /** The section's name, e.g. "Day-by-day itinerary". */
  labelOf: (key: string) => string | undefined;
  /** Opens a section; with a target id, scrolls to that element and puts the cursor in its first field. */
  show: (key: string, targetId?: string) => void;
};

const SectionLinksContext = createContext<SectionLinks | null>(null);

const FIRST_FIELD = "input:not([type=hidden]), textarea, select, [contenteditable=true]";

type EditorSectionLinksProps<Key extends string> = {
  sections: readonly EditorSection<Key>[];
  /** The editor's section switch (useEditorForm's setActiveKey). */
  onShow: (key: Key) => void;
  children: ReactNode;
};

/** Lets a field anywhere in an editor link to the section its value comes from ("change it in …"). */
export const EditorSectionLinks = <Key extends string>({ sections, onShow, children }: EditorSectionLinksProps<Key>) => {
  const show = (key: string, targetId?: string) => {
    const section = sections.find((item) => item.key === key);
    if (!section) return;
    // Shown at once, so the target below is on screen before scrolling to it.
    flushSync(() => onShow(section.key));

    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.querySelector<HTMLElement>(FIRST_FIELD)?.focus({ preventScroll: true });
  };
  const labelOf = (key: string) => sections.find((item) => item.key === key)?.label;

  return <SectionLinksContext value={{ show, labelOf }}>{children}</SectionLinksContext>;
};

/** null outside an editor (a note then names the place without a link). */
export const useEditorSectionLinks = () => use(SectionLinksContext);
