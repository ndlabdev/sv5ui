import type { Snippet } from 'svelte'
import type { HTMLButtonAttributes } from 'svelte/elements'
import type { ButtonVariantProps } from './button.variants.js'

export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>
export type ButtonColor = NonNullable<ButtonVariantProps['color']>
export type ButtonSize = NonNullable<ButtonVariantProps['size']>

export interface ButtonProps extends Omit<HTMLButtonAttributes, 'color'> {
    /**
     * Visual variant of the button
     * @default 'solid'
     */
    variant?: ButtonVariant

    /**
     * Semantic color
     * @default 'primary'
     */
    color?: ButtonColor

    /**
     * Button size
     * @default 'md'
     */
    size?: ButtonSize

    /**
     * Whether the button is disabled
     * @default false
     */
    disabled?: boolean

    /**
     * Whether the button is in loading state
     * @default false
     */
    loading?: boolean

    /**
     * Icon name (Iconify format) to show before the label
     * @example "lucide:plus"
     */
    iconLeading?: string

    /**
     * Icon name (Iconify format) to show after the label
     * @example "lucide:arrow-right"
     */
    iconTrailing?: string

    /**
     * Make button full width
     * @default false
     */
    fullWidth?: boolean

    /**
     * Button content
     */
    children?: Snippet

    /** Additional CSS classes */
    class?: string
}
