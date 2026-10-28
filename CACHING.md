# Cache Components strategy

Cache Components are enabled with `cacheComponents: true` and
`partialPrefetching: true` in `next.config.ts`. Cached queries are kept in the
event entity and use explicit `cacheLife` profiles and tags.

| Cached function | `cacheLife` | Tags | Invalidated by | Reason |
| --- | --- | --- | --- | --- |
| `getManagedEvents()` | `hours` | `events:managed-list` | `saveEventAction` and `deleteEventAction` call `updateTag("events:managed-list")` | The catalog changes only through authenticated organizer actions. Read-your-writes invalidation makes those changes visible immediately. |
| `getManagedEvent(slug)` | `hours` | `events:managed-list`, `events:managed:${slug}` | Matching event save/delete actions call `updateTag` for both the list and that slug | Direct local-event lookup shares the catalog lifetime but uses a narrow detail tag to avoid invalidating unrelated event details. |
| `getCachedDevtoArticles(tag)` | `hours` | `devto:articles`, `devto:tag:${tag}` | `refreshExternalEventsAction` calls `revalidateTag("devto:articles", "max")`; the profile also refreshes hourly | Community articles are not written by this app, so stale-while-revalidate is appropriate. Tag-specific keys avoid mixing category feeds. |
| `getCachedEventBySlug(slug)` | `hours` | `events:managed-list`, `events:managed:${slug}`, `devto:articles` | Organizer actions use `updateTag` for local events; source refresh uses `revalidateTag("devto:articles", "max")` | The detail lookup prefers local records, then resolves a community article. It is tagged to refresh either source without invalidating unrelated GitHub data. |
| `getCachedGithubReleases()` | `days` | `github:nextjs-releases` | `refreshExternalEventsAction` calls `revalidateTag("github:nextjs-releases", "max")`; the profile also refreshes daily | Framework releases change less often than community articles, so they use a longer lifetime and stale-while-revalidate on explicit refresh. |

`updateTag` is used only in Server Actions that save or delete organizer events;
it provides read-your-writes behavior for the catalog and the affected detail.
`revalidateTag(tag, "max")` is used for public-source refresh because those
sources can safely show their previous cached response while a fresh response
is fetched.

Authentication is checked outside cached functions. `getDashboardEvents()`
validates the session before calling the cached `getManagedEvents()` query, and
Server Actions validate the session before every mutation. Neither `cookies()`
nor `headers()` is used inside a `"use cache"` scope.

Seat availability is deliberately not cached. `SeatsCounter` calls
`connection()` before reading the SQLite seat table, so the count is evaluated
at request time and streams beneath Suspense while event data remains cached.
