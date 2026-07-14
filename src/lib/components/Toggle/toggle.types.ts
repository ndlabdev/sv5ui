import type { Snippet } from 'svelte'
import type { Toggle as TogglePrimitive } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { ToggleVariantProps, ToggleSlots } from './toggle.variants.js'

export type ToggleProps = Omit<
    TogglePrimitive.RootProps,
    'child' | 'children' | 'class' | 'ref' | 'pressed' | 'onPressedChange' | 'disabled' | 'value'
> & {
    /**
     * Bindable reference to the underlying button element.
     */
    ref?: HTMLElement | null

    /**
     * The pressed state of the toggle. Supports two-way binding with `bind:pressed`.
     * @default false
     */
    pressed?: boolean

    /**
     * Callback when the pressed state changes.
     */
    onPressedChange?: (pressed: boolean) => void

    /**
     * Controls the visual style of the toggle.
     * @default 'ghost'
     */
    variant?: NonNullable<ToggleVariantProps['variant']>

    /**
     * Sets the color scheme applied when the toggle is pressed.
     * @default 'primary'
     */
    color?: NonNullable<ToggleVariantProps['color']>

    /**
     * Controls the dimensions and text size of the toggle.
     * @default 'md'
     */
    size?: NonNullable<ToggleVariantProps['size']>

    /**
     * Disables the toggle and prevents interaction.
     * @default false
     */
    disabled?: boolean

    /**
     * Text content displayed inside the toggle.
     * Use this as a shorthand instead of the `children` snippet.
     */
    label?: string

    /**
     * Renders the toggle in icon-only mode without a label.
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
     * Stretches the toggle to fill the full width of its container.
     * @default false
     */
    block?: boolean

    /**
     * Forces equal width and height, ideal for icon-only toggles.
     * @default false
     */
    square?: boolean

    /**
     * Custom content rendered before the label.
     * Takes precedence over `leadingIcon`.
     */
    leadingSlot?: Snippet

    /**
     * Custom content rendered after the label.
     * Takes precedence over `trailingIcon`.
     */
    trailingSlot?: Snippet

    /**
     * Custom content for the toggle label area.
     */
    children?: Snippet

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific toggle slots.
     */
    ui?: Partial<Record<ToggleSlots, ClassNameValue>>
}
