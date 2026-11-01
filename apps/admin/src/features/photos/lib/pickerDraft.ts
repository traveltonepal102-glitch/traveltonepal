import type { Photo } from "../types";

/**
 * A click in a gallery's "Choose photos" window: a chosen photo is taken away, another is added at the end while
 * there is room (`max`); when full, nothing changes.
 */
export const togglePick = <Picked extends Photo>(draft: readonly Picked[], photo: Picked, max: number): Picked[] => {
  if (draft.some((picked) => picked.id === photo.id)) return draft.filter((picked) => picked.id !== photo.id);
  return draft.length < max ? [...draft, photo] : [...draft];
};

/** An upload finished in the window: added like a click, unless it is already there. */
export const addPick = <Picked extends Photo>(draft: readonly Picked[], photo: Picked, max: number): Picked[] =>
  draft.some((picked) => picked.id === photo.id) ? [...draft] : togglePick(draft, photo, max);
