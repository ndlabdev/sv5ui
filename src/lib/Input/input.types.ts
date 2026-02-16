import type { Snippet } from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { InputVariantProps, InputSlots } from './input.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'

export type InputProps = Omit<HTMLInputAttributes, 'class' | 'size'> & {
    /**
     * Bind a reference to the underlying HTMLInputElement.
     */
    ref?: HTMLInputElement | null

    /**
     * The current value of the input. Supports two-way binding with `bind:value`.
     */
    value?: string

    /**
     * Controls the visual style of the input.
     * @default 'outline'
     */
    variant?: NonNullable<InputVariantProps['variant']>

    /**
     * Sets the color scheme for focus ring and highlight.
     * @default 'primary'
     */
    color?: NonNullable<InputVariantProps['color']>

    /**
     * Controls the dimensions and text size of the input.
     * @default 'md'
     */
    size?: NonNullable<InputVariantProps['size']>

    /**
     * Emphasizes ring color like focus state, even when not focused.
     * Automatically enabled when used inside a FormField with an error.
     * @default false
     */
    highlight?: boolean

    /**
     * Renders a loading spinner and optionally disables interaction.
     * @default false
     */
    loading?: boolean

    /**
     * Icon displayed as the loading indicator.
     * Supports any valid Iconify icon name.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Icon displayed on the leading or trailing side.
     * Position controlled by the `trailing` prop.
     * Supports any valid Iconify icon name.
     */
    icon?: string

    /**
     * Icon placed before the input value.
     * Supports any valid Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Icon placed after the input value.
     * Supports any valid Iconify icon name.
     */
    trailingIcon?: string

    /**
     * Moves the icon to the trailing (right) side.
     * Only takes effect when using the `icon` prop.
     * @default false
     */
    trailing?: boolean

    /**
     * Avatar displayed before the input value.
     * Takes precedence over `leadingIcon`.
     */
    avatar?: AvatarProps

    /**
     * Custom content rendered before the input.
     * Takes precedence over `avatar` and `leadingIcon`.
     */
    leadingSlot?: Snippet

    /**
     * Custom content rendered after the input.
     * Takes precedence over `trailingIcon`.
     */
    trailingSlot?: Snippet

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific input slots.
     */
    ui?: Partial<Record<InputSlots, ClassNameValue>>
}
