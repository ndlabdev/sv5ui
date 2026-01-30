# SV5UI

A modern, fully-typed Svelte 5 UI component library built with Tailwind CSS 4.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![npm version](https://img.shields.io/npm/v/sv5ui.svg)](https://www.npmjs.com/package/sv5ui)

## Features

- **Svelte 5** - Built with runes, snippets, and the latest Svelte 5 features
- **Tailwind CSS 4** - Utility-first styling with [Tailwind Variants](https://www.tailwind-variants.org/) for type-safe composable variants
- **OKLCH Colors** - Semantic color tokens with light/dark mode support
- **Fully Typed** - Complete TypeScript support with strict mode
- **Accessible** - Built on [Bits UI](https://bits-ui.com) headless primitives
- **Customizable** - Global config system to override default variants and slot styles

## Installation

```bash
npm install sv5ui
```

Peer dependencies: `svelte >= 5.0.0`, `tailwindcss >= 4.0.0`

## Quick Start

```css
/* layout.css */
@import 'sv5ui/theme.css';
@source "../../node_modules/sv5ui/dist";
```

```svelte
<script>
  import { Button, Alert, Avatar, Badge } from 'sv5ui'
</script>

<Button variant="solid" color="primary">Click me</Button>
<Alert title="Heads up!" description="Something happened." color="info" variant="soft" />
<Avatar src="/photo.jpg" alt="John Doe" size="lg" />
<Badge label="New" color="success" />
```

## Components

| Component | Description |
|-----------|-------------|
| **Alert** | Notification banners with actions and close support |
| **Avatar** | User avatar with image fallback and auto-generated initials |
| **AvatarGroup** | Grouped avatars with overflow count |
| **Badge** | Status indicators and tags |
| **Button** | Interactive button with loading, icon, and block modes |
| **Card** | Content container with header/body/footer slots |
| **Chip** | Compact notification indicators with positioning |
| **Container** | Responsive layout wrapper with max-width constraints |
| **Icon** | Iconify wrapper with 200,000+ icons |
| **Kbd** | Keyboard key display with automatic symbol mapping |
| **Link** | Smart navigation with active state detection |
| **Progress** | Determinate/indeterminate progress bars with step mode |
| **Separator** | Dividers with optional label, icon, or avatar content |
| **Timeline** | Sequence/step visualization with states |

> Browse the interactive docs by running `pnpm dev` and opening [localhost:5173](http://localhost:5173).

## Theming

SV5UI uses OKLCH color space with semantic tokens. Light and dark modes work automatically.

**Available color tokens:** `primary`, `secondary`, `tertiary`, `success`, `warning`, `error`, `info`, `surface`

**Dark mode** via `.dark` class or `prefers-color-scheme`, managed through [mode-watcher](https://github.com/svecosystem/mode-watcher).

**Custom colors** by overriding CSS variables:

```css
:root {
  --color-primary: oklch(0.55 0.25 270);
  --color-secondary: oklch(0.45 0.15 240);
}
```

## Customization

### Per-instance overrides

Override slot styles on any component via the `ui` prop:

```svelte
<Button ui={{ base: 'rounded-full', label: 'font-bold uppercase' }}>
  Custom
</Button>
```

### Global defaults

Use `defineConfig` to set library-wide defaults:

```typescript
import { defineConfig } from 'sv5ui'

defineConfig({
  button: {
    defaultVariants: { variant: 'outline', size: 'lg' },
    slots: { base: 'shadow-md' }
  },
  icons: { loading: 'svg-spinners:ring-resize' }
})
```

## Development

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server
pnpm test         # Run tests
pnpm check        # Type check
pnpm prepack      # Build library
pnpm lint         # Lint
pnpm format       # Format
```

## License

[MIT](LICENSE)
