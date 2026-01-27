import type { Snippet } from 'svelte'
import type { Button } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { ButtonVariantProps, ButtonSlots } from './button.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'

export type ButtonProps = Button.RootProps & {
    /**
     * Controls the visual style of the button.
     * @default 'solid'
     */
    variant?: NonNullable<ButtonVariantProps['variant']>

    /**
     * Sets the color scheme applied to the button.
     * @default 'primary'
     */
    color?: NonNullable<ButtonVariantProps['color']>

    /**
     * Controls the dimensions and text size of the button.
     * @default 'md'
     */
    size?: NonNullable<ButtonVariantProps['size']>

    /**
     * Text content displayed inside the button.
     * Use this as a shorthand instead of the `children` snippet.
     */
    label?: string

    /**
     * Renders a loading spinner and disables interaction.
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
     * Stretches the button to fill the full width of its container.
     * @default false
     */
    block?: boolean

    /**
     * Forces equal width and height, ideal for icon-only buttons.
     * @default false
     */
    square?: boolean

    /**
     * Truncates overflowing text with an ellipsis.
     * @default false
     */
    truncate?: boolean

    /**
     * Renders the button in icon-only mode without a label.
     * Supports any valid Iconify icon name.
     */
    icon?: string

    /**
     * Icon placed before the label.
     * Supports any valid Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Icon placed after the label.
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
     * Avatar displayed before the label.
     * Takes precedence over `leadingIcon`.
     */
    avatar?: AvatarProps

    /**
     * Custom content rendered before the label.
     * Takes precedence over `avatar` and `leadingIcon`.
     */
    leadingSlot?: Snippet

    /**
     * Custom content rendered after the label.
     * Takes precedence over `trailingIcon`.
     */
    trailingSlot?: Snippet

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific button slots.
     */
    ui?: Partial<Record<ButtonSlots, ClassNameValue>>
}
