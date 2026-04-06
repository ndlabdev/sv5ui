# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
