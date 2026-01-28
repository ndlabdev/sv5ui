import type { Snippet } from 'svelte'
import type { ClassNameValue } from 'tailwind-merge'
import type { HTMLAttributes } from 'svelte/elements'
import type { ChipVariantProps, ChipSlots } from './chip.variants.js'

export type ChipProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * The HTML element to render as.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific chip slots.
     */
    ui?: Partial<Record<ChipSlots, ClassNameValue>>

    /**
     * Text or number displayed inside the chip.
     */
    text?: string | number

    /**
     * Sets the color scheme applied to the chip.
     * @default 'primary'
     */
    color?: NonNullable<ChipVariantProps['color']>

    /**
     * Controls the dimensions of the chip.
     * @default 'md'
     */
    size?: NonNullable<ChipVariantProps['size']>

    /**
     * Controls the position relative to wrapped content.
     * @default 'top-right'
     */
    position?: NonNullable<ChipVariantProps['position']>

    /**
     * Keeps the chip inside the component bounds.
     * @default false
     */
    inset?: boolean

    /**
     * Renders the chip without absolute positioning.
     * @default false
     */
    standalone?: boolean

    /**
     * Controls the visibility of the chip.
     * @default true
     */
    show?: boolean

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Content to wrap with the chip indicator.
     */
    children?: Snippet

    /**
     * Custom content rendered inside the chip.
     * Takes precedence over text.
     */
    content?: Snippet
}
