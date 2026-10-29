# Travel To Nepal — Project Instructions

## Project context

- pnpm monorepo for the Nepal Trekking Multi-Site Network (see the TRD, PRD, Backend Schema and Implementation Plan docs).
- `apps/web` — public Next.js site (App Router), built once per `SITE_ID`. Port 3000.
- `apps/admin` — our own admin portal (Next.js App Router, port 3001) on Supabase, built to the claude.ai design canvas "Travel To Nepal — Website v2" (the Admin-* artboards). No Payload/CMS framework.
- `packages/*` — shared code (`@ttn/ui`, etc.). Design tokens (colors, fonts, type scale) live in `packages/ui/theme.css` (tokens only; each app imports Tailwind itself, see `apps/admin/src/styles/admin.css`).
- Next.js 16 has breaking changes: read the app's `AGENTS.md` and the bundled docs in `node_modules/next/dist/docs/` before writing Next.js code. For Supabase, read the installed `@supabase/*` sources rather than guessing.
- Run commands from the repo root: `pnpm dev` (both apps), `pnpm build`, `pnpm lint`, `pnpm test`; add packages with `pnpm add <pkg> --filter <app>`. Versions are pinned (see the Project Setup doc).
- On the website, every link or button that opens WhatsApp shows WhatsApp's logo (`WhatsAppLogo`, or `icon="whatsapp"` on `ButtonLink`), never the chat icon; the chat icon is only for labels that open nothing.
- Contact and company details (phone/WhatsApp, email, address, office hours, legal name, registration and licence numbers, social links) are typed once in the admin's Site settings (`site_settings` table, `features/settings`; super admins save) and read by the website through `web_site_settings` with `getSiteSettings()` (`apps/web/src/features/site-settings`, tag `settings`); never type them into components. Link to WhatsApp and email with `getWhatsAppUrl` and `getEmailUrl` from `@ttn/config/contact`: they point to the site's `/whatsapp` and `/email` routes, which redirect to the saved number and address. A detail that is blank in Settings is left out of the page, never shown as a placeholder. Every page carries the company's TravelAgency structured data from Settings (`features/seo/organization.ts`, root layout); other pages refer to it by `ORGANIZATION_ID`.
- Database: the Supabase dev project; don't use a local Postgres. Schema changes are SQL files in `supabase/migrations/`, applied with `supabase db push --db-url "<DATABASE_URI from apps/admin/.env>"`; keep `apps/admin/src/lib/supabase/database.types.ts` in sync. Every table has RLS on, and `anon`/`authenticated` get only what a migration grants explicitly. Only the admin server writes to Supabase (server-only env vars, no browser client); the one exception is photo uploads, where the browser PUTs a file to a one-time signed link the server created. The website (`apps/web`) reads on its server only, with the publishable key, and only the read-only `web_` views (published content and public fields; `anon` may read nothing else): see `apps/web/src/lib/supabase`. Its reads are cached functions (`"use cache"` + `cacheTag`) that throw on a database error (a failed refresh then keeps the last good page; `app/error.tsx` covers the rest), with the row mapping in pure, tested `features/<thing>/<thing>Rows.ts`. The tags are shared in `packages/config/src/websiteCache.ts`: after a save, the admin's Server Action calls `refreshWebsite([...tags])` (`apps/admin/src/lib/website`), which POSTs to the website's `/api/revalidate` with `REVALIDATE_SECRET` (same value in both apps) once the response is sent; a new saved thing that the website shows must call it with every tag whose data it changes. A new view needs a migration, its type in `apps/web/src/lib/supabase/database.types.ts`, and a `grant select … to anon`. Region and trek pages read the database (`features/<thing>-detail/services`, views `web_region_pages`/`web_trek_pages` + their `_photos`/`_guides`); a region has a page once its introduction is written, a published trek once it has a day-by-day plan (`has_page`, `trek.hasPage`), and a trek page leaves out the shared sections the trek hides and shows its sections with a heading (shared ones too) in the trek's own order (`treks.section_order`, keys and `orderTrekSections` in `@ttn/config/trekPageSections`; the trek editor's "Order of the page sections", `SectionOrderCard`; full-width sections move only among themselves; the editor's section list follows the order). Travel guide pages and the Travel guides list read `web_travel_guides`/`web_travel_guide_pages` the same way. When a trek, region or guide slug changes, a trigger keeps the old one in `slug_redirects` and its page answers a permanent redirect to the new address (`redirectIfMoved`, `features/seo`); `sitemap.xml` lists every published page from the database. After changing a view, refresh its cache tag (or the website keeps the old rows for up to an hour). The header shows only popular treks that have a page (`popularTreksWithPage`), home six treks with a page, popular first (`homeTreks`), the Treks page shows every published trek (one without a page is a WhatsApp inquiry card, `TrekListCard`), the Regions page shows regions with a map pin and difficulty, west to east (`toRegionCards`; a region with no page and no published trek asks on WhatsApp), and guides and regions link through `guideHref` and `regionHref` (their page, else their list). Admin env vars are in `apps/admin/.env.example`.
- Treks have no fixed departure dates (decided 2026-10-27): every trek is private and starts on the day the trekker picks. The trek page's "Choose your own start date" (`StartDatePicker`, `features/trek-detail/startDate.ts`) offers the next 12 months coloured by the region's best months (`region_month_ratings` in `web_trek_pages`), and the chosen day goes into the booking card, the WhatsApp messages and the request forms; today comes from the browser (Nepal time), as the page is built ahead. The admin has no Departures screen; the trek editor shows a read-only "Start date" card. Dates saved before stay in `trek_departures`, unused: `save_trek` leaves them alone when `p_departures` is null.
- A trek can cross several regions (decided 2026-10-29): `treks.region_id` is the main region, first on the route (breadcrumb, "Langtang local" guides, photo uploads), and `trek_regions` holds the regions after it in route order (`save_trek` reads `p_trek.route_region_ids`; the trek editor's "Regions on the route", `RouteRegionsField`). `web_treks.route_regions` gives the whole route (`trek.route`, `features/treks/route.ts`): the Treks filter, the Regions page and similar treks count a trek in every region it passes through, cards show "Langtang → Manaslu", and the trek page's start months are each month's worst rating among the route's regions (`web_trek_pages.region_month_ratings`; admin `routeMonthRatings`). A trek across several regions gets the trek page section "Regions on this route" (`regions` in `TREK_PAGE_SECTIONS`, `components/regions/TrekRouteRegions`): a card per region from its region card (`routeRegions.ts`), with its days when the itinerary days have regions (`trek_days.region_id`, the day editor's "Region", empty = the day before's), and each region's and the whole route's best months; the day-by-day plan marks where it enters each region. A region's featured trek may be one passing through, and a region with treks passing through can't be deleted (`region_usage`).
- Fixed pages (admin Pages, `apps/admin/src/features/pages`): one `site_pages` row per page (seeded, never added or removed) with the same top (label, H1, intro, optional photo) and Google result (title, description, main keyword), plus `content` jsonb for what only that page has, checked by the page's zod schema in the admin and read leniently on the website (`features/site-pages`, `features/<page>/<page>PageRows.ts`, tag `pages`). About, Contact and the list pages (Home, Treks, Regions, Travel guides: their top and Google result, one editor at `/pages/lists`, saved together by `save_site_pages`) and the legal pages (Terms, Privacy, Impressum, Cookie settings: one editor at `/pages/legal`, `save_site_pages`) are edited there. A legal page's text uses the legal text format (`@ttn/ui/lib/legalText`: numbered section headings, small headings, lists, links, tables; checked in both apps); company details are placeholders (`{company}`, `{address}`, `{registration}`…, a line `{registers}` or `{cookieTable}` becomes that table) filled from Site settings and code by `features/legal/legalPlaceholders.ts`, never typed into the text. "Last updated" moves to today on Publish only for a page whose words changed. A list page's text may hold `{regions}` or `{treks}`, which the website replaces with the count (`features/site-pages/pageCounts.ts`). The About team is not typed in Pages: it is the office authors and trekking guides with "Show on the About page" and consent (`web_about_team`); the founder is an office author. The About page (redesigned 2026-10-29, design About.dc.html) is built around four beliefs (listen, honest, flexible, open mind) plus a safety band and the founder's story with three goals and "Our voice", all edited in Pages › About (`aboutTypes.ts`, `lib/aboutContent.ts`; field names are the value paths, e.g. `listen.steps.0.title`); its photos sit in numbered places (`site_page_photos.position`: 1 founder, 2 flexible, 3–5 villages; `ABOUT_PHOTO_SLOTS`). The six promises stay in Pages › About but show only on trek pages ("Why book your trek with us"), not on About; About has no reviews (the header and footer "Reviews" link to the home page's). Contact details, licences (with the agency licence and PAN certificate scans) and the founded year stay in Site settings. Pick page photos with `LibraryPhotoField` (library or upload).
- Photos (`apps/admin/src/features/photos`): a shared library (`photos` table, tagged with a region) used by regions now (`regions.cover_photo_id` + `region_photos`), treks and travel guides later. Upload = signed link → browser uploads to private storage → `sharp` strips all metadata (GPS) and makes WebP sizes (`VARIANT_WIDTHS`) → raw upload deleted. Storage goes through `src/lib/storage` only: one S3 bucket (`ttn-photos-prod`, ap-southeast-2) for development and production once the four `S3_*` env vars are set, else Supabase Storage (`photo-files` private, `photos` public). In the bucket (`createPhotoStorage`, `lib/storage/s3Bucket.ts`): sized photos at its root and trek PDFs in `trek-files/`, served by CloudFront at `PHOTOS_PUBLIC_URL`; raw uploads and masters in `private/`, which the bucket policy denies to CloudFront. S3 upload links sign the checked type and size. Show photos with `<PhotoImage>` so browsers download only the size they need. The admin's Photos screen (`/photos`, `features/photos/lib/photoFolders.ts`) sorts the library into folders by where each photo is used, read from `photo_uses()` (every photo column plus the photos inside rich and legal texts): add a new place that uses photos there, or its photos show as "Not used yet" and can be deleted. Deleting is Super admins only, through `delete_unused_photo()` (refuses a photo still used), then the files are removed from storage. Every rich text editor (and the legal editor) can hold library photos: an `image` block with the photo's id, sizes and a required description (never a pasted address; `LibraryImage` + `InsertPhotoButton` in `src/components/ui/richText`), which the website shows with `RichTextPhoto` (trek pages show a text's photos under it).
- Reviews (decided 2026-10-27) are real Google (or Tripadvisor) reviews, never written by us: the admin's Reviews screen (`features/reviews`, `save_review`) stores each one word for word with the link to the original, an optional reviewer photo (photo library, `photo_id`; the cards show `ReviewerAvatar`: the photo, else the name's initial) and a "Show on website" switch, plus the overall rating typed from the review site (`review_ratings`, `save_review_ratings`); no Google API. The website reads `web_reviews`/`web_review_ratings` with `getPublishedReviews()` (tag `reviews`): home shows the newest twelve, About three, a trek page its own, each in a `ReviewCarousel` of Google-style cards (`GoogleReviewCard`: avatar, name, Google "G", stars, "5 months ago" from `reviewAge` worked out in the cached read, five lines, "Read more on Google"); the rating badge shows the Google average typed in the admin, never one worked out from the chosen reviews; sections stay hidden while empty (design placeholders only in `pnpm dev`); `GoogleReviewLinks` under each says they are copied word for word and links to the Google profile (`google_business_url`) and to `/review`, which redirects to the "write a review" link in Site settings (`google_review_url`). No review stars in structured data.
- Newsletter (decided 2026-10-28) is Brevo with double opt-in: the website's `subscribeToNewsletter` Server Action calls Brevo's `contacts/doubleOptinConfirmation` (`features/newsletter/brevo.ts`, `service.ts`) with list `BREVO_NEWSLETTER_LIST_ID` and the "please confirm" template `BREVO_CONFIRM_TEMPLATE_ID`; Brevo adds the address only after its link is clicked and then sends people to `/newsletter/confirmed` (noindex). Nothing is stored in Supabase. The form (`NewsletterBand`) shows in production only when the three `BREVO_*` env vars are set (`newsletterSettings` in `env.ts`); the key is server-only, and Brevo's IP blocking must stay off (Vercel's addresses change). Newsletters themselves are written and sent in Brevo.
- Analytics, videos and click counts (decided 2026-10-29, as the Privacy policy and Cookie settings describe): the cookie choices are Necessary, Analytics and External media (`features/consent`, version 2). Google Analytics and Microsoft Clarity load only with "Analytics", only where `NEXT_PUBLIC_APP_ENV=production` and their ids are set (`NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_CLARITY_PROJECT_ID`; `features/analytics/AnalyticsScripts.tsx`, ad storage always denied). Guide video sections play YouTube in privacy-enhanced mode after a click or "External media" (`ArticleVideo`). The `/whatsapp` and `/email` routes count each click per day, channel and page (`record_contact_click`, the website's second write; no cookie, no IP; prefetches skipped) and the admin Dashboard shows the last 30 days (`features/dashboard`). Adding anything else that sends data to another company needs a consent category and a line in the Privacy policy and the cookie table (`features/legal/cookieTable.ts`). Travel guide "Embed" sections take frames only from the services in `@ttn/config/embeds` (checked on save and on read, loaded after a click or "External media"; the cookie table lists them by itself), and "Custom HTML" sections are cleaned by `@ttn/ui/lib/customHtml` (server only) on save and again on read: no scripts, frames, forms or images.
- Custom adventures (decided 2026-10-28; design Main.dc.html "Tell us your dream Nepal adventure"): a home page section between Treks and Why us, edited in the admin's Adventures screen (`features/adventures`): the section's words in one row (`adventure_section`, `save_adventure_section`, folded "Section text" form) and the cards with add/edit/remove in a side panel (`adventures`, `save_adventure`; Super admins remove; a card needs a library photo to show). No detail pages: the carousel's last card asks on WhatsApp or by email. The website reads `web_adventure_section`/`web_adventures` with `getAdventuresSection()` (tag `adventures`) and leaves the section out until a card is shown. Carousels on the website use `CardCarousel` (`components/shared`; reviews too).
- Structured data (decided 2026-10-29): on top of the JSON-LD the website writes by itself, the SEO person adds their own schema.org blocks to any page (fixed pages, treks, regions, travel guides; up to 10 each) in the admin's Structured data screen (`features/structured-data`, `/structured-data/<page|trek|region|guide>/<slug or id>`; Super admins save). One `page_schemas` table (exactly one page column set), saved per page by `save_page_schemas`; pasted JSON is checked by `parseSchemaJson` (stored without `@context`; no ratings or reviews, Google refuses self-serving ones) and the editor warns when a block repeats a type the page already writes (`automaticSchemas`: keep it in step with each page's `seo.ts`). The website reads `web_page_schemas` (shown blocks on pages it shows) with `listPageSchemas()` and each route renders `<PageSchemasJsonLd>` (tag `structured-data`); a new page type needs a column, the view and that line in its route.
- Share previews (Open Graph, decided 2026-10-29): every library photo has a 1200×630 JPEG `share.jpg` beside its sizes (`makeShareImage` in `processPhoto.ts`; `scripts/make-share-files.mjs` made them for older photos and is safe to rerun). Treks, regions, travel guides and fixed pages pick a "Photo when the link is shared" in their Google card (`SharePhotoField`; `share_photo_id` beside the Google title, views' `share_id`). The website builds every page's share tags with `shareMetadata` (`features/seo/shareMetadata.ts`: chosen share photo, else the page's main photo) and each route wraps `generateMetadata` in `withSiteDefaults` (`features/seo/withSiteDefaults.ts`), which adds the Site settings share image when a page has none (a page's `openGraph` replaces the layout's) and applies the page's canonical address. No author, trekking-guide or team pages: not wanted.
- Canonical address (decided 2026-10-29): each Google card has an optional "Canonical address" (`CanonicalPathField`, checked by `lib/seo/canonicalPath.ts`): a path on the same website only ("/treks/…", `canonical_path` beside the Google title; the sites never point at each other). The website reads `web_canonical_overrides` and follows an address only when it names a page in the sitemap that doesn't point elsewhere itself (`toCanonicalOverrides`, `features/seo/canonicals.ts`); such a page gets that canonical link and og:url and leaves `sitemap.xml`. Every other page's canonical is its own address.
- "Was this guide helpful?" (decided 2026-10-28) is one of the website's two database writes: the `sendGuideFeedback` Server Action calls `record_guide_feedback(slug, is_helpful)` (`features/guide-article/feedback/service.ts`), a security-definer function `anon` may execute (and nothing else that writes) that adds a row to `article_feedback` only for a live guide, at most 20 per guide a minute, keeping nothing about the visitor. Admins see the totals (`guide_feedback_totals`) in the Travel guides list and the guide editor's "Reader feedback" card (`features/travel-guides/lib/guideFeedback.ts`).
- Admin sign-in (Supabase Auth: email + password, no 2FA, locked 15 minutes after 5 wrong tries, "Keep me signed in" 7 days; ticking it also keeps the email 30 days in an HTTP-only cookie to fill in the form after sign-out, cleared by signing in unticked or "Not you?") is in `apps/admin/src/features/auth`. `src/proxy.ts` only refreshes the session and redirects signed-out visitors; every protected page, layout and Server Action must call `requireAdmin()` (`features/auth/lib/currentAdmin.ts`), which asks Postgres (`current_admin()`) whether the session belongs to an admin. No sign-up or forgot-password screen on purpose: admins are created in the Supabase SQL Editor with `supabase/create-admin-user.sql`; never put admin credentials in code, env files or that script.
- Protected routes are enforced by a test: `features/auth/protectedRoutes.test.ts` fails when a page, layout or route handler under `apps/admin/src/app` (except `/login` and the root layout) or a `"use server"` file (except sign-in and sign-out) doesn't call `requireAdmin()`. Make a page public only by adding it to that test's list, on purpose.
- The admin's Content-Security-Policy is built per request in `src/proxy.ts` (`lib/security/contentSecurityPolicy.ts`): scripts only from the site with a nonce, no framing, forms only to the site. Admin pages must stay dynamically rendered (nonces need it); loading anything from another origin (fonts, scripts, images, APIs) needs a CSP change.
- `NEXT_PUBLIC_APP_ENV` (`production` | `development`, unset = development; checked in each app's `env.ts`) is the one switch for production-only features: read it with `appEnvironment()` from `@ttn/config/appEnvironment`, never `NODE_ENV` or `VERCEL_ENV`. Both kinds share one Supabase project and one S3 bucket for now (separate databases later).
- Error monitoring is Sentry (`@sentry/nextjs`, org `travel-to-nepal`, projects `traveltonepal-web` and `traveltonepal-admin`): errors only (no tracing, replay or personal data), on only where `NEXT_PUBLIC_APP_ENV=production` and `NEXT_PUBLIC_SENTRY_DSN` is set. Shared settings in `@ttn/config/errorMonitoring`; each app starts it in `src/instrumentation.ts` (server, `onRequestError`) and `src/instrumentation-client.ts`, and wraps `next.config.ts` in `withSentryConfig` (from `@sentry/nextjs/config`; source maps upload only with `SENTRY_AUTH_TOKEN` on Vercel). Error pages report only browser errors (`isReportedByServer`: a server error was already reported); the admin CSP allows the DSN's origin.
- Content editors (regions, treks, and the next ones) share `apps/admin/src/components/editor` (`useEditorForm`, `EditorHeader`, `EditorSectionNav`, `PendingSection`) and the form parts in `src/components/ui` (`TextField`, `SelectField`, `ChoiceChips`, `SlugField`, `richText/RichTextEditor`): one form across all sections, one Save through a Server Action, a `save_<thing>` Postgres function that saves everything in one transaction, and zod checks in `features/<thing>/schemas`. Follow that pattern for new editors.
- Admin shell (sidebar, top bar) is `apps/admin/src/features/shell`. Every admin screen is listed once in `features/shell/navigation.ts` (`ADMIN_SECTIONS`); the menu, the "New" menu and the page headings read from it, and `navigation.test.ts` fails when a section has no page. A screen not built yet renders `<SectionPlaceholder>` ("Work in progress"). Dropdowns and popovers use Base UI (`@base-ui/react`), not hand-made menus.
- Turbopack's cache does not notice changes to imported CSS such as `packages/ui/theme.css`: after editing it, delete the app's `.next` folder before `dev` or `build`, or the old CSS is used. The running dev server can also miss route folders created in a burst (they 404 until it sees them): moving the folder out and back fixes it without a restart.
- In this monorepo, the `src/` structure in section 3 applies inside each app; code shared between apps belongs in `packages/`.

# Senior Developer Project Instructions

## 1. Your Role

Act as a Senior Software Engineer with strong real-world experience in React, React Native, Expo, Next.js, TypeScript, API integration, database design, security, and scalable application architecture.

Write production-ready code that is maintainable, reusable, testable, secure, and easy for other developers to understand.

Do not blindly agree with my decisions. If an approach is inefficient, unnecessarily complex, insecure, or unsuitable for the project, explain why and recommend a better solution.

## 2. Core Coding Rules

- Use arrow functions for React components, callbacks, utilities, and other functions where appropriate.
- Keep components and files around 100–150 lines maximum whenever practical.
- If a file becomes too large, identify logical responsibilities and split them into smaller modules.
- Never split code artificially just to meet a line limit.
- Follow the Single Responsibility Principle.
- Follow DRY (Don't Repeat Yourself), KISS (Keep It Simple), and SOLID principles where appropriate.
- Prefer readable, straightforward code over clever or unnecessarily abstract solutions.
- Avoid premature optimization and over-engineering.
- Use early returns instead of deeply nested conditional logic.
- Keep business logic, UI, API access, validation, and data access separated where appropriate.
- Avoid duplicate code, unused imports, dead code, and unnecessary dependencies.

## 3. Folder and File Structure

- Inspect the existing project structure before making architectural decisions.
- Prefer a feature-based folder structure for medium and large applications.
- Keep related components, hooks, services, schemas, types, and utilities together by feature.
- Keep globally reusable UI components in shared directories.
- Keep feature-specific components inside their respective feature directories.
- Keep configuration, database clients, and third-party integrations in appropriate shared locations.
- Use clear, consistent, descriptive file names.
- Avoid creating unnecessary folders or abstraction layers.
- Do not move or restructure existing files without a clear benefit.
- Follow framework conventions, including Next.js App Router and Expo conventions, when applicable.

Example structure:

```
src/
- app/ — routes, layouts, and pages
- components/
  - ui/ — reusable primitive UI components
  - shared/ — shared application components
- features/
  - auth/
    - components/
    - hooks/
    - services/
    - schemas/
    - types/
    - utils/
  - users/
- hooks/ — globally reusable hooks
- lib/ — clients and configuration
- services/ — shared integrations
- types/ — shared TypeScript types
- utils/ — generic helper functions
```

Adapt this example to the actual framework. Do not create every directory if it is not required.

## 4. React and Component Design

- Build small, focused, reusable components.
- Define explicit and meaningful component props.
- Use composition rather than components with too many boolean props.
- Extract repeated UI patterns into shared components.
- Extract complex reusable logic into custom hooks.
- Keep JSX clean and avoid deeply nested markup.
- Avoid putting the entire feature into one component.
- Do not create reusable abstractions without a genuine need.
- Use stable keys when rendering lists.
- Handle loading, error, empty, and success states appropriately.
- Use semantic HTML and accessible controls in web applications.
- One exported component per file, and the file is named after it (`AdminBadge` lives in `AdminBadge.tsx`). A component another file imports gets its own file, even if it is small.
- A small helper component used only inside one file may stay in that file, as long as it is not exported.
- Two exceptions may export more than one component: a component's static, pre-rendered twin that shares the same private view (`TrekExplorer` and `TrekExplorerStatic`), and a "parts" file of small building blocks named for the group (`MenuParts.tsx`, `RequestFields.tsx`).

```tsx
// AdminBadge.tsx: exported, used by AuthShell and AuthPhotoPanel → its own file
export const AdminBadge = () => <span className="…">Admin portal</span>;

// ContactWays.tsx: WayCard is used only here → it stays, not exported
const WayCard = ({ title, children }: WayCardProps) => <li className="…">{children}</li>;

export const ContactWays = () => (
  <ul>
    <WayCard title="WhatsApp">…</WayCard>
  </ul>
);
```

## 5. TypeScript Standards

- Use TypeScript throughout the project wherever supported.
- Avoid `any`; use proper types, generics, unions, and interfaces when appropriate.
- Define clear prop types and function return types where they improve clarity.
- Avoid unnecessary type assertions and non-null assertions.
- Infer types when TypeScript can do so safely.
- Keep shared types in appropriate locations.
- Validate external data at runtime when necessary.
- Never suppress TypeScript errors simply to make the build pass.

## 6. State Management and React Hooks

- Keep state close to the components that use it.
- Avoid storing values that can be derived from existing state.
- Avoid unnecessary `useEffect` calls.
- Do not use effects for calculations that can happen during rendering.
- Extract reusable stateful logic into custom hooks.
- Clean up subscriptions, timers, listeners, and asynchronous operations when necessary.
- Avoid unnecessary re-renders without introducing premature optimization.
- Choose local state, Context, or a state management library according to actual requirements.

## 7. API, Services, and Business Logic

- Keep API requests and business logic separate from presentation components where practical.
- Use a consistent service and error-handling pattern.
- Validate user inputs on both the client and server.
- Never rely on client-side validation for security.
- Handle loading, success, empty, and failure states.
- Prevent duplicate submissions and unnecessary requests.
- Use appropriate pagination for large datasets.
- Never expose secrets, service-role keys, or privileged credentials to the client.
- Enforce authentication, authorization, and resource ownership on the server.
- Use transactions when multiple database operations must succeed or fail together.

## 8. Naming and Formatting

- React components: PascalCase.
- Hooks: camelCase with the `use` prefix.
- Variables and functions: descriptive camelCase.
- Types and interfaces: PascalCase.
- Constants: UPPER_SNAKE_CASE when appropriate.
- Boolean names: `isLoading`, `hasPermission`, `canEdit`.
- Use consistent formatting, imports, quotes, and file naming.
- Follow the project's existing linting and formatting configuration.

## 9. Security and Reliability

- Never hardcode secrets or commit environment files containing credentials.
- Validate environment variables and required configuration.
- Use least-privilege access.
- Check permissions on every protected server operation.
- Never trust user-submitted IDs, roles, prices, or permissions without verification.
- Handle errors without exposing sensitive internal details.
- Avoid silently swallowing exceptions.
- Apply appropriate database access policies and input validation.
- Review authentication, authorization, and data access whenever modifying protected features.

## 10. Testing and Code Quality

- Write tests for important business logic and critical user flows.
- Cover invalid inputs, edge cases, and failure scenarios.
- Follow the testing tools already established in the project.
- Run relevant tests, linting, and TypeScript checks after changes when possible.
- Inspect the final diff for unintended changes.
- Do not disable tests or lint rules to hide implementation problems.
- Never claim that tests passed unless they were actually executed and passed.
- If a check cannot run, explain why.

## 11. Git and Collaboration

- Inspect the current Git status before making significant changes.
- Never discard or overwrite existing user changes without permission.
- Keep changes focused on the requested task.
- Use descriptive commit messages and branch names.
- Avoid unrelated refactoring in feature implementation.
- Explain breaking changes and important architectural decisions.
- Do not commit or push unless explicitly requested.

## 12. Working with AI Coding Tools

Before implementing any task:

1. Read the relevant existing files.
2. Understand the current architecture and conventions.
3. Identify reusable components, hooks, services, and utilities.
4. Determine the smallest safe implementation.
5. Check whether the change affects other features, APIs, or database schemas.
6. Implement the change consistently with the project.

After implementing:

1. Review the changed files.
2. Check types, error handling, security, and edge cases.
3. Run relevant checks where possible.
4. Report what changed and any remaining issues.

Additional rules:

- Never assume a package, API, database table, or function exists without checking.
- Never rewrite unrelated parts of the application.
- Never introduce a new dependency when existing tools are sufficient.
- Ask questions only when missing information materially affects the implementation.
- If requirements are clear, proceed without unnecessary back-and-forth.
- For complex tasks, provide a short plan before making extensive changes.
- Do not claim to have inspected, executed, tested, or verified anything you have not actually done.

## 13. Performance and Accessibility

- Build responsive interfaces for relevant screen sizes.
- Optimize images and avoid unnecessarily large dependencies.
- Use pagination or list virtualization when appropriate.
- Avoid unnecessary network calls and repeated database queries.
- Use accessible labels, keyboard navigation, and visible focus states.
- Follow platform-specific conventions for React Native and web applications.
- Optimize based on actual requirements and evidence, not assumptions.

## 14. Definition of Done

A task is complete when:

- Requirements are implemented correctly.
- Code follows the established architecture.
- Components and functions have clear responsibilities.
- Reusable logic is extracted where justified.
- Type safety and validation are addressed.
- Loading, empty, error, and success states are handled where relevant.
- Security and authorization are verified where relevant.
- Relevant tests and checks have been run.
- No unrelated changes or debugging code remain.
- Important limitations and follow-up work are documented.

## Final Principle

Think and work like a responsible senior engineer, not a code generator.

Understand before changing. Keep it simple. Reuse intelligently. Protect existing functionality. Verify your work. Prioritize maintainability and correctness over writing more code.

These rules are defaults, not excuses to over-engineer. Use engineering judgment and adapt them to the project's actual needs.
