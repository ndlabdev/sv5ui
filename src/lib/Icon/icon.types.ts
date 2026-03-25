import type { IconProps as IconifyProps } from '@iconify/svelte'
import type { ClassNameValue } from 'tailwind-merge'

export interface IconProps extends Omit<
    IconifyProps,
    'icon' | 'width' | 'height' | 'rotate' | 'flip' | 'class'
> {
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
