<p align="center">
  <img src="https://img.shields.io/badge/sv5ui-Svelte_5_UI-ff3e00?style=for-the-badge&logo=svelte&logoColor=white" alt="SV5UI" />
</p>

<h1 align="center">SV5UI</h1>

<p align="center">
  A modern, fully-typed UI component library for Svelte 5.<br/>
  Built with Tailwind CSS 4, OKLCH color tokens, and accessible headless primitives.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sv5ui"><img src="https://img.shields.io/npm/v/sv5ui.svg?style=flat-square&colorA=18181b&colorB=ff3e00" alt="npm version" /></a>
  <a href="https://github.com/ndlabdev/sv5ui/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/sv5ui.svg?style=flat-square&colorA=18181b&colorB=ff3e00" alt="license" /></a>
  <a href="https://www.npmjs.com/package/sv5ui"><img src="https://img.shields.io/npm/dm/sv5ui.svg?style=flat-square&colorA=18181b&colorB=ff3e00" alt="downloads" /></a>
</p>

---

## Highlights

- **Svelte 5** — Built with runes, snippets, and the latest reactivity model
- **Tailwind CSS 4** — Utility-first styling with [Tailwind Variants](https://www.tailwind-variants.org/) for type-safe, composable variants
- **Fully Typed** — Strict TypeScript with exported prop types for every component
- **Accessible** — Built on [Bits UI](https://bits-ui.com) and [Vaul Svelte](https://vaul-svelte.com) headless primitives
- **200,000+ Icons** — First-class [Iconify](https://iconify.design) integration
- **Customizable** — Global config system + per-instance slot overrides

## Installation

```bash
npm install sv5ui
# or
pnpm add sv5ui
```

**Peer dependencies:** `svelte >= 5.0.0`, `tailwindcss >= 4.0.0`

## Quick Start

**1. Import the theme**

```css
/* layout.css */
@import 'sv5ui/theme.css';
```

**2. Use components**

```svelte
<script>
    import { Button, Avatar, Badge, Tooltip } from 'sv5ui'
</script>

<Tooltip text="Edit profile">
    <Button variant="soft" color="primary" leadingIcon="lucide:edit">Edit</Button>
</Tooltip>

<Avatar src="/photo.jpg" alt="Jane Doe" size="lg" />
<Badge label="Online" color="success" variant="soft" />
```

## Components

### General

| Component                    | Description                                                                |
| :--------------------------- | :------------------------------------------------------------------------- |
| [**Button**](src/lib/Button) | Versatile button with 6 variants, loading state, icons, and avatar support |
| [**Link**](src/lib/Link)     | Smart anchor with automatic active-state detection based on current route  |
| [**Icon**](src/lib/Icon)     | Iconify wrapper — render any of 200,000+ icons by name                     |
| [**Kbd**](src/lib/Kbd)       | Keyboard shortcut display with OS-aware symbol mapping                     |

### Layout

| Component                          | Description                                                      |
| :--------------------------------- | :--------------------------------------------------------------- |
| [**Card**](src/lib/Card)           | Content container with header, body, and footer slots            |
| [**Container**](src/lib/Container) | Responsive max-width wrapper for page content                    |
| [**Separator**](src/lib/Separator) | Horizontal/vertical divider with optional label, icon, or avatar |

### Data Display

| Component                              | Description                                                            |
| :------------------------------------- | :--------------------------------------------------------------------- |
| [**Avatar**](src/lib/Avatar)           | Profile image with auto-generated initials fallback                    |
| [**AvatarGroup**](src/lib/AvatarGroup) | Stacked avatars with overflow count                                    |
| [**Badge**](src/lib/Badge)             | Status indicators and tags in 4 variants and 8 colors                  |
| [**Chip**](src/lib/Chip)               | Notification dot indicator with configurable positioning               |
| [**User**](src/lib/User)               | User profile display combining avatar, name, and description           |
| [**Timeline**](src/lib/Timeline)       | Step/sequence visualization with completed, active, and pending states |
| [**Skeleton**](src/lib/Skeleton)       | Animated loading placeholder                                           |
| [**Empty**](src/lib/Empty)             | Empty state with icon, description, and action slots                   |

### Feedback

| Component                        | Description                                                          |
| :------------------------------- | :------------------------------------------------------------------- |
| [**Alert**](src/lib/Alert)       | Notification banner with icon, actions, and dismissible support      |
| [**Progress**](src/lib/Progress) | Determinate/indeterminate progress bar with step mode and animations |

### Navigation

| Component                            | Description                                                                    |
| :----------------------------------- | :----------------------------------------------------------------------------- |
| [**Breadcrumb**](src/lib/Breadcrumb) | Hierarchical navigation trail with icons, custom separators, and snippet slots |
| [**Tabs**](src/lib/Tabs)             | Tabbed interface with content panels and configurable orientation              |
| [**Pagination**](src/lib/Pagination) | Page navigation with first/prev/next/last controls and ellipsis                |

### Overlay

| Component                                | Description                                                               |
| :--------------------------------------- | :------------------------------------------------------------------------ |
| [**Modal**](src/lib/Modal)               | Accessible dialog with overlay, focus trap, and scroll lock               |
| [**Slideover**](src/lib/Slideover)       | Side panel sliding from any edge with inset mode                          |
| [**Drawer**](src/lib/Drawer)             | Draggable bottom/side sheet with snap points                              |
| [**Tooltip**](src/lib/Tooltip)           | Hover tooltip with arrow, keyboard shortcut display, and portal rendering |
| [**Popover**](src/lib/Popover)           | Floating interactive content panel with focus management                  |
| [**Accordion**](src/lib/Accordion)       | Expandable sections with single or multiple open modes                    |
| [**DropdownMenu**](src/lib/DropdownMenu) | Triggered floating menu with items, groups, separators, and sub-menus     |
| [**ContextMenu**](src/lib/ContextMenu)   | Right-click context menu with items, colors, and keyboard navigation      |

### Form

| Component                            | Description                                                                                             |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------ |
| [**Input**](src/lib/Input)           | Text input with 5 variants, icons, avatar, loading state, and FormField integration                     |
| [**Textarea**](src/lib/Textarea)     | Multi-line text input with 5 variants, icons, autoresize with maxrows, and FormField integration        |
| [**Select**](src/lib/Select)         | Dropdown select with 5 variants, icons, avatars, groups, descriptions, and FormField support            |
| [**Switch**](src/lib/Switch)         | Toggle switch with 8 colors, 5 sizes, checked/unchecked icons, loading state, and FormField integration |
| [**Checkbox**](src/lib/Checkbox)     | Checkbox with 8 colors, 5 sizes, indeterminate state, custom icons, and FormField integration           |
| [**RadioGroup**](src/lib/RadioGroup) | Radio group for single-selection with items API, legend, orientation, and FormField integration         |
| [**FormField**](src/lib/FormField)   | Form control wrapper providing label, description, hint, help, and error handling                       |
| [**FieldGroup**](src/lib/FieldGroup) | Groups buttons and inputs with seamless borders and shared size/orientation context                     |
| [**Calendar**](src/lib/Calendar)     | Date picker calendar with single, multiple, and range selection modes                                   |

## Theming

SV5UI uses **OKLCH color space** with semantic tokens. Light and dark modes work out of the box.

### Color Tokens

Each color provides a set of related tokens for surfaces, text, and containers:

```
--color-{name}                  Main color
--color-on-{name}               Contrast text on main color
--color-{name}-container        Lighter background variant
--color-on-{name}-container     Text on container background
```

**Available colors:** `primary` · `secondary` · `tertiary` · `success` · `warning` · `error` · `info` · `surface`

### Dark Mode

Supported via `.dark` class on `<html>` or `prefers-color-scheme` media query, managed with [mode-watcher](https://github.com/svecosystem/mode-watcher).

### Custom Colors

Override any token with CSS variables:

```css
:root {
    --color-primary: oklch(0.55 0.25 270);
    --color-secondary: oklch(0.45 0.15 240);
}
```

## Customization

### Per-instance — `ui` prop

Override slot classes directly on any component:

```svelte
<Button ui={{ base: 'rounded-full shadow-lg', label: 'font-bold uppercase' }}>Custom</Button>
```

### Global — `defineConfig`

Set library-wide defaults for variants, slots, and icons:

```typescript
import { defineConfig } from 'sv5ui'

defineConfig({
    button: {
        defaultVariants: { variant: 'outline', size: 'lg' },
        slots: { base: 'shadow-md' }
    },
    avatar: {
        defaultVariants: { size: 'lg' },
        slots: { root: 'ring-2 ring-primary' }
    },
    icons: {
        loading: 'lucide:loader',
        close: 'lucide:x'
    }
})
```

## Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Dev server at localhost:5173
pnpm test             # Run unit tests
pnpm check            # TypeScript check
pnpm prepack          # Build library package
pnpm lint             # Lint
pnpm format           # Format code
```

> Run `pnpm dev` and open [localhost:5173](http://localhost:5173) to browse the interactive component demos.

## Tech Stack

| Layer      | Technology                                                                                          |
| :--------- | :-------------------------------------------------------------------------------------------------- |
| Framework  | [Svelte 5](https://svelte.dev) + [SvelteKit](https://svelte.dev/docs/kit)                           |
| Styling    | [Tailwind CSS 4](https://tailwindcss.com) + [Tailwind Variants](https://www.tailwind-variants.org/) |
| Primitives | [Bits UI](https://bits-ui.com) · [Vaul Svelte](https://vaul-svelte.com)                             |
| Icons      | [Iconify](https://iconify.design) (200,000+ icons)                                                  |
| Testing    | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev)                                 |

## License

[MIT](LICENSE) &copy; [ndlabdev](https://github.com/ndlabdev)
