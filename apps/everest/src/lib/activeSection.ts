/** Where a section is on the screen, in the page's order. */
export type SectionPosition = { id: string; top: number; bottom: number };

/**
 * The section being read: the last one that has reached the line under the menu. A section without a menu link (the
 * highlights after the overview) counts as the one before it. Before the first or past the end of the last: none.
 */
export const activeSectionAt = (sections: readonly SectionPosition[], line: number): string | null => {
  const reached = sections.filter((section) => section.top <= line).at(-1);
  if (!reached) return null;
  return reached === sections.at(-1) && reached.bottom < line ? null : reached.id;
};
