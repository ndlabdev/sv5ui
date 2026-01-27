import type { Snippet } from 'svelte'
import type { Button } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { ButtonVariantProps, ButtonSlots } from './button.variants.js'

export type ButtonProps = Button.RootProps & {
    /**
     * Visual variant of the button
     * @default 'solid'
     */
    variant?: NonNullable<ButtonVariantProps['variant']>

    /**
     * Semantic color
     * @default 'primary'
     */
    color?: NonNullable<ButtonVariantProps['color']>

    /**
     * Button size
     * @default 'md'
     */
    size?: NonNullable<ButtonVariantProps['size']>

    /**
     * Text label to display inside the button.
     * Alternative to using children slot.
     */
    label?: string

    /**
     * Whether the button is in a loading state.
     * When true, displays a loading spinner and disables interaction.
     * @default false
     */
    loading?: boolean

    /**
     * The icon to display when loading.
     * Accepts any Iconify icon name.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Whether the button should take full width of its container.
     * @default false
     */
    block?: boolean

    /**
     * Whether the button should have equal width and height.
     * Useful for icon-only buttons.
     * @default false
     */
    square?: boolean

    /**
     * Whether to truncate text with ellipsis when it overflows.
     * @default false
     */
    truncate?: boolean

    /**
     * Icon to display in icon-only mode.
     * When set, the button renders only this icon without label.
     * Accepts any Iconify icon name.
     */
    icon?: string

    /**
     * Icon to display before the label/children.
     * Accepts any Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Icon to display after the label/children.
     * Accepts any Iconify icon name.
     */
    trailingIcon?: string

    /**
     * When true, the icon will be displayed on the trailing (right) side.
     * Only applies when using the `icon` prop.
     * @default false
     */
    trailing?: boolean

    /**
     * Custom content to render before the label.
     * Takes precedence over avatar and leadingIcon.
     */
    leadingSlot?: Snippet

    /**
     * Custom content to render after the label.
     * Takes precedence over trailingIcon.
     */
    trailingSlot?: Snippet

    /**
     * Additional CSS classes to apply to the button.
     */
    class?: ClassNameValue

    /**
     * Fine-grained class overrides for button parts
     */
    ui?: Partial<Record<ButtonSlots, ClassNameValue>>
}
