# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Editor** — Rich-text WYSIWYG editor built on Tiptap v3 + ProseMirror. Available via the sub-export `sv5ui/editor` so Tiptap (~120 KB gzipped) is tree-shaken out of the bundle when not used. Features: 23 toolbar actions (bold/italic/underline/strike/code, h1-h3, lists, blockquote, code block, link, text alignment, undo/redo), config-driven toolbar (`toolbar={['bold', '|', 'h1']}` or `true`/`false`), HTML or JSON output, bindable `value` + imperative `bind:api` (`focus`/`run`/`getValue`/`setValue`/`clear`/`insert`), bubble menu on text selection, `maxLength` + character/word counter, readonly/disabled, autofocus, sticky toolbar, custom snippets (`toolbarSlot`/`bubbleMenuSlot`/`header`/`footer`), and escape-hatch `extensions` / `extensionsOverride` props for arbitrary Tiptap extensions. SSR-safe (Tiptap mounts client-side in `$effect`). 36 tests covering rendering, content I/O, toolbar interactions, imperative API, and variants.
- **Editor (Phase 2)** — Five new feature sets layered on top:
    - **Form integration** — Wires `useFormFieldEmit` so events bubble to `<Form>` for per-field validation; reads `<FormField>` context for `id`/`name`/`error`/`aria-describedby` so a label `for=` targets the inner contenteditable; error state flips the focus ring to `error` color and sets `aria-invalid` on the ProseMirror element.
    - **Image upload** — `image` prop enables the `image` toolbar action and a hidden file input. Pair with `onImageUpload(file) => Promise<url>` to wire your backend upload; falls back to a URL prompt when no handler is provided.
    - **Tables** — `tables` prop enables `@tiptap/extension-table` (resizable). The `table` toolbar action opens an inline dimension picker (hover an 8×8 grid → click to insert).
    - **Mentions** — `onMention(query) => Promise<MentionItem[]>` enables @-style suggestions backed by `@tiptap/extension-mention` + `@tiptap/suggestion`. Custom suggestion popup positioned via `@floating-ui/dom`; keyboard navigation (Up/Down/Enter/Esc). Configurable trigger via `mentionTrigger` (default `'@'`).
    - **Markdown output** — `output="markdown"` serializes via `tiptap-markdown` and accepts pasted markdown.

    New props: `image`, `onImageUpload`, `tables`, `onMention`, `mentionTrigger`, `id`, `name`. New toolbar actions: `image`, `table`. New `EditorOutput` value `'markdown'`. Exports new `MentionItem` type. 8 additional tests bringing total to 45.
- **Editor (Phase 3a)** — Three more features layered on top of Phase 2 plus a security/quality pass:
    - **Slash commands** — Enable via `slash` prop. Typing `/` opens a command palette with built-in actions (paragraph/h1-h3/bullet/ordered/quote/code/divider, plus image/table/YouTube when those flags are on). Customize via `slashCommands={[...]}` and `slashTrigger`. Helper export `buildDefaultSlashCommands({ image, tables, youtube })` for extending defaults.
    - **YouTube embeds** — `youtube` prop enables `@tiptap/extension-youtube` and registers the `youtube` toolbar action.
    - **Drag handle** — `dragHandle` prop enables `@tiptap/extension-drag-handle`. Hover any block (paragraph/heading/list/table) → a grip appears on the left → drag to reorder.
    - **URL prompt modal** — Image / YouTube / Link toolbar actions and slash commands now open a sv5ui `<Modal>` with `<Form>` + `<FormField>` for validation, loading state, and inline errors. Default URL schema enforces `http(s)://`; YouTube actions also enforce a YouTube-host regex.
    - **`markdownAllowHtml` prop** (default `false`) — raw HTML is escaped on markdown serialize/parse unless explicitly opted in.
    - Tiptap moved from `dependencies` → optional `peerDependencies` so non-Editor users pay zero install/bundle cost.

    New props: `slash`, `slashCommands`, `slashTrigger`, `youtube`, `dragHandle`, `markdownAllowHtml`. New toolbar action: `youtube`. New exported helper: `buildDefaultSlashCommands`. New exported type: `SlashCommand`. 9 additional tests bringing total to 54.
- **Banner** — Full-width announcement bar typically rendered at the top of a page or layout. 8 colors, optional `icon`, `title`, inline `actions`, dismiss button (`close`), and clickable mode via `to`/`target` (root becomes `<a>`). When given an `id`, dismissal persists across reloads via `localStorage` (key: `sv5ui-banner-{id}`); without an `id`, dismissal is session-only. Snippets: `leading`, `titleSlot`, `actionsSlot`, `closeSlot`. Per-slot `ui` overrides.
- **Stepper** — Multi-step wizard/progress component. Horizontal or vertical orientation, 5 sizes, 8 colors, `pending`/`active`/`completed` states with `linear` gating (default), bindable imperative `api` (`next` / `prev` / `goTo` / `hasNext` / `hasPrev`) for external Back/Next buttons, roving keyboard navigation, and per-slot `ui` overrides. Pure custom build — no bits-ui primitive.

