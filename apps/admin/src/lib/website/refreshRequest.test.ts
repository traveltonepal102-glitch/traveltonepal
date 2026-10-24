import { describe, expect, it } from "vitest";

import { websiteRefreshRequest } from "./refreshRequest";

const SECRET = "s".repeat(40);

describe("websiteRefreshRequest", () => {
  it("POSTs the tags to the website's refresh route with the secret", () => {
    const request = websiteRefreshRequest("https://www.example.com", SECRET, ["regions", "treks"]);
    expect(request).toEqual({
      url: "https://www.example.com/api/revalidate",
      init: {
        method: "POST",
        headers: { Authorization: `Bearer ${SECRET}`, "Content-Type": "application/json" },
        body: JSON.stringify({ tags: ["regions", "treks"] }),
        cache: "no-store",
      },
    });
  });

  it("sends each tag once and ignores a trailing slash or path on the address", () => {
    const request = websiteRefreshRequest("https://www.example.com/en/", SECRET, ["treks", "treks"]);
    expect(request?.url).toBe("https://www.example.com/api/revalidate");
    expect(request?.init.body).toBe(JSON.stringify({ tags: ["treks"] }));
  });

  it("allows plain http only to this computer", () => {
    expect(websiteRefreshRequest("http://localhost:3000", SECRET, ["treks"])?.url).toBe("http://localhost:3000/api/revalidate");
    expect(websiteRefreshRequest("http://127.0.0.1:3000", SECRET, ["treks"])).not.toBeNull();
    expect(websiteRefreshRequest("http://www.example.com", SECRET, ["treks"])).toBeNull();
  });

  it("sends nothing without tags", () => {
    expect(websiteRefreshRequest("https://www.example.com", SECRET, [])).toBeNull();
  });
});
