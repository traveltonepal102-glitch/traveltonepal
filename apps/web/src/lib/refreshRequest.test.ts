import { describe, expect, it } from "vitest";

import { isAuthorizedRefresh, readRefreshTags } from "./refreshRequest";

const SECRET = "s".repeat(40);

describe("isAuthorizedRefresh", () => {
  it("accepts only the shared secret as a Bearer token", () => {
    expect(isAuthorizedRefresh(`Bearer ${SECRET}`, SECRET)).toBe(true);
    expect(isAuthorizedRefresh(`Bearer ${SECRET}x`, SECRET)).toBe(false);
    expect(isAuthorizedRefresh(`Bearer ${SECRET.slice(1)}`, SECRET)).toBe(false);
    expect(isAuthorizedRefresh("Bearer ", SECRET)).toBe(false);
  });

  it("rejects a missing header, another scheme, or the secret without “Bearer”", () => {
    expect(isAuthorizedRefresh(null, SECRET)).toBe(false);
    expect(isAuthorizedRefresh("", SECRET)).toBe(false);
    expect(isAuthorizedRefresh(SECRET, SECRET)).toBe(false);
    expect(isAuthorizedRefresh(`Basic ${SECRET}`, SECRET)).toBe(false);
    expect(isAuthorizedRefresh(`bearer ${SECRET}`, SECRET)).toBe(false);
  });
});

describe("readRefreshTags", () => {
  it("reads the known tags, each once", () => {
    expect(readRefreshTags({ tags: ["treks"] })).toEqual(["treks"]);
    expect(readRefreshTags({ tags: ["regions", "treks", "regions", "travel-guides"] })).toEqual(["regions", "treks", "travel-guides"]);
  });

  it("refuses a body that isn't { tags: [known tags] }", () => {
    expect(readRefreshTags(null)).toBeNull();
    expect(readRefreshTags("treks")).toBeNull();
    expect(readRefreshTags({})).toBeNull();
    expect(readRefreshTags({ tags: [] })).toBeNull();
    expect(readRefreshTags({ tags: "treks" })).toBeNull();
    expect(readRefreshTags({ tags: ["treks", "users"] })).toBeNull();
    expect(readRefreshTags({ tags: [42] })).toBeNull();
    expect(readRefreshTags({ tags: Array.from({ length: 50 }, () => "treks") })).toBeNull();
  });
});
