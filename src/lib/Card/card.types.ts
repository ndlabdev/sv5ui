import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { CardVariantProps, CardSlots } from './card.variants.js'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
    /**
     * Renders the card as a different HTML element.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Controls the visual style of the card.
     * @default 'outline'
     */
    variant?: NonNullable<CardVariantProps['variant']>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific card slots.
     */
    ui?: Partial<Record<CardSlots, ClassNameValue>>

    /**
     * Content rendered in the card header section.
     */
    header?: Snippet

    /**
     * Content rendered in the card footer section.
     */
    footer?: Snippet
}
