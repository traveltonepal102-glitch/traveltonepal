"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { leavingPath } from "./leaveGuard";
import type { EditorSaveState } from "./types";

/** Where the admin was going when asked: another admin page through a link, or the browser's Back. */
type LeaveTarget = { kind: "link"; href: string } | { kind: "back" };

/** Marks the extra history entry that lets the browser's Back be asked about first. */
const GUARD_KEY = "__ttnLeaveGuard";

/** Goes where the admin was going. */
const goTo = (to: LeaveTarget, router: ReturnType<typeof useRouter>) => {
  if (to.kind === "link") router.push(to.href);
  else window.history.back();
};

/** The admin page a click opens in this tab, or null (a new tab, a download, another site, a link in text being edited). */
const clickedAdminPath = (event: MouseEvent): string | null => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (!(link instanceof HTMLAnchorElement) || link.hasAttribute("download") || link.closest("[contenteditable='true']")) return null;
  if (link.target && link.target !== "_self") return null;
  return leavingPath(link.href, window.location.href);
};

type UseLeaveGuardOptions = {
  /** Unsaved changes: leaving is asked about first. */
  isDirty: boolean;
  /** The editor's last save result, to leave once the dialog's Save has worked. */
  saveState: EditorSaveState;
  /** The editor's Status picker value when asked ("draft"…), or null without one. */
  readStatus: () => string | null;
};

/**
 * Asks before an editor with unsaved changes is left inside the admin: a link (Back, the menu…) or the browser's Back
 * button. Closing or reloading the tab is the browser's own question (useUnsavedChangesWarning), which can't offer
 * Save. Back works through an extra history entry for this page, added while there are unsaved changes.
 */
export const useLeaveGuard = ({ isDirty, saveState, readStatus }: UseLeaveGuardOptions) => {
  const router = useRouter();
  const [target, setTarget] = useState<LeaveTarget | null>(null);
  /** The Status picker's value when the question opened. */
  const [status, setStatus] = useState<string | null>(null);
  const readStatusRef = useRef(readStatus);
  /** The save result before the dialog's Save, so the next one tells whether it worked. */
  const [savingFrom, setSavingFrom] = useState<EditorSaveState | null>(null);
  /** Where to go once the dialog's Save has worked. */
  const [leaveAfterSave, setLeaveAfterSave] = useState<LeaveTarget | null>(null);
  const isDirtyRef = useRef(isDirty);
  const hasGuardEntry = useRef(false);
  const isLeaving = useRef(false);

  const leave = (to: LeaveTarget) => {
    isLeaving.current = true;
    setTarget(null);
    goTo(to, router);
  };

  useEffect(() => {
    isDirtyRef.current = isDirty;
    readStatusRef.current = readStatus;
  }, [isDirty, readStatus]);

  const ask = (to: LeaveTarget) => {
    setStatus(readStatusRef.current());
    setTarget(to);
  };

  // Links are asked about before the router sees the click (capture phase, ahead of React's handlers).
  useEffect(() => {
    if (!isDirty) return;
    const handleClick = (event: MouseEvent) => {
      const href = clickedAdminPath(event);
      if (!href) return;
      event.preventDefault();
      event.stopPropagation();
      ask({ kind: "link", href });
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [isDirty]);

  // Back first returns to this same page (the extra entry's own), where the question is asked.
  useEffect(() => {
    if (!isDirty || target || hasGuardEntry.current || isLeaving.current) return;
    window.history.pushState({ ...window.history.state, [GUARD_KEY]: true }, "", window.location.href);
    hasGuardEntry.current = true;
  }, [isDirty, target]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (!hasGuardEntry.current || isLeaving.current || event.state?.[GUARD_KEY]) return;
      hasGuardEntry.current = false;
      // Saved since: nothing to ask, Back goes on to the page before.
      if (!isDirtyRef.current) {
        isLeaving.current = true;
        window.history.back();
        return;
      }
      ask({ kind: "back" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // The dialog's Save finished: leave once it has worked; on a problem, stay to show it.
  if (savingFrom && saveState !== savingFrom) {
    setSavingFrom(null);
    setTarget(null);
    if (saveState.status === "saved" && target) setLeaveAfterSave(target);
  }

  useEffect(() => {
    if (!leaveAfterSave) return;
    isLeaving.current = true;
    goTo(leaveAfterSave, router);
  }, [leaveAfterSave, router]);

  return {
    /** The question is open. */
    isAsking: target !== null,
    /** The Status picker's value when asked, or null without one. */
    status,
    isSavingToLeave: savingFrom !== null,
    /** Keep editing (Back's extra entry comes back by itself). */
    stay: () => setTarget(null),
    /** Leave without saving. */
    discard: () => target && leave(target),
    /** Save (`submit` sends the editor's form), then leave once saved. */
    saveThenLeave: (submit: () => void) => {
      setSavingFrom(saveState);
      submit();
    },
  };
};
