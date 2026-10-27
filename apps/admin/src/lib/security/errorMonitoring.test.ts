import { afterEach, describe, expect, it, vi } from "vitest";

import { errorMonitoringOptions, errorMonitoringOrigin, isReportedByServer } from "@ttn/config/errorMonitoring";

describe("errorMonitoringOrigin", () => {
  it("is the DSN's host, without the key or project", () => {
    expect(errorMonitoringOrigin("https://abc123@o4510.ingest.de.sentry.io/4510")).toBe("https://o4510.ingest.de.sentry.io");
  });

  it("is null without a usable DSN", () => {
    expect(errorMonitoringOrigin(undefined)).toBeNull();
    expect(errorMonitoringOrigin("")).toBeNull();
    expect(errorMonitoringOrigin("not a dsn")).toBeNull();
  });
});

describe("isReportedByServer", () => {
  it("is true for a server error passed to an error page (it has a digest)", () => {
    expect(isReportedByServer(Object.assign(new Error("hidden"), { digest: "123" }))).toBe(true);
  });

  it("is false for an error thrown in the browser", () => {
    expect(isReportedByServer(new Error("click handler broke"))).toBe(false);
    expect(isReportedByServer("a string")).toBe(false);
  });
});

describe("errorMonitoringOptions", () => {
  const DSN = "https://abc123@o4510.ingest.de.sentry.io/4510";

  const optionsWith = (dsn: string, vercelEnv: string) => {
    vi.stubEnv("NEXT_PUBLIC_SENTRY_DSN", dsn);
    vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", vercelEnv);
    return errorMonitoringOptions();
  };

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports from Vercel's production deployment", () => {
    expect(optionsWith(DSN, "production")).toMatchObject({ enabled: true, environment: "production", sendDefaultPii: false });
  });

  it("never reports from pnpm dev or a preview, even with a DSN", () => {
    expect(optionsWith(DSN, "").enabled).toBe(false);
    expect(optionsWith(DSN, "preview").enabled).toBe(false);
  });

  it("is off in production without a DSN", () => {
    expect(optionsWith("", "production").enabled).toBe(false);
  });
});
