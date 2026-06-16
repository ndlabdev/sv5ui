# SV5UI Hooks — Roadmap & Packaging Plan

Plan for growing the composables (`src/lib/hooks`) that ship with SV5UI.

## Packaging decision

**Keep hooks inside the `sv5ui` package — do NOT split into a separate npm.**

Hooks are exported from the main entry (`export * from './hooks/index.js'`) and
tree-shaking already works (ESM named exports + `sideEffects: ["**/*.css"]`), so
importing a single hook does not pull components into the bundle. Adding more
hooks scales fine in one package.

Optional polish (not required): a `sv5ui/hooks` subpath export — purely for API
clarity, no meaningful bundle benefit. Worth doing only if/when the public
surface needs the clearer separation.

### When a separate package WOULD be justified

Split into `@sv5ui/hooks` only if **all** of these become true — none apply today:

- The hooks have an audience that wants them **without** the components.
- They genuinely need an **independent release cadence**.
- They carry their own peer deps / different version policy.

Number of hooks (7 vs 25) is not the trigger — independent audience + lifecycle is.

> Caveat: `useFormField` / `useFormFieldEmit` / `FORM_FIELD_CONTEXT_KEY` are coupled
> to the Form/FormField components (shared context key). They cannot be extracted
> cleanly and should stay regardless.

## Existing hooks (7)

`useMediaQuery`, `useClipboard`, `useFormField` (+ `useFormFieldEmit`,
`FORM_FIELD_CONTEXT_KEY`), `useClickOutside`, `useInfiniteScroll`,
`useEscapeKeydown`, `useDebounce`.

## Proposed new hooks

### Group A — Component support (UI-library fit, dogfood-able)

| Hook                                   | Signature (sketch)                                            | Dogfood target                                            | Value                                             |
| -------------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| `useEventListener`                     | `useEventListener(target, type, handler, opts?)`              | many hand-rolled `addEventListener`                       | Foundation; auto-cleanup; other hooks build on it |
| `useResizeObserver` / `useElementSize` | `const size = useElementSize(() => el)` → `{ width, height }` | Tabs indicator, Carousel, Table                           | Repeated pattern, easy to leak; centralize        |
| `useScrollLock`                        | `useScrollLock(() => open)`                                   | Modal / Slideover / Drawer (existing `scroll-lock` chunk) | Body scroll lock without layout shift             |
| `useFocusTrap`                         | `useFocusTrap(() => el, { active, restore })`                 | Modal / Slideover / Drawer / Popover                      | a11y; hard to get right — worth packaging         |
| `useThrottle`                          | `const t = useThrottle({ delay }); t.run(fn)`                 | scroll / resize / search                                  | Natural companion to `useDebounce`                |
| `useIntersectionObserver`              | `useIntersectionObserver(() => el, cb, opts)`                 | generalizes `useInfiniteScroll`                           | Lazy images, reveal-on-scroll, visibility         |
| `useTimeout` / `useInterval`           | `useInterval(fn, () => ms, { paused })`                       | Toast auto-dismiss, Carousel autoplay                     | Timers with proper runes teardown                 |
| `useHotkeys`                           | `useHotkeys({ 'mod+k': open, esc: close })`                   | Command (⌘K palette)                                      | Declarative shortcuts, auto listener cleanup      |

### Group B — Large-system / scale & robustness

| Hook                        | Signature (sketch)                                                          | Value for large apps                                                                                                                                        |
| --------------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `useLocalStorage`           | `const v = useLocalStorage('key', default)`                                 | Persistent reactive state + **cross-tab sync** (storage event): prefs, drafts, theme, Table column state. Dogfood: Banner                                   |
| `useVirtualizer` ⭐         | `useVirtualizer({ count, estimateSize, getScrollEl })`                      | **Highest impact** — virtual scrolling for thousand-row lists/tables (Table review flagged the missing virtualization). Serves Table / SelectMenu / Command |
| `useAsync` / `useAsyncData` | `useAsync(fetcher, { immediate })` → `{ data, error, loading, run, abort }` | Async state machine + abort-on-unmount + race protection. Backs async SelectMenu options, Table server data                                                 |
| `useDebouncedState`         | `let s = useDebouncedState('', 200)`                                        | State + debounce combined — the pattern hand-written in SelectMenu, reusable for search at scale                                                            |
| `useBroadcastChannel`       | `const ch = useBroadcastChannel('auth')`                                    | Cross-tab sync (logout/login, cache invalidation) — enterprise standard                                                                                     |
| `useNetworkStatus`          | `const net = useNetworkStatus()` → `{ online, effectiveType }`              | Offline banners, queue/defer actions when offline                                                                                                           |
| `useIdle`                   | `const idle = useIdle({ timeout })`                                         | Auto-logout, pause polling when idle — internal/secure systems                                                                                              |
| `usePreferredReducedMotion` | `const reduce = usePreferredReducedMotion()`                                | a11y across all SV5UI animations (`theme.css` keyframes) — respect `prefers-reduced-motion`                                                                 |

### Explicitly skipped

`useDarkMode` (covered by the `mode-watcher` peer), `useId` (provided by bits-ui),
`useToggle` / `useBoolean` (too trivial to justify).

## Sequencing (composition-aware)

1. **Foundation** — `useEventListener`, then `useResizeObserver`,
   `useIntersectionObserver`, `useTimeout`/`useInterval` build on it.
2. **a11y / overlays (dogfood)** — `useScrollLock`, `useFocusTrap`; refactor
   Modal/Slideover/Drawer to use them (cuts internal duplication, real tests).
3. **Scale tier 1** — `useLocalStorage`, `useDebouncedState`, `useThrottle`, `useAsync`.
4. **Scale tier 2 (enterprise)** — `useVirtualizer` (large; own milestone),
   `useBroadcastChannel`, `useNetworkStatus`, `useIdle`,
   `usePreferredReducedMotion`, `useHotkeys`.

### Suggested starter batch (best value/effort)

`useEventListener` + `useResizeObserver` + `useScrollLock` + `useFocusTrap` +
`useLocalStorage` — all dogfood-able immediately (Tabs / overlays / Banner),
reduce duplicated internal code, and have real components to test against.

## Delivery convention (per hook)

- One file `src/lib/hooks/useX.svelte.ts` + `useX.svelte.spec.ts`.
- Export from `src/lib/hooks/index.ts` (hook + its options type).
- Svelte 5 runes; every listener/observer/timer cleaned up in the effect teardown.
- One issue + one branch + PR into `dev`, following the project's branch/release flow.
