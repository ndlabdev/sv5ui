import type { Snippet } from 'svelte'
import type { HTMLAttributes, HTMLAnchorAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { BannerVariantProps, BannerSlots } from './banner.variants.js'
import type { ButtonProps } from '../Button/button.types.js'

/**
 * Props for the Banner component.
 *
 * A full-width announcement bar typically rendered at the top of a page or
 * layout. Supports optional `localStorage` persistence — once dismissed by a
 * given `id`, the banner stays hidden across reloads.
 *
 * **Hydration note:** When a banner has been previously dismissed via `id`,
 * users will see a one-frame flicker on initial render (server renders the
 * banner, then `$effect` reads `localStorage` and hides it). Eliminating the
 * flicker requires a SvelteKit prehydration script the consumer injects
 * themselves — see the demo page for a recipe.
 *
 * @example
 * ```svelte
 * <Banner
 *   id="announce-2026-q2"
 *   icon="lucide:megaphone"
 *   title="New features available — check the changelog!"
 *   color="primary"
 *   close
 *   to="/changelog"
 * />
 * ```
 */
export interface BannerProps extends Omit<HTMLAttributes<HTMLElement>, 'class' | 'title' | 'id'> {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The HTML element to render as the root.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Unique identifier used as the localStorage persistence key. When set,
     * clicking the close button writes `sv5ui-banner-{id}` to localStorage
     * and the banner remains hidden on subsequent loads.
     *
     * Without an explicit `id`, a stable per-instance id is generated via
     * `useId()` (used for the `data-banner-id` DOM attribute), but **dismissal
     * is session-only** — no localStorage interaction happens. Pass an
     * explicit `id` to opt into cross-reload persistence.
     *
     * Allowed characters in the storage key: alphanumeric, underscore, dash.
     * Other characters are replaced with `-`.
     */
    id?: string

    /**
     * Banner text content.
     */
    title?: string

    /**
     * Iconify icon name rendered before the title.
     */
    icon?: string

    /**
     * Color theme. Applies background + foreground tokens.
     * @default 'primary'
     */
    color?: NonNullable<BannerVariantProps['color']>

    /**
     * When provided, the entire banner becomes a clickable link via an
     * absolute-positioned overlay anchor. The `as` element stays unchanged
     * (so close/action buttons inside aren't nested in an `<a>` — valid HTML).
     * Pair with `target` for new-tab links.
     */
    to?: string

    /**
     * Anchor `target` (e.g. `'_blank'`). Only honored when `to` is set.
     */
    target?: HTMLAnchorAttributes['target']

    /**
     * Show close button. Pass `true` for default styling or a `ButtonProps`
     * object to customize. When `id` is also set, dismissal persists across
     * reloads via localStorage.
     * @default false
     */
    close?: boolean | ButtonProps

    /**
     * Override the close button icon.
     * @default 'lucide:x' (from global icons config)
     */
    closeIcon?: string

    /**
     * Action buttons rendered inline after the title. Each entry is spread
     * onto a `<Button>` and accepts the full `ButtonProps` shape. Banner
     * applies `size="xs" color="surface"` as the default — override any prop
     * (variant, color, icon, to, etc.) per item.
     *
     * @example
     * ```svelte
     * <Banner
     *   title="Update available"
     *   actions={[
     *     { label: 'Learn more', variant: 'outline' },
     *     { label: 'Update now', trailingIcon: 'lucide:arrow-right' }
     *   ]}
     * />
     * ```
     */
    actions?: ButtonProps[]

    /**
     * Bindable visibility. Set to `false` to hide externally without
     * persisting (e.g. for analytics-driven banners). When the user clicks
     * the close button, this is set to `false` automatically.
     * @default true
     */
    open?: boolean

    /**
     * Fired when the close button is clicked, before any localStorage
     * write. Cannot prevent dismissal — use `open` binding if you need
     * conditional dismissal.
     */
    onClose?: () => void

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override classes for component slots.
     */
    ui?: Partial<Record<BannerSlots, ClassNameValue>>

    /**
     * Custom leading content. Replaces the default `icon` rendering.
     */
    leading?: Snippet

    /**
     * Custom title content. Replaces the default `title` text.
     */
    titleSlot?: Snippet

    /**
     * Custom actions content. Replaces the default `actions` array rendering.
     */
    actionsSlot?: Snippet

    /**
     * Custom close button content. When provided, the consumer is
     * responsible for wiring up the dismiss action (typically by binding
     * `open` externally).
     */
    closeSlot?: Snippet
}
