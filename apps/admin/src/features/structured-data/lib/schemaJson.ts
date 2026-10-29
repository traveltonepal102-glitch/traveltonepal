import { FORBIDDEN_TYPES, SCHEMA_LIMITS } from "../constants";
import type { JsonObject } from "../types";

export type SchemaJsonResult = { ok: true; data: JsonObject } | { ok: false; message: string };

/** Properties that hold ratings or reviews, whatever their "@type". */
const FORBIDDEN_PROPERTIES = ["aggregateRating", "review", "reviews"];

const SCRIPT_TAG = /^<script\b[^>]*>([\s\S]*)<\/script>$/i;
const SCHEMA_ORG = /^https?:\/\/schema\.org\/?$/;

const fail = (message: string): SchemaJsonResult => ({ ok: false, message });

const isObject = (value: unknown): value is JsonObject => typeof value === "object" && value !== null && !Array.isArray(value);

/** "@type" can be one name or a list of names. */
const typeNames = (value: unknown): string[] => (Array.isArray(value) ? value : [value]).filter((name) => typeof name === "string");

/** The first forbidden type or property anywhere in the value, nested ones too. */
const findForbidden = (value: unknown): string | undefined => {
  if (Array.isArray(value)) return value.map(findForbidden).find(Boolean);
  if (!isObject(value)) return undefined;
  const type = typeNames(value["@type"]).find((name) => (FORBIDDEN_TYPES as readonly string[]).includes(name));
  if (type) return type;
  const property = Object.keys(value).find((key) => FORBIDDEN_PROPERTIES.includes(key));
  return property ?? Object.values(value).map(findForbidden).find(Boolean);
};

/** The object without "@context", or null when it names something other than schema.org. */
const withoutContext = ({ "@context": context, ...rest }: JsonObject): JsonObject | null =>
  context === undefined || (typeof context === "string" && SCHEMA_ORG.test(context)) ? rest : null;

/** The block's main types: its own "@type", or those of the items in its "@graph". */
export const mainTypes = (data: JsonObject): string[] => {
  const items: unknown[] = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
  return items.flatMap((item) => (isObject(item) ? typeNames(item["@type"]) : []));
};

const readJson = (text: string): { value: unknown } | { error: string } => {
  const trimmed = text.trim();
  const source = SCRIPT_TAG.exec(trimmed)?.[1].trim() ?? trimmed;
  try {
    return { value: JSON.parse(source) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "invalid JSON" };
  }
};

/**
 * Checks pasted JSON-LD and returns it as stored: one object with "@type", or a group with "@graph" (a pasted
 * list becomes one), without "@context" (the website adds it). A <script> tag around it is taken off.
 */
export const parseSchemaJson = (text: string): SchemaJsonResult => {
  if (!text.trim()) return fail("Paste the JSON-LD.");
  const read = readJson(text);
  if ("error" in read) return fail(`This isn't valid JSON (${read.error}). Check for a missing comma, quote or bracket.`);

  const pasted = Array.isArray(read.value) ? { "@graph": read.value } : read.value;
  if (!isObject(pasted)) return fail('Paste one JSON object, like { "@type": "VideoObject", … }.');
  const data = withoutContext(pasted);
  if (!data) return fail('Use "@context": "https://schema.org", or leave it out.');

  const graph = data["@graph"];
  if (graph !== undefined) {
    if (!Array.isArray(graph) || graph.length === 0) return fail('"@graph" must be a list of schemas.');
    const items = graph
      .map((item) => (isObject(item) ? withoutContext(item) : null))
      .filter((item): item is JsonObject => item !== null && typeNames(item["@type"]).length > 0);
    if (items.length !== graph.length) return fail('Every item in "@graph" needs an "@type".');
    data["@graph"] = items;
  } else if (typeNames(data["@type"]).length === 0) {
    return fail('Add an "@type", like "@type": "VideoObject".');
  }

  const forbidden = findForbidden(data);
  if (forbidden) return fail(`Take out "${forbidden}": Google doesn't accept ratings or reviews a business marks up about itself.`);

  if (new TextEncoder().encode(JSON.stringify(data)).length > SCHEMA_LIMITS.jsonBytes) {
    return fail(`This schema is too long: keep it under ${SCHEMA_LIMITS.jsonBytes.toLocaleString("en")} characters.`);
  }
  return { ok: true, data };
};

/** A saved block as the form shows it: complete JSON-LD, ready to copy into Google's test. */
export const formatSchemaJson = (data: unknown) => JSON.stringify(isObject(data) ? { "@context": "https://schema.org", ...data } : data, null, 2);
