import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ButtonVariantProps, ButtonSlots } from './button.variants.js'
import type { AvatarProps } from '../Avatar/avatar.types.js'

export type ButtonProps = Omit<HTMLAttributes<HTMLElement>, 'class' | 'color'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

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
     * Automatically shows loading state while the onclick handler's Promise is pending.
     * @default false
     */
    loadingAuto?: boolean

    /**
     * Icon displayed as the loading indicator.
     * Supports any valid Iconify icon name.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Disables the button and prevents interaction.
     * @default false
     */
    disabled?: boolean

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

    // ==================== LINK PROPS ====================

    /**
     * The destination URL. When provided, renders as an anchor element.
     */
    href?: string

    /**
     * The button type attribute. Only applies when rendering as `<button>`.
     * @default 'button'
     */
    type?: 'button' | 'submit' | 'reset'

    /**
     * Treats the link as external, adding `rel="noopener noreferrer"` and `target="_blank"`.
     * Auto-detected from the `href` when omitted.
     */
    external?: boolean

    /**
     * Overrides the auto-detected active state.
     */
    active?: boolean

    /**
     * Requires an exact pathname match for active state detection.
     * @default false
     */
    exact?: boolean

    /**
     * Color scheme applied when the button is active.
     * Falls back to the `color` prop when omitted.
     */
    activeColor?: NonNullable<ButtonVariantProps['color']>

    /**
     * Visual style applied when the button is active.
     * Falls back to the `variant` prop when omitted.
     */
    activeVariant?: NonNullable<ButtonVariantProps['variant']>

    /**
     * Additional CSS class applied when the button link is active.
     */
    activeClass?: string

    /**
     * Additional CSS class applied when the button link is inactive.
     */
    inactiveClass?: string

    // ==================== SLOTS & STYLING ====================

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
     * Custom content for the button label area.
     */
    children?: Snippet

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific button slots.
     */
    ui?: Partial<Record<ButtonSlots, ClassNameValue>>
}
