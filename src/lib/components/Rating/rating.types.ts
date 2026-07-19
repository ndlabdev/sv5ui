import type { RatingGroup as RatingGroupPrimitive } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { RatingVariantProps, RatingSlots } from './rating.variants.js'

export type RatingProps = Omit<
    RatingGroupPrimitive.RootProps,
    'child' | 'children' | 'class' | 'ref' | 'value' | 'onValueChange' | 'orientation'
> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The current rating value. Supports two-way binding with `bind:value`.
     * @default 0
     */
    value?: number

    /**
     * Callback when the rating value changes.
     */
    onValueChange?: (value: number) => void

    /**
     * Sets the color applied to active (filled) icons.
     * @default 'primary'
     */
    color?: NonNullable<RatingVariantProps['color']>

    /**
     * Controls the icon dimensions.
     * @default 'md'
     */
    size?: NonNullable<RatingVariantProps['size']>

    /**
     * Controls the layout and keyboard interaction direction.
     * @default 'horizontal'
     */
    orientation?: NonNullable<RatingVariantProps['orientation']>

    /**
     * Icon rendered for each rating item.
     * Supports any valid Iconify icon name.
     * @default Uses `icons.star` from app config
     */
    icon?: string

    /**
     * Icon rendered for active items and the filled half of partial items.
     * Use this to supply a genuinely filled icon variant instead of the
     * CSS auto-fill applied by `fill`.
     * @default Same as `icon`
     */
    activeIcon?: string

    /**
     * Fills the active icon paths with the current color via CSS.
     * Set to false to keep active icons outline-only (color change only),
     * or when `activeIcon` already provides its own fill.
     * @default true
     */
    fill?: boolean

    /**
     * The HTML id attribute for the rating group.
     */
    id?: string

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific rating slots.
     */
    ui?: Partial<Record<RatingSlots, ClassNameValue>>
}
