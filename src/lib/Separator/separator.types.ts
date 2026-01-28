import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { Separator } from 'bits-ui'
import type { SeparatorVariantProps, SeparatorSlots } from './separator.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'

export type SeparatorProps = Separator.RootProps & {
    /**
     * Sets the color scheme applied to the separator.
     * @default 'surface'
     */
    color?: NonNullable<SeparatorVariantProps['color']>

    /**
     * Controls the thickness of the separator line.
     * @default 'xs'
     */
    size?: NonNullable<SeparatorVariantProps['size']>

    /**
     * Controls the border style of the separator.
     * @default 'solid'
     */
    type?: NonNullable<SeparatorVariantProps['type']>

    /**
     * Text content displayed in the center of the separator.
     */
    label?: string

    /**
     * Icon displayed in the center of the separator.
     * Supports any valid Iconify icon name.
     */
    icon?: string

    /**
     * Avatar displayed in the center of the separator.
     */
    avatar?: AvatarProps

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific separator slots.
     */
    ui?: Partial<Record<SeparatorSlots, ClassNameValue>>

    /**
     * Custom content rendered in the center of the separator.
     * Takes precedence over label, icon, and avatar.
     */
    content?: Snippet
}
