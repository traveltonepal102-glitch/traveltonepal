import "server-only";

import { GUIDE_FILE_PATH } from "@ttn/config/guideFiles";

import { removeUnusedTrekFile } from "@/lib/storage/trekFiles";
import type { Json } from "@/lib/supabase/database.types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** A "File to download" section's PDF address ([] when its settings hold none). */
const filePathOf = (settings: Json): string[] => {
  const path = settings && typeof settings === "object" && !Array.isArray(settings) ? settings.path : undefined;
  return typeof path === "string" && GUIDE_FILE_PATH.test(path) ? [path] : [];
};

/** The PDFs the guide's saved "File to download" sections use, to delete those a save removes or replaces. */
export const listGuideFilePaths = async (articleId: string): Promise<string[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("article_sections").select("settings").eq("article_id", articleId).eq("type", "file");
  if (error) throw new Error(`Could not load the files of travel guide ${articleId}: ${error.message}`);
  return data.flatMap((row) => filePathOf(row.settings));
};

/**
 * Deletes the PDFs of `paths` that no travel guide uses any more (they are public, so they should go). A failure
 * only leaves unused files behind: it is logged, never shown to the admin.
 */
export const removeUnusedGuideFiles = async (paths: string[]) => {
  if (!paths.length) return;
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("article_sections").select("settings").eq("type", "file").in("settings->>path", paths);
  if (error) return console.error("removeUnusedGuideFiles failed:", error.message);
  const used = new Set(data.flatMap((row) => filePathOf(row.settings)));
  await Promise.all(paths.filter((path) => !used.has(path)).map(removeUnusedTrekFile));
};
