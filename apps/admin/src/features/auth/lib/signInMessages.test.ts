import { describe, expect, it } from "vitest";

import { lockedOut, wrongCredentials } from "./signInMessages";

describe("wrongCredentials", () => {
  it("says how many tries are left and the lock rule", () => {
    expect(wrongCredentials(3)).toEqual({
      message: "Email or password is not right.",
      detail: "2 tries left. After 5 wrong tries, sign-in is locked for 15 minutes.",
    });
    expect(wrongCredentials(4).detail).toMatch(/^1 try left\./);
    expect(wrongCredentials(9).detail).toMatch(/^0 tries left\./);
  });
});

describe("lockedOut", () => {
  const now = new Date("2026-10-23T10:00:00Z");

  it("rounds the waiting time up to whole minutes", () => {
    expect(lockedOut(new Date("2026-10-23T10:14:01Z"), now).detail).toBe("Sign-in for this email is locked. Try again in 15 minutes.");
    expect(lockedOut(new Date("2026-10-23T10:00:20Z"), now).detail).toBe("Sign-in for this email is locked. Try again in 1 minute.");
  });

  it("never says more than the lock time, even when the database clock is a little ahead", () => {
    expect(lockedOut(new Date("2026-10-23T10:15:00.400Z"), now).detail).toBe("Sign-in for this email is locked. Try again in 15 minutes.");
  });
});
