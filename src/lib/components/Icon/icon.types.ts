import type { IconProps as IconifyProps } from '@iconify/svelte'
import type { SVGAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'

/**
 * A single icon inside a bundled collection.
 * Mirrors Iconify's `IconifyIcon`, narrowed to the fields the generator emits.
 * `width`/`height` are omitted when they match the collection defaults.
 */
export interface BundledIcon {
    body: string
    width?: number
    height?: number
    left?: number
    top?: number
    rotate?: number
    hFlip?: boolean
    vFlip?: boolean
}

/**
 * An icon collection pre-registered with Iconify at module load, so the icons in
 * `iconsDefaults` render synchronously during SSR instead of being fetched from
 * the Iconify API after hydration.
 *
 * Generated into `bundled.ts` by `npm run generate:icons`.
 */
export interface BundledIconCollection {
    prefix: string
    width: number
    height: number
    icons: Record<string, BundledIcon>
}

export interface IconProps
    extends
        Omit<IconifyProps, 'icon' | 'width' | 'height' | 'rotate' | 'flip' | 'class'>,
        Pick<
            SVGAttributes<SVGSVGElement>,
            | 'role'
            | 'tabindex'
            | 'aria-label'
            | 'aria-labelledby'
            | 'aria-describedby'
            | 'aria-hidden'
            | 'onclick'
            | 'onkeydown'
            | 'onmouseenter'
            | 'onmouseleave'
            | 'onfocus'
            | 'onblur'
        > {
    /** Custom data attributes are forwarded to the rendered `<svg>`. */
    [key: `data-${string}`]: string | number | boolean | null | undefined
    /**
     * Icon name in Iconify format: "collection:icon-name"
     * @example "lucide:home", "mdi:account", "heroicons:star"
     * @see https://icon-sets.iconify.design/
     */
    name: string

    /**
     * Icon size (applied to both width and height).
     * Accepts a number (pixels) or CSS string value.
     * @default 24
     * @example 24, "1.5rem", "20px"
     */
    size?: number | string

    /**
     * Icon color (CSS color value).
     * Defaults to `currentColor`, inheriting the parent's text color.
     * Use Tailwind `text-*` classes on the parent or via `class` prop as an alternative.
     * @default "currentColor"
     * @example "red", "#ff0000", "rgb(255, 0, 0)"
     */
    color?: string

    /**
     * Flip icon horizontally.
     * @default false
     */
    flipH?: boolean

    /**
     * Flip icon vertically.
     * @default false
     */
    flipV?: boolean

    /**
     * Rotate icon by specified degrees (quarter turns only).
     * For arbitrary rotation, use a CSS class like `rotate-45`.
     * @default 0
     */
    rotate?: 0 | 90 | 180 | 270

    /**
     * Additional CSS classes for the icon.
     * Merged with `shrink-0` via tailwind-merge, so conflicting utilities are resolved correctly.
     */
    class?: ClassNameValue
}
