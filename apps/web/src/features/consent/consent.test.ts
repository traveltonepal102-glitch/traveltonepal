import { describe, expect, it } from "vitest";

import { ALL_ALLOWED, ONLY_NECESSARY, parseConsent, serializeConsent } from "./consent";

const NOW = new Date("2026-10-20T10:00:00Z");

describe("consent storage", () => {
  it("round-trips a choice", () => {
    expect(parseConsent(serializeConsent(ALL_ALLOWED, NOW), NOW)).toEqual({ version: 1, decidedAt: NOW.toISOString(), externalMedia: true });
    expect(parseConsent(serializeConsent(ONLY_NECESSARY, NOW), NOW)?.externalMedia).toBe(false);
  });

  it("has no decision for missing, broken or foreign values", () => {
    expect(parseConsent(null, NOW)).toBeNull();
    expect(parseConsent("not json", NOW)).toBeNull();
    expect(parseConsent("42", NOW)).toBeNull();
    expect(parseConsent(JSON.stringify({ version: 1, externalMedia: "yes", decidedAt: NOW.toISOString() }), NOW)).toBeNull();
  });

  it("asks again after a new version or a year", () => {
    expect(parseConsent(JSON.stringify({ version: 0, externalMedia: true, decidedAt: NOW.toISOString() }), NOW)).toBeNull();
    const old = serializeConsent(ALL_ALLOWED, new Date("2025-10-01T00:00:00Z"));
    expect(parseConsent(old, NOW)).toBeNull();
    const recent = serializeConsent(ALL_ALLOWED, new Date("2026-01-01T00:00:00Z"));
    expect(parseConsent(recent, NOW)).not.toBeNull();
  });
});
