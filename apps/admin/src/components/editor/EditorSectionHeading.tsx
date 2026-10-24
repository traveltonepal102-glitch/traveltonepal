import type { EditorSection } from "./types";

type EditorSectionHeadingProps<Key extends string> = {
  section: EditorSection<Key>;
  /** The item's name, for "{name}" in the section's page title, e.g. "Langtang". */
  name: string;
};

/**
 * The open section's heading. With a page title it reads like the website: the small label above ("Treks"),
 * the page's heading ("Trek in Langtang"), then what the section is for.
 */
export const EditorSectionHeading = <Key extends string>({ section, name }: EditorSectionHeadingProps<Key>) => (
  <div>
    {section.pageTitle && <p className="m-0 text-xs font-bold tracking-wider text-brand uppercase">{section.label}</p>}
    <h2 className="m-0 font-display text-[26px] leading-tight font-extrabold text-ink max-tablet:text-[22px]">
      {section.pageTitle ? section.pageTitle.replace("{name}", name.trim() || "the region") : section.label}
    </h2>
    <p className="m-0 max-w-170 text-muted-foreground">{section.description}</p>
  </div>
);
