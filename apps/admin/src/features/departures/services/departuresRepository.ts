import "server-only";

import { PHOTO_COLUMNS, toPhoto } from "@/features/photos/services/photosRepository";
import type { DepartureStatus } from "@/features/treks/types";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { DEPARTURE_LOCALE } from "../constants";
import type { DepartureFormValues, DepartureItem, DepartureTrek, NewDepartures } from "../types";

/** Postgres error codes the saves can raise. */
const UNIQUE_VIOLATION = "23505";
const FOREIGN_KEY_VIOLATION = "23503";
const NOT_FOUND = "P0002";
const RLS_VIOLATION = "42501";

export type DepartureFailure = "date_taken" | "missing_trek" | "not_found" | "forbidden" | "failed";

const failureOf = (code: string | undefined, message: string, operation: string): DepartureFailure => {
  if (code === UNIQUE_VIOLATION) return "date_taken";
  if (code === FOREIGN_KEY_VIOLATION) return "missing_trek";
  if (code === NOT_FOUND) return "not_found";
  if (code === RLS_VIOLATION) return "forbidden";
  console.error(`${operation} failed: ${code} ${message}`);
  return "failed";
};

/** Every date on every trek, with its English note. Throws when the database can't be read. */
export const listDepartures = async (): Promise<DepartureItem[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("trek_departures").select("*, trek_departure_translations(locale, note)").order("start_date");
  if (error) throw new Error(`Could not load departure dates: ${error.message}`);

  return data.map((row) => ({
    id: row.id,
    trekId: row.trek_id,
    startDate: row.start_date,
    status: row.status,
    note: row.trek_departure_translations.find((text) => text.locale === DEPARTURE_LOCALE)?.note ?? "",
    specialPriceUsd: row.special_price_usd,
    teamNote: row.team_note,
  }));
};

/** Every trek, A–Z, with what the screen needs to show its dates. Throws when the database can't be read. */
export const listDepartureTreks = async (): Promise<DepartureTrek[]> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("treks")
    .select(`id, days, has_fixed_dates, price_from_usd, cover:photos!treks_cover_photo_id_fkey(${PHOTO_COLUMNS}), trek_translations!inner(name)`)
    .eq("trek_translations.locale", DEPARTURE_LOCALE);
  if (error) throw new Error(`Could not load treks: ${error.message}`);

  return data
    .map((trek) => ({
      id: trek.id,
      name: trek.trek_translations[0]?.name ?? "",
      days: trek.days,
      cover: trek.cover ? toPhoto(trek.cover) : null,
      hasFixedDates: trek.has_fixed_dates,
      priceFromUsd: trek.price_from_usd,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

/** Adds (departureId null) or updates one date and its English note (save_departure). */
export const saveDeparture = async (values: DepartureFormValues, departureId: string | null): Promise<{ ok: true } | { ok: false; reason: DepartureFailure }> => {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.rpc("save_departure", {
    p_departure_id: departureId,
    p_locale: DEPARTURE_LOCALE,
    p_departure: {
      trek_id: values.trekId,
      start_date: values.startDate,
      status: values.status,
      note: values.note,
      special_price_usd: values.specialPriceUsd,
      team_note: values.teamNote,
    },
  });
  return error ? { ok: false, reason: failureOf(error.code, error.message, "save_departure") } : { ok: true };
};

/** Adds several dates to one trek; days it already has are skipped. Returns how many were added. */
export const addDepartures = async ({ trekId, status, entries }: NewDepartures): Promise<{ ok: true; added: number } | { ok: false; reason: DepartureFailure }> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("add_departures", {
    p_trek_id: trekId,
    p_locale: DEPARTURE_LOCALE,
    p_departures: entries.map((entry) => ({ start_date: entry.startDate, status, note: entry.note })),
  });
  return error ? { ok: false, reason: failureOf(error.code, error.message, "add_departures") } : { ok: true, added: data };
};

/** Changes one date's status. False when there is no such date (or RLS hides it). */
export const setDepartureStatus = async (departureId: string, status: DepartureStatus): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("trek_departures").update({ status }).eq("id", departureId).select("id");
  if (error) throw new Error(`Could not change departure ${departureId}: ${error.message}`);
  return data.length > 0;
};

/** Deletes one date (and its note). False when there is no such date (or RLS hides it). */
export const deleteDeparture = async (departureId: string): Promise<boolean> => {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("trek_departures").delete().eq("id", departureId).select("id");
  if (error) throw new Error(`Could not delete departure ${departureId}: ${error.message}`);
  return data.length > 0;
};
