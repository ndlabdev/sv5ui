import type { HTMLAnchorAttributes } from 'svelte/elements'
import type { LinkVariantProps, LinkSlots } from './link.variants.js'
import type { ClassNameValue } from 'tailwind-merge'

export type LinkProps = Omit<HTMLAnchorAttributes, 'class' | 'href'> & {
    /**
     * The destination URL for the anchor element.
     */
    href: string

    /**
     * Sets the color scheme applied to the link.
     * @default 'primary'
     */
    color?: NonNullable<LinkVariantProps['color']>

    /**
     * Overrides the auto-detected active state.
     * When omitted, the active state is inferred from the current route.
     */
    active?: boolean

    /**
     * Requires an exact pathname match for active state detection.
     * @default false
     */
    exact?: boolean

    /**
     * Controls query parameter matching for active state detection.
     * - `true` — requires an exact match of all query parameters.
     * - `'partial'` — link's query params must be a subset of the current route.
     * - `false` — query parameters are ignored.
     * @default false
     */
    exactQuery?: boolean | 'partial'

    /**
     * Requires an exact hash match for active state detection.
     * @default false
     */
    exactHash?: boolean

    /**
     * Additional CSS class applied when the link is active.
     */
    activeClass?: string

    /**
     * Additional CSS class applied when the link is inactive.
     */
    inactiveClass?: string

    /**
     * Disables the link and prevents navigation.
     * @default false
     */
    disabled?: boolean

    /**
     * Strips all default styling, applying only `class`, `activeClass`, and `inactiveClass`.
     * @default false
     */
    raw?: boolean

    /**
     * Treats the link as external, adding `rel="noopener noreferrer"` and `target="_blank"`.
     * Auto-detected from the `href` when omitted.
     */
    external?: boolean

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific link slots.
     */
    ui?: Partial<Record<LinkSlots, ClassNameValue>>
}
