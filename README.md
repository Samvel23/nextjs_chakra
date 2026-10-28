# Tech Events Dashboard

A Next.js 16 App Router events platform using Chakra UI v3, TypeScript, SCSS
Modules, next-intl, and Feature-Sliced Design. It lists Dev.to community talks,
Next.js releases, and organizer-managed events stored in SQLite.

## Requirements

- Node.js 20.9 or newer
- npm

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The local dashboard password defaults to `demo-password` when
`DASHBOARD_PASSWORD` is not set in development. Set `DASHBOARD_PASSWORD` and a
long random `AUTH_SECRET` in `.env.local` for your own local setup. `GITHUB_TOKEN`
is optional; without it, the dashboard uses GitHub's unauthenticated API quota.
`EVENTS_DB_PATH` defaults to `.data/tech-events.sqlite`. The `.data/` directory
is ignored by Git and persists organizer events between local runs.

Open [http://localhost:3000/events](http://localhost:3000/events) to browse.
Sign in at [http://localhost:3000/login](http://localhost:3000/login) to use the
organizer dashboard.

## Features

- `/events` has URL-driven category, date, and text filters.
- `/events/[slug]` renders event details with related Dev.to articles and the
  latest stable Next.js release. Event links open in an intercepted modal during
  soft navigation and render a full page on direct navigation or reload.
- `/dashboard` is protected by a signed, expiring HTTP-only cookie. The proxy
  redirects requests without a session cookie; the dashboard data layer and
  every mutation also verify the session.
- Create, edit, delete, and registration operations use Server Actions,
  server-side Zod validation, optimistic UI where appropriate, and targeted
  cache invalidation.
- The `@stats` and `@activity` dashboard slots load independently.
- External API payloads are parsed with Zod and each source has an isolated
  fallback boundary.
- English and French messages are in `shared/config/i18n/messages/`.
- Light/dark theme tokens, Chakra recipes, and the EventCard slot recipe are
  configured in `shared/config/chakra-system.ts`.

## Commands

```bash
npm run dev       # Development server (Turbopack)
npm run lint      # ESLint
npm test          # Vitest unit tests
npm run test:e2e  # Playwright end-to-end test
npm run build     # Production build
npm start         # Run the production build
```

`npm run test:e2e` starts a local development server and uses a dedicated
`.data/playwright.sqlite` database. Install the Playwright Chromium browser if
it is not already available:

```bash
npx playwright install chromium
```

## Cache strategy

See [CACHING.md](./CACHING.md) for each cached function, its lifetime, tags,
invalidation mechanism, and rationale. Cache Components are enabled in
`next.config.ts`; cookies are read only outside cached scopes.

## Quality notes

The production build and the `/events` and `/events/[slug]` Lighthouse targets
should be measured on the deployment environment before claiming a score. No
Lighthouse score or screenshot is checked into this repository until it has
been captured and verified against a production build.
