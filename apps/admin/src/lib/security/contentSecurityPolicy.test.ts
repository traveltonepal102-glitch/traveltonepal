import { describe, expect, it } from "vitest";

import { buildContentSecurityPolicy, createNonce } from "./contentSecurityPolicy";

const directive = (policy: string, name: string) => policy.split("; ").find((part) => part.startsWith(`${name} `)) ?? "";

describe("buildContentSecurityPolicy", () => {
  it("runs only this site's scripts carrying the request's nonce", () => {
    const policy = buildContentSecurityPolicy("abc123", false);
    expect(directive(policy, "script-src")).toBe("script-src 'self' 'nonce-abc123' 'strict-dynamic'");
    expect(policy).not.toContain("unsafe-eval");
  });

  it("blocks framing, plugins, other form targets and base-tag tricks", () => {
    const policy = buildContentSecurityPolicy("abc123", false);
    for (const rule of ["frame-ancestors 'none'", "object-src 'none'", "form-action 'self'", "base-uri 'self'"]) {
      expect(policy).toContain(rule);
    }
    expect(policy).toContain("upgrade-insecure-requests");
  });

  it("allows photo storage only for images and uploads, nothing else", () => {
    const policy = buildContentSecurityPolicy("abc123", false, {
      images: ["https://images.example.com"],
      uploads: ["https://storage.example.com"],
    });
    expect(directive(policy, "img-src")).toBe("img-src 'self' blob: data: https://images.example.com");
    expect(directive(policy, "connect-src")).toBe("connect-src 'self' https://storage.example.com");
    expect(directive(policy, "script-src")).not.toContain("example.com");
    expect(directive(buildContentSecurityPolicy("abc123", false), "img-src")).toBe("img-src 'self' blob: data:");
  });

  it("allows React's debugging and plain http in development only", () => {
    const policy = buildContentSecurityPolicy("abc123", true);
    expect(directive(policy, "script-src")).toContain("'unsafe-eval'");
    expect(policy).not.toContain("upgrade-insecure-requests");
  });
});

describe("createNonce", () => {
  it("is different every time", () => {
    expect(createNonce()).not.toBe(createNonce());
  });
});