## [1.7.0] - 2026-05-14

### Added

- **Select / SelectMenu** — `multiple` prop for selecting more than one option. When `true`, `value` becomes `string[]` and the dropdown stays open after each selection. The trigger displays selected labels joined by `separator` (default `, `), and a new `selected` snippet receives `{ items, remove, clear }` for custom rendering such as chips/tags.
- **SelectMenu** — `createItem` prop (`boolean | 'always' | 'lazy'`) lets users add values not present in `items` by typing in the search box. Defaults to `'lazy'` (offered only when no item matches); `'always'` keeps the create option visible. Companion props: `createItemLabel` (string or `(value) => string`), `createItemIcon`, and `onCreate(value)` callback. Created values are tracked internally so the trigger renders their label even if the caller does not push them into `items`. Pressing <kbd>Enter</kbd> from the search input creates when there are no matches.
- **Modal / Slideover** — `size` prop standardizing dimensions to `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` (default `'md'`). For Slideover, `size` controls `max-width` for `left`/`right` sides and `max-height` for `top`/`bottom` sides.
- **Modal / Slideover** — `transition` prop accepts string values `'none' \| 'fade' \| 'slide' \| 'scale'` in addition to the legacy `boolean`. Modal defaults to `'scale'`; Slideover defaults to `'slide'` (side-aware). `true` keeps mapping to the previous default; `false` maps to `'none'`.
- **FileUpload** — `maxSize` (bytes per file) and `maxFiles` (count cap) validation props. Files exceeding either limit are rejected without entering `value`. The root element exposes `data-full` when the `maxFiles` limit is reached.
- **FileUpload** — `onReject(rejected)` callback fires with the list of files that were filtered out by `accept`, `maxSize`, or `maxFiles` during a single drop or input change. New `FileUploadRejection` type exported.
- **Calendar** — `isDateHighlightable` predicate prop for visually marking special dates (holidays, events) without affecting selection or disabled state. Matched cells receive a `data-marked` attribute and render a small dot indicator under the day number; override via the `cellTrigger` slot or `ui.cellTrigger` with the `data-[marked]:` modifier.
- **Calendar** — `maxDays` is now wired through to bits-ui in `type="multiple"` mode (it was already wired for `range`). Set it to cap how many dates the user can pick.
- **PinInput** — `loading` and `loadingIcon` props. When `loading` is true, a spinner overlays the cells and the input is disabled, ideal for OTP verification flows.
- **FileUpload** — `id` is now applied to the focusable element (the dropzone area, or the `Button` when `variant="button"`) so a parent `<FormField>`'s label can target it.
- **Calendar** — new `id` and `name` props on the root. `id` flows to bits-ui's root for label association; `name` is exposed as `data-name` for downstream consumers.
- **Carousel** — Slideshow / carousel component built on [Embla Carousel](https://www.embla-carousel.com). Supports arrows, dots, looping, autoplay (with pause-on-hover/focus/interaction/last-snap), fade transitions, multiple slides per view (`slidesToShow`, `slidesToScroll`), drag-free scrolling, horizontal & vertical orientations, responsive breakpoints, custom `slide`/`dot`/`prevSlot`/`nextSlot` snippets, full `bind:index` + `bind:api` controlled mode, `onIndexChange` / `onSettle` callbacks, size/color/variant tokens, and per-slot `ui` overrides

### Changed

- **FileUpload** — `accept` rejections now also surface through `onReject` (previously silent). No behavior change unless an `onReject` callback is provided.
- **FileUpload / Calendar** — now read the parent `<FormField>` context. Errors propagate to `aria-invalid` + visual highlight (FileUpload) or error color (Calendar), and `aria-describedby` wires up to the FormField's description and error text. Focus, blur, and change events are emitted to the parent `<Form>` when wrapped in a FormField.

### Deprecated

- **Modal** — `fullscreen` prop is now an alias for `size="full"`. Existing code keeps working unchanged; new code should prefer `size="full"`.

## [1.6.0] - 2026-04-06

### Added

- **Form** — Centralized form validation and submission component with full parity to Nuxt UI v4's Form. Supports Zod 3.24+, Valibot 1.0+, Yup 1.7+ (via Standard Schema) and Joi 17+ (dedicated adapter). Features: custom validate function (sync/async), field-level validation on blur/input/change/focus with per-field debounce and eager-after-first-blur semantics, dirty/touched/blurred field tracking, loading auto-disable, nested forms with cascading validation/setErrors/clear/reset and state merging (full-form and field-scoped), schema transform output, full programmatic API via `bind:api` (submit, validate, clear, reset, setErrors, getErrors, errors, loading, dirty, submitCount)
- **useFormFieldEmit / wireFormEvents** — Helper hooks for custom input components to emit form events (blur, input, change, focus) to the parent Form via the FormField context
- **Input** — `InputValue` generic type (`string | number | bigint | boolean | null | undefined`) and `InputProps<T extends InputValue>` for type-safe `bind:value` inference based on the input `type` attribute
- **FormField** — `eagerValidation`, `validateOnInputDelay`, and `errorPattern` props for fine-grained field-level validation control when used inside a Form

### Changed

- **Input / Textarea / Select / SelectMenu / Checkbox / CheckboxGroup / RadioGroup / Switch / PinInput / Slider** — Wired up form event emission via `useFormFieldEmit`, enabling field-level validation when used inside a `<Form>`. CheckboxGroup and RadioGroup fire focus/blur on the fieldset wrapper (ignoring focus moves between items within the same group). Backward-compatible: no-op when used outside a Form
- **FormField** — Context key migrated from string `'formField'` to an exported Symbol `FORM_FIELD_CONTEXT_KEY` to prevent collisions with unrelated `getContext('formField')` calls from user code or other libraries

## [1.5.1] - 2026-04-02

### Added

- **Table** — `action` prop for applying Svelte actions (e.g. `useInfiniteScroll`) directly on the root element, eliminating the need for a wrapper div
- **Table** — `scrollbar-thin` on root wrapper for thinner scrollbar styling

### Fixed

- **Table** — Sticky header/footer `backdrop-blur-sm` causing rounded corners to be lost (added matching `rounded-t-xl`/`rounded-b-xl`)

## [1.5.0] - 2026-04-02

### Added

- **useMediaQuery** — Reactive media query hook for viewport breakpoints, user preferences (dark mode, reduced motion), and custom queries with SSR-safe initial value
- **useClipboard** — Reactive clipboard hook with auto-reset copied state, configurable timeout, and error handling
- **useFormField** — Hook to access nearest FormField context (name, size, error, ariaId) from any child component, replacing inline getContext boilerplate across 10 form components
- **useClickOutside** — Svelte action to detect clicks outside an element, with enable/disable support
- **useInfiniteScroll** — Reactive infinite scroll hook with Svelte action, auto loading state, configurable threshold, and enable/disable
- **useEscapeKeydown** — Svelte action to listen for Escape key with enable/disable support
- **useDebounce** — Reactive debounce hook with pending state, cancel, and flush support
- **Table** — Full-featured data table with sorting (single/multi), global & column filtering, client/server pagination, row selection (single/multiple with checkbox), column visibility, column pinning (left/right), row pinning, row expanding, column resizing (drag), loading states (replace/overlay), striped/hoverable/sticky variants, custom cell/header/footer snippets, body-top/body-bottom slots, polymorphic root (`as` prop), row hover/contextmenu callbacks, responsive (`contain: inline-size`), dark mode, and configurable sort icons via global config

## [1.4.0] - 2026-03-30

### Added

- **Collapsible** — Expandable/collapsible content panel built on bits-ui with trigger props delegation and animated transitions
- **Command** — Search-enabled command menu with grouped items, keyboard navigation, filtering, `bind:search`, and custom slots
- **Toast** — Notification toasts powered by svelte-sonner with 5 variants (outline, soft, subtle, solid, accent), 7 semantic colors, custom icon/avatar support, and deduplicated toasts
- `scrollbar-thin` utility for visible thin scrollbar on scrollable areas

### Fixed

- Select: add `max-h-60 overflow-y-auto scrollbar-thin` to viewport so long item lists scroll properly
- SelectMenu: add `scrollbar-thin` to viewport for visible scrollbar

## [1.3.0] - 2026-03-28

### Added

- **CheckboxGroup** — Grouped checkboxes with single/multiple selection, per-item disabled state, and FormField integration
- **FileUpload** — Drag-and-drop file upload with preview list/grid, image thumbnails, file size formatting, accept filter, and multiple files support
- **Slider** — Range slider with single/range values, step, orientation, tooltip labels, and FormField integration
- **PinInput** — PIN/OTP input with masking, numeric type filtering, OTP autocomplete, highlight state, and FormField integration
- **SelectMenu** — Searchable multi-select menu with chips, groups, and FormField integration

### Fixed

- FileUpload `data-dragging` attribute now uses empty string instead of boolean
- FileUpload `formatFileSize` preserves trailing zero (`1.0 KB` not `1 KB`)
- Tabs icon test uses `expect.poll` with timeout for async Iconify rendering
- Badge `isIconOnly` logic corrected

## [1.2.0] - 2026-03-26

### Added

- **Select** — Dropdown select with 5 variants, icons, avatars, groups, descriptions, and FormField support
- **Switch** — Toggle switch with 8 colors, 5 sizes, checked/unchecked icons, loading state, and FormField integration
- **Checkbox** — Checkbox with 8 colors, 5 sizes, indeterminate state, custom icons, and FormField integration
- **RadioGroup** — Radio group for single-selection with items API, legend, orientation, and FormField integration
- **Input** — Text input with 5 variants, icons, avatar, loading state, and FormField integration
- **Textarea** — Multi-line text input with 5 variants, icons, autoresize, and FormField integration
- **FormField** — Form control wrapper providing label, description, hint, help, and error handling
- **FieldGroup** — Groups buttons and inputs with seamless borders and shared size/orientation context
- **Calendar** — Date picker calendar with single, multiple, and range selection modes
- **Tabs** — Tabbed interface with content panels, icons, and configurable orientation
- **Pagination** — Page navigation with first/prev/next/last controls, ellipsis, and variant/color support
- **ContextMenu** — Right-click context menu with items, colors, and keyboard navigation
- **DropdownMenu** — Triggered floating menu with items, groups, separators, and sub-menus

### Changed

- Refactored all existing components to align with Nuxt UI v4 structure
- Added `ref` prop with `$bindable(null)` to all components
- Standardized restProps spread order across all components

### Fixed

- Card variant made fully clickable
- Chip component bugs with ref and bindable show
- Separator avatar size moved from TV slots to config defaults
- Alert component architecture improvements
- Avatar replaced status with chip prop, fixed AvatarGroup rounded bug
- Button replaced bits-ui Button.Root with internal Link component
- Tooltip embedded TooltipProvider inside component

## [1.1.0] - 2026-03-22

### Added

- **Accordion** — Expandable sections with single/multiple open modes
- **Modal** — Accessible dialog with overlay, focus trap, and scroll lock
- **Slideover** — Side panel sliding from any edge with inset mode
- **Drawer** — Draggable bottom/side sheet with snap points
- **Tooltip** — Hover tooltip with arrow, keyboard shortcut display, and portal rendering
- **Popover** — Floating interactive content panel with focus management
- **Breadcrumb** — Hierarchical navigation trail with icons and custom separators
- **Skeleton** — Animated loading placeholder
- **Empty** — Empty state with icon, description, and action slots
- **User** — User profile display combining avatar, name, and description
- **Timeline** — Step/sequence visualization with completed, active, and pending states
- **Container** — Responsive max-width wrapper for page content
- **Kbd** — Keyboard shortcut display with OS-aware symbol mapping
- **Progress** — Determinate/indeterminate progress bar with step mode
- **Badge** — Status indicators and tags in 4 variants and 8 colors
- **Chip** — Notification dot indicator with configurable positioning
- **Separator** — Horizontal/vertical divider with optional label, icon, or avatar
- **Card** — Content container with header, body, and footer slots
- **Link** — Smart anchor with automatic active-state detection
- **Alert** — Notification banner with icon, actions, and dismissible support
- Global configuration system with `defineConfig`

## [1.0.0] - 2026-03-18

### Added

- Initial release
- **Button** — Versatile button with 6 variants, loading state, icons, and avatar support
- **Icon** — Iconify wrapper for 200,000+ icons
- **Avatar** — Profile image with auto-generated initials fallback
- **AvatarGroup** — Stacked avatars with overflow count
- **ThemeModeButton** — Light/dark mode toggle
- OKLCH color token system with light/dark mode
- Tailwind CSS 4 + Tailwind Variants integration
- bits-ui and Vaul Svelte headless primitives

[Unreleased]: https://github.com/ndlabdev/sv5ui/compare/v1.6.0...HEAD
[1.6.0]: https://github.com/ndlabdev/sv5ui/compare/v1.5.1...v1.6.0
[1.5.1]: https://github.com/ndlabdev/sv5ui/compare/v1.5.0...v1.5.1
[1.5.0]: https://github.com/ndlabdev/sv5ui/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/ndlabdev/sv5ui/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/ndlabdev/sv5ui/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/ndlabdev/sv5ui/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ndlabdev/sv5ui/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ndlabdev/sv5ui/releases/tag/v1.0.0
