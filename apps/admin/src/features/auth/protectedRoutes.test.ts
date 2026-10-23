import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Guard against forgetting the admin check. The proxy only checks that someone is signed in; the real gate
 * is requireAdmin() at the top of every protected page, layout, route handler and Server Action. This
 * test fails when a new one doesn't call it.
 */

const SRC = path.resolve(import.meta.dirname, "../..");
const APP = path.join(SRC, "app");

/** Pages anyone may open (signed out). Everything else under app/ is protected. */
const PUBLIC_ROUTE_FILES = ["login/page.tsx"];

/** Server Actions that run before there is an admin session. */
const PUBLIC_ACTIONS = [
  "features/auth/actions/signIn.ts",
  "features/auth/actions/signOut.ts",
  "features/auth/actions/forgetRememberedEmail.ts",
];

/** The root layout wraps the sign-in page too, so it can't require an admin. */
const UNGUARDED_LAYOUTS = ["layout.tsx"];

const listFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });

const relative = (file: string, from: string) => path.relative(from, file).split(path.sep).join("/");
const callsRequireAdmin = (file: string) => /\brequireAdmin\(/.test(readFileSync(file, "utf8"));

const routeFiles = listFiles(APP)
  .filter((file) => /\/(page|layout|route)\.tsx?$/.test(file))
  .map((file) => relative(file, APP))
  .filter((file) => !PUBLIC_ROUTE_FILES.includes(file) && !UNGUARDED_LAYOUTS.includes(file));

const serverActionFiles = listFiles(SRC)
  .filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".test.ts"))
  .filter((file) => /^\s*["']use server["']/m.test(readFileSync(file, "utf8")))
  .map((file) => relative(file, SRC))
  .filter((file) => !PUBLIC_ACTIONS.includes(file));

describe("protected routes", () => {
  it("finds the protected pages", () => {
    expect(routeFiles.length).toBeGreaterThan(0);
  });

  it.each(routeFiles)("app/%s calls requireAdmin()", (file) => {
    expect(callsRequireAdmin(path.join(APP, file))).toBe(true);
  });

  it.each(serverActionFiles.length ? serverActionFiles : ["(none yet)"])("Server Action %s calls requireAdmin()", (file) => {
    if (file === "(none yet)") return;
    expect(callsRequireAdmin(path.join(SRC, file))).toBe(true);
  });

  it("keeps the public lists honest (every listed file exists)", () => {
    const appFiles = listFiles(APP).map((file) => relative(file, APP));
    const srcFiles = listFiles(SRC).map((file) => relative(file, SRC));
    PUBLIC_ROUTE_FILES.forEach((file) => expect(appFiles).toContain(file));
    PUBLIC_ACTIONS.forEach((file) => expect(srcFiles).toContain(file));
  });
});
