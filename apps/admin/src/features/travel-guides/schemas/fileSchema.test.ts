import { describe, expect, it } from "vitest";
import { z } from "zod";

import { toFieldErrors } from "@/lib/forms/fieldErrors";

import { newSection } from "../lib/sectionDrafts";
import { storedSection, toStoredSection } from "../services/storedSections";
import type { ArticleSection } from "../types";
import { sectionsField } from "./sectionsSchema";

const PATH = "guide-files/00000000-0000-4000-8000-000000000001/langtang-packing-list.pdf";

/** As in the travel guide form, so errors carry their "sections." path. */
const form = z.object({ sections: sectionsField });
const parse = (sections: unknown[]) => form.safeParse({ sections: JSON.stringify(sections) });

type FileSection = Extract<ArticleSection, { type: "file" }>;

const file = (patch: Partial<FileSection> = {}): FileSection => ({
  id: null,
  type: "file",
  path: PATH,
  byteSize: 1_200_000,
  title: " Langtang packing list ",
  description: "",
  ...patch,
});

describe("“File to download” sections", () => {
  it("takes an uploaded PDF with its title", () => {
    expect(parse([file()]).data?.sections).toEqual([{ ...file(), title: "Langtang packing list" }]);
  });

  it("asks for the PDF and its title, and refuses addresses an upload never hands out", () => {
    const result = parse([
      newSection("file"),
      file({ path: "pdf-maps/00000000-0000-4000-8000-000000000001.pdf" }),
      file({ path: "guide-files/00000000-0000-4000-8000-000000000001/notes.html" }),
      file({ byteSize: 16 * 1024 * 1024 }),
    ]);
    if (result.success) throw new Error("expected the sections to be rejected");
    expect(toFieldErrors(result.error)).toMatchObject({
      "sections.0.path": "Add the PDF, or remove this section.",
      "sections.0.title": expect.stringContaining("Write the file's title"),
      "sections.1.path": "Add the PDF again.",
      "sections.2.path": "Add the PDF again.",
      "sections.3.byteSize": "Use a PDF of up to 15 MB.",
    });
  });

  it("saves the file in settings and the words in content, and reads them back", () => {
    const saved = toStoredSection(file({ title: "Packing list", description: "One page" }));
    expect(saved).toMatchObject({ settings: { path: PATH, byteSize: 1_200_000 }, content: { title: "Packing list", description: "One page" } });
    expect(storedSection({ id: "s1", type: "file", trek_id: null, settings: saved.settings }, saved.content)).toEqual({
      id: "s1",
      type: "file",
      path: PATH,
      byteSize: 1_200_000,
      title: "Packing list",
      description: "One page",
    });
    expect(storedSection({ id: "s2", type: "file", trek_id: null, settings: null }, undefined)).toEqual({ ...newSection("file"), id: "s2" });
  });
});
