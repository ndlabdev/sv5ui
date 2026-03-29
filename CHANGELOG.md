# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Collapsible** — Expandable/collapsible content panel built on bits-ui with trigger props delegation and animated transitions
- **Command** — Search-enabled command menu with grouped items, keyboard navigation, filtering, loading state, and custom slots
- Add `scrollbar-thin` utility for visible thin scrollbar on scrollable areas

### Fixed

- Select/SelectMenu/Command: add `max-h-60 overflow-y-auto scrollbar-thin` to viewport/list so long item lists scroll properly
- Command: move hardcoded input wrapper, icon, footer, itemWrapper styles into variant slots
- Command: use `twMerge` for item class merging instead of string concatenation
- Command: add `bind:search` prop for external filtering support
- Command: forward `label` prop to Root for accessibility

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

[Unreleased]: https://github.com/ndlabdev/sv5ui/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/ndlabdev/sv5ui/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/ndlabdev/sv5ui/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ndlabdev/sv5ui/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ndlabdev/sv5ui/releases/tag/v1.0.0
