import type { EditorSection } from "./types";

/**
 * Finds which editor sections a save's field errors belong to ("faqs.2.answer" → the field "faqs" → its
 * section), so the editor can mark them and open the first one.
 */
export const createSectionErrorLookup = <Key extends string>(
  sections: EditorSection<Key>[],
  fieldSections: Record<string, Key>,
) => {
  const sectionsWithErrors = (fields: string[]): Set<Key> =>
    new Set(fields.map((field) => fieldSections[field.split(".")[0]]).filter(Boolean));

  const firstSectionWithError = (fields: string[]): Key | undefined => {
    const withErrors = sectionsWithErrors(fields);
    return sections.find((section) => withErrors.has(section.key))?.key;
  };

  return { sectionsWithErrors, firstSectionWithError };
};
