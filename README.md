<p align="center">
  <img src="https://img.shields.io/badge/SV5UI-ff3e00?style=for-the-badge&logo=svelte&logoColor=white" alt="SV5UI" />
</p>

<h1 align="center">SV5UI</h1>

<p align="center">
  <strong>Modern UI component library for Svelte 5</strong><br/>
  Tailwind CSS 4 &middot; OKLCH Color Tokens &middot; Fully Typed &middot; 50+ Components &middot; 7 Hooks
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sv5ui"><img src="https://img.shields.io/npm/v/sv5ui?style=flat-square&colorA=18181b&colorB=ff3e00" alt="npm" /></a>
  <a href="https://www.npmjs.com/package/sv5ui"><img src="https://img.shields.io/npm/dm/sv5ui?style=flat-square&colorA=18181b&colorB=ff3e00" alt="downloads" /></a>
  <a href="https://github.com/ndlabdev/sv5ui/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/sv5ui?style=flat-square&colorA=18181b&colorB=ff3e00" alt="license" /></a>
</p>

<p align="center">
  <a href="https://sv5ui.vercel.app"><strong>Live Demo</strong></a> &middot;
  <a href="https://sv5ui.vercel.app/getting-started"><strong>Getting Started</strong></a> &middot;
  <a href="https://github.com/ndlabdev/sv5ui/blob/main/CHANGELOG.md"><strong>Changelog</strong></a>
</p>

---

## Install

```bash
npm install sv5ui
# pnpm add sv5ui
# yarn add sv5ui
# bun add sv5ui
```

```css
/* layout.css */
@import 'sv5ui/theme.css';
```

```svelte
<script>
    import { Button, Avatar, toast } from 'sv5ui'
</script>

<Button variant="soft" color="primary" leadingIcon="lucide:edit">Edit</Button>
<Avatar src="/photo.jpg" alt="Jane" size="lg" />
```

## Features

- **Svelte 5** — Runes, snippets, latest reactivity
- **Tailwind CSS 4** — Utility-first with [Tailwind Variants](https://www.tailwind-variants.org/)
- **Fully Typed** — Strict TypeScript, exported prop types
- **Accessible** — Built on [Bits UI](https://bits-ui.com) & [Vaul Svelte](https://vaul-svelte.com)
- **200,000+ Icons** — [Iconify](https://iconify.design) integration
- **Themeable** — OKLCH color tokens, light/dark mode, global config
- **Hooks** — 7 reactive hooks for common UI patterns

## Hooks

Reactive hooks built on Svelte 5 runes and actions.

```svelte
<script>
    import { useMediaQuery, useClipboard, useDebounce } from 'sv5ui'

    const isMobile = useMediaQuery('(max-width: 640px)')
    const clipboard = useClipboard()
    const debounce = useDebounce({ delay: 500 })
</script>

{#if isMobile.matches}
    <MobileLayout />
{/if}

<Button onclick={() => clipboard.copy('Hello!')}>
    {clipboard.copied ? 'Copied!' : 'Copy'}
</Button>
```

| Hook                | Type           | Description                                    |
| ------------------- | -------------- | ---------------------------------------------- |
| `useMediaQuery`     | Runes          | Reactive CSS media query tracking              |
| `useClipboard`      | Runes          | Copy text with auto-reset state                |
| `useFormField`      | Context        | Access FormField context from child components |
| `useDebounce`       | Runes          | Debounce with pending, cancel, flush           |
| `useClickOutside`   | Action         | Detect clicks outside an element               |
| `useInfiniteScroll` | Runes + Action | Auto-load on scroll with loading state         |
| `useEscapeKeydown`  | Action         | Listen for Escape key                          |

## Customization

```svelte
<!-- Per-instance -->
<Button ui={{ base: 'rounded-full shadow-lg' }}>Custom</Button>
```

```ts
// Global defaults
import { defineConfig } from 'sv5ui'

defineConfig({
    button: { defaultVariants: { variant: 'outline' } },
    icons: { loading: 'lucide:loader' }
})
```

```css
/* Custom colors */
:root {
    --color-primary: oklch(0.55 0.25 270);
}
```

## License

[MIT](LICENSE) &copy; [ndlabdev](https://github.com/ndlabdev)
