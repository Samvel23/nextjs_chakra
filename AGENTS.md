<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project coding standards

- Use Feature-Sliced Design. Follow the dependency direction `app` → `processes` → `pages` → `widgets` → `features` → `entities` → `shared`; lower layers must not import from upper layers. Keep same-layer segments isolated and expose cross-segment APIs through each segment's `index.ts`. In this Next.js App Router project, `app/` owns routing and route entry points; do not add a competing Next.js `pages/` router.
- Use SCSS Modules for component styling. Every UI component must have a colocated `[ComponentName].module.scss` file, and component styles must be applied through its imported CSS Module classes. Chakra UI components may be used for semantic primitives and behavior, but do not use Chakra styling props for visual presentation; put those rules in the SCSS Module. Do not use `style` props or inline style objects.
- Use `next-intl` for all user-facing text, labels, buttons, and placeholders. Add or update message keys instead of hardcoding UI strings.
- Write components, helpers, and utilities as arrow functions. Prefer implicit returns when rendering needs no statements before the returned value; use a block body only when setup or logic is needed.
