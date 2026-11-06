import type { MouseEvent } from "react";

/** A click that should change the list here; opening a link in a new tab or window stays the browser's job. */
export const isPlainClick = (event: MouseEvent) => !event.metaKey && !event.ctrlKey && !event.shiftKey;
