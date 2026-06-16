<p align="center">
  <img src="https://img.shields.io/badge/SV5UI-ff3e00?style=for-the-badge&logo=svelte&logoColor=white" alt="SV5UI" />
</p>

<h1 align="center">SV5UI</h1>

<p align="center">
  <strong>The modern UI component library for Svelte 5.</strong><br/>
  Accessible components and reactive hooks, styled with Tailwind CSS 4 and fully typed.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/sv5ui"><img src="https://img.shields.io/npm/v/sv5ui?style=flat-square&colorA=18181b&colorB=ff3e00" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/sv5ui"><img src="https://img.shields.io/npm/dm/sv5ui?style=flat-square&colorA=18181b&colorB=ff3e00" alt="npm downloads" /></a>
  <a href="https://github.com/ndlabdev/sv5ui/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/sv5ui?style=flat-square&colorA=18181b&colorB=ff3e00" alt="license" /></a>
</p>

<p align="center">
  <a href="https://sv5ui.vercel.app"><strong>Live Demo &amp; Docs</strong></a> &middot;
  <a href="https://github.com/ndlabdev/sv5ui/blob/main/CHANGELOG.md"><strong>Changelog</strong></a>
</p>

---

**SV5UI** is a batteries-included component library built natively for **Svelte 5 runes**. It pairs accessible primitives from [Bits UI](https://bits-ui.com) with a [Tailwind CSS 4](https://tailwindcss.com) styling layer you can theme down to a single token — so you ship polished, accessible UI without rebuilding buttons, modals, and forms for the hundredth time.

```svelte
<script>
    import { Button, Avatar, toast } from 'sv5ui'
</script>

<Button variant="soft" color="primary" leadingIcon="lucide:edit">Edit</Button>
<Avatar src="/photo.jpg" alt="Jane" size="lg" />
<Button onclick={() => toast.success('Saved!')}>Save</Button>
```

## Why SV5UI?

- **Native Svelte 5** — Built on runes and snippets from the ground up, not ported from an older API. Reactivity is first-class, not retrofitted.
- **Accessible by default** — Overlays, menus, and form controls are built on [Bits UI](https://bits-ui.com) and [Vaul Svelte](https://vaul-svelte.com), so focus management, keyboard navigation, and WAI-ARIA semantics come for free.
- **Thoroughly tested** — Every component is covered by an extensive unit and real-browser test suite (Vitest + Playwright), including accessibility and memory-leak regressions.
- **Themeable to the core** — [OKLCH](https://oklch.com) color tokens, automatic light/dark mode, and three layers of customization (per-instance → global config → CSS variables).
- **Truly typed** — Strict TypeScript with exported prop types for every component; a `publint`-clean ESM package with proper `types` and `svelte` export conditions.
- **Tree-shakeable** — Pure ESM with side effects limited to CSS, so you only ship the components you import.
- **Bring your own validation** — `Form` speaks [Standard Schema](https://standardschema.dev), so it works out of the box with Zod, Valibot, Yup, or Joi.
- **Icons included** — Reference any [Iconify](https://iconify.design) icon by name, with no per-icon imports: `leadingIcon="lucide:edit"`.

## Quick Start

**1. Install**

```bash
npm install sv5ui
# pnpm add sv5ui · yarn add sv5ui · bun add sv5ui
```

> **Peer dependencies:** `svelte@^5`, `tailwindcss@^4`, and `mode-watcher@^1`. The rich-text `Editor` and `Form` validators (TipTap, Zod/Valibot/Yup/Joi) are **optional** peers — install only what you use.

**2. Import the theme**

```css
/* app.css */
@import 'sv5ui/theme.css';
```

**3. Enable dark mode** (one-time, in your root layout)

```svelte
<script>
    import { ModeWatcher } from 'mode-watcher'
</script>

<ModeWatcher />
```

**4. Use components**

```svelte
<script>
    import { Card, Button } from 'sv5ui'
</script>

<Card>
    <p>Welcome back 👋</p>
    <Button color="primary" leadingIcon="lucide:log-in">Sign in</Button>
</Card>
```

That's it — no provider to wrap, no config file required.

## Components

SV5UI covers the surface area of a real application — forms and inputs, overlays and menus, navigation, data display, and feedback — including richer pieces many libraries leave out, like a TipTap-powered rich-text **Editor**, a data **Table**, a **Command** palette, and a **Calendar**.

Every component is fully typed, theme-aware, and exposes a consistent `variant` / `color` / `size` / `ui` API. Browse the complete, always-current catalog with live examples and prop tables in the **[live demo](https://sv5ui.vercel.app)**.

## Hooks

Beyond components, SV5UI exports a set of reactive hooks — built on the same runes and actions it uses internally — for everyday UI needs such as media queries, clipboard access, debouncing, focus trapping, and scroll locking.

```svelte
<script>
    import { useMediaQuery, useClipboard } from 'sv5ui'

    const isMobile = useMediaQuery('(max-width: 640px)')
    const clipboard = useClipboard()
</script>

{#if isMobile.matches}<MobileNav />{/if}

<Button onclick={() => clipboard.copy('Hello!')}>
    {clipboard.copied ? 'Copied!' : 'Copy'}
</Button>
```

## Customization

SV5UI gives you three layers of control, from a single instance up to your whole design system.

**1. Per-instance** — override any slot with the `ui` prop or `class`:

```svelte
<Button ui={{ base: 'rounded-full shadow-lg' }}>Pill button</Button>
```

**2. Global defaults** — set library-wide variants and icons once:

```ts
import { defineConfig } from 'sv5ui'

defineConfig({
    button: { defaultVariants: { variant: 'outline' } },
    icons: { loading: 'lucide:loader-circle' }
})
```

**3. Design tokens** — re-skin everything with CSS variables (OKLCH):

```css
:root {
    --color-primary: oklch(0.55 0.25 270);
    --radius-lg: 0.75rem;
}
```

## Form validation

`Form` validates with any [Standard Schema](https://standardschema.dev) library — no adapter, no wrapper:

```svelte
<script>
    import { Form, FormField, Input, Button } from 'sv5ui'
    import { z } from 'zod'

    const schema = z.object({
        email: z.string().email(),
        password: z.string().min(8)
    })
</script>

<Form {schema} onsubmit={({ data }) => console.log(data)}>
    <FormField name="email" label="Email"><Input /></FormField>
    <FormField name="password" label="Password"><Input type="password" /></FormField>
    <Button type="submit">Sign in</Button>
</Form>
```

Swap `zod` for `valibot`, `yup`, or `joi` — the API is identical.

## Requirements

| Peer                              | Version  | Required                   |
| --------------------------------- | -------- | -------------------------- |
| `svelte`                          | `^5.0.0` | Yes                        |
| `tailwindcss`                     | `^4.0.0` | Yes                        |
| `mode-watcher`                    | `^1.0.0` | Yes (dark mode)            |
| `zod` / `valibot` / `yup` / `joi` | —        | Optional (form validation) |
| `@tiptap/*`, `tiptap-markdown`    | `^3.0.0` | Optional (`Editor`)        |

## Contributing

Issues and pull requests are welcome. To run the project locally:

```bash
git clone https://github.com/ndlabdev/sv5ui.git
cd sv5ui
npm install
npm run dev        # docs site at localhost:5173
npm test           # vitest (unit + browser)
npm run check      # svelte-check
npm run lint       # prettier + eslint
```

## License

[MIT](LICENSE) &copy; [ndlabdev](https://github.com/ndlabdev)
