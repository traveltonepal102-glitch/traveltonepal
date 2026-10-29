import { describe, expect, it } from "vitest";

import { ALL_ALLOWED, ONLY_NECESSARY, parseConsent, serializeConsent } from "./consent";

const NOW = new Date("2026-10-20T10:00:00Z");

describe("consent storage", () => {
  it("round-trips a choice", () => {
    expect(parseConsent(serializeConsent(ALL_ALLOWED, NOW), NOW)).toEqual({ version: 2, decidedAt: NOW.toISOString(), analytics: true, externalMedia: true });
    expect(parseConsent(serializeConsent(ONLY_NECESSARY, NOW), NOW)).toMatchObject({ analytics: false, externalMedia: false });
    expect(parseConsent(serializeConsent({ analytics: true, externalMedia: false }, NOW), NOW)).toMatchObject({ analytics: true, externalMedia: false });
  });

  it("has no decision for missing, broken or foreign values", () => {
    expect(parseConsent(null, NOW)).toBeNull();
    expect(parseConsent("not json", NOW)).toBeNull();
    expect(parseConsent("42", NOW)).toBeNull();
    expect(parseConsent(JSON.stringify({ version: 2, analytics: true, externalMedia: "yes", decidedAt: NOW.toISOString() }), NOW)).toBeNull();
    expect(parseConsent(JSON.stringify({ version: 2, externalMedia: true, decidedAt: NOW.toISOString() }), NOW)).toBeNull();
  });

  it("asks again after a new version or a year", () => {
    // A choice from before analytics was added (version 1) is asked again.
    expect(parseConsent(JSON.stringify({ version: 1, externalMedia: true, decidedAt: NOW.toISOString() }), NOW)).toBeNull();
    const old = serializeConsent(ALL_ALLOWED, new Date("2025-10-01T00:00:00Z"));
    expect(parseConsent(old, NOW)).toBeNull();
    const recent = serializeConsent(ALL_ALLOWED, new Date("2026-01-01T00:00:00Z"));
    expect(parseConsent(recent, NOW)).not.toBeNull();
  });
});
