import { cn } from "@ttn/ui/lib/utils";
import { describe, expect, it } from "vitest";

describe("cn (@ttn/ui)", () => {
  it("keeps a color next to one of our font sizes, and still lets a later size or color win", () => {
    expect(cn("text-ink", "text-caption")).toBe("text-ink text-caption");
    expect(cn("text-body-sm text-ink", "text-caption")).toBe("text-ink text-caption");
    expect(cn("text-ink", "text-brand")).toBe("text-brand");
  });
});
