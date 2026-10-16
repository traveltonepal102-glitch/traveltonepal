import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { env } from "./env";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: { titleSuffix: " · Travel To Nepal Admin" },
    components: {
      views: {
        login: { Component: "/features/auth/components/LoginView#LoginView" },
        createFirstUser: { Component: "/features/auth/components/NoAdminView#NoAdminView" },
      },
    },
  },
  collections: [Users],
  db: postgresAdapter({ pool: { connectionString: env.DATABASE_URI } }),
  editor: lexicalEditor(),
  // Sites read content over REST only.
  graphQL: { disable: true },
  // The admin UI is English only (TRD).
  i18n: { supportedLanguages: { en }, fallbackLanguage: "en" },
  secret: env.PAYLOAD_SECRET,
  sharp,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
});
