import "server-only";
import { z } from "zod";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { AUTHOR_LANGUAGE_VALUES, AUTHOR_LOCALE } from "../constants";
import type { Author, AuthorFormValues } from "../types";

/** Postgres error codes the save can raise. */
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
const GUIDE_NOT_AGREED = "22023";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

const AUTHOR_COLUMNS = `*,
  photo:photos!authors_photo_id_fkey(${PHOTO_COLUMNS}),
  author_translations!inner(*)` as const;

/** Stored languages as the form knows them (the database checks the same values). */
const writesInSchema = z.array(z.enum(AUTHOR_LANGUAGE_VALUES)).catch(["en"]);

/** Every author with their English text (the list sorts them by the name shown, see filterAuthors). */
export const listAuthors = async (): Promise<Author[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("authors").select(AUTHOR_COLUMNS).eq("author_translations.locale", AUTHOR_LOCALE);
  if (error) throw new Error(`Could not load authors: ${error.message}`);

  return data.map((row): Author => {
      const [text] = row.author_translations;
      return {
        id: row.id,
        updatedAt: row.updated_at,
        kind: row.kind,
        guideId: row.guide_id,
        name: row.name,
        photo: row.photo ? toPhoto(row.photo) : null,
        photoConsent: row.photo_consent,
        jobTitle: text?.job_title ?? "",
        bio: text?.bio ?? "",
        writesIn: writesInSchema.parse(row.writes_in),
        topics: row.topics,
        profileLinks: row.profile_links,
        showAuthorBox: row.show_author_box,
        showOnAbout: row.show_on_about,
      };
    });
};

export type SaveAuthorResult =
  | { ok: true; authorId: string }
  | { ok: false; reason: "guide_taken" | "guide_not_agreed" | "missing_link" | "not_found" | "forbidden" | "failed" };

/** Adds (authorId null) or updates an author and their English text in one transaction (save_author). */
export const saveAuthor = async (values: AuthorFormValues, authorId: string | null): Promise<SaveAuthorResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_author", {
    p_author_id: authorId,
    p_locale: AUTHOR_LOCALE,
    p_author: {
      kind: values.kind,
      guide_id: values.guideId ?? "",
      name: values.name,
      photo_id: values.photoId ?? "",
      photo_consent: values.photoConsent,
      writes_in: values.writesIn,
      topics: values.topics,
      profile_links: values.profileLinks,
      show_author_box: values.showAuthorBox,
      show_on_about: values.showOnAbout,
    },
    p_text: { job_title: values.jobTitle, bio: values.bio },
  });

  if (!error) return { ok: true, authorId: data };
  if (error.code === UNIQUE_VIOLATION) return { ok: false, reason: "guide_taken" };
  if (error.code === GUIDE_NOT_AGREED) return { ok: false, reason: "guide_not_agreed" };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_link" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };

  console.error(`save_author failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

/**
 * Removes an author. "not_removed": no such author, or not allowed (RLS: Super admins only); "has_articles":
 * they wrote travel guides (another author is picked on those first).
 */
export const removeAuthor = async (authorId: string): Promise<"removed" | "not_removed" | "has_articles"> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("authors").delete().eq("id", authorId).select("id");
  if (error?.code === FOREIGN_KEY_VIOLATION) return "has_articles";
  if (error) throw new Error(`Could not remove author ${authorId}: ${error.message}`);
  return data.length > 0 ? "removed" : "not_removed";
};
