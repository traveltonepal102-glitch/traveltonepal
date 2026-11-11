import "server-only";
import { z } from "zod";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { STEP_COUNT } from "../constants";
import type { Adventure, AdventureSectionValues, AdventureValues } from "../types";

/** Postgres error codes the save can raise. */
const FOREIGN_KEY_VIOLATION = "23503";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

/** Saved steps as the form knows them, always three (missing ones empty). */
const storedStepsSchema = z.array(z.object({ title: z.string().catch(""), text: z.string().catch("") }).catch({ title: "", text: "" })).catch([]);

const toSteps = (value: unknown) => {
  const steps = storedStepsSchema.parse(value).slice(0, STEP_COUNT);
  return [...steps, ...Array.from({ length: STEP_COUNT - steps.length }, () => ({ title: "", text: "" }))];
};

/** The website's cards (each website has its own), in carousel order. Throws when the database can't be read. */
export const listAdventures = async (siteId: string): Promise<Adventure[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("adventures")
    .select(`*, photo:photos!adventures_photo_id_fkey(${PHOTO_COLUMNS})`)
    .eq("site_id", siteId)
    .order("position")
    .order("title");
  if (error) throw new Error(`Could not load adventures: ${error.message}`);
  return data.map((row) => ({
    id: row.id,
    updatedAt: row.updated_at,
    title: row.title,
    tag: row.tag,
    summary: row.summary,
    photoId: row.photo_id,
    photoAlt: row.photo_alt,
    position: row.position,
    isShown: row.is_shown,
    photo: row.photo ? toPhoto(row.photo) : null,
  }));
};

/** The website's section words (one row each, made with the website). Throws when the database can't be read or the row is missing. */
export const getAdventureSection = async (siteId: string): Promise<AdventureSectionValues> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("adventure_section").select("*").eq("site_id", siteId).single();
  if (error) throw new Error(`Could not load the adventures section: ${error.message}`);
  return {
    eyebrow: data.eyebrow,
    heading: data.heading,
    intro: data.intro,
    askTitle: data.ask_title,
    askText: data.ask_text,
    stepsTitle: data.steps_title,
    steps: toSteps(data.steps),
    note: data.note,
  };
};

/** Saves the website's section words (save_adventure_section). False when the save failed. */
export const saveAdventureSection = async (values: AdventureSectionValues, siteId: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_adventure_section", {
    p_site_id: siteId,
    p_section: {
      eyebrow: values.eyebrow,
      heading: values.heading,
      intro: values.intro,
      ask_title: values.askTitle,
      ask_text: values.askText,
      steps_title: values.stepsTitle,
      steps: values.steps,
      note: values.note,
    },
  });
  if (error) console.error(`save_adventure_section failed: ${error.code} ${error.message}`);
  return !error;
};

export type SaveAdventureResult = { ok: true; adventureId: string } | { ok: false; reason: "missing_photo" | "not_found" | "forbidden" | "failed" };

/** Adds (adventureId null) a card to the website `siteId`, or updates one of its cards (save_adventure); a photo of another website is "missing_photo". */
export const saveAdventure = async (values: AdventureValues, adventureId: string | null, siteId: string): Promise<SaveAdventureResult> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("save_adventure", {
    p_adventure_id: adventureId,
    p_adventure: {
      site_id: siteId,
      title: values.title,
      tag: values.tag,
      summary: values.summary,
      photo_id: values.photoId ?? "",
      photo_alt: values.photoAlt,
      position: values.position,
      is_shown: values.isShown,
    },
  });
  if (!error) return { ok: true, adventureId: data };
  if (error.code === FOREIGN_KEY_VIOLATION) return { ok: false, reason: "missing_photo" };
  if (error.code === NOT_FOUND) return { ok: false, reason: "not_found" };
  if (error.code === RLS_VIOLATION) return { ok: false, reason: "forbidden" };
  console.error(`save_adventure failed: ${error.code} ${error.message}`);
  return { ok: false, reason: "failed" };
};

/** Removes one of the website's cards. False: no such card on this website, or not allowed (RLS: Super admins only). */
export const removeAdventure = async (adventureId: string, siteId: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("adventures").delete().eq("id", adventureId).eq("site_id", siteId).select("id");
  if (error) throw new Error(`Could not remove adventure ${adventureId}: ${error.message}`);
  return data.length > 0;
};
