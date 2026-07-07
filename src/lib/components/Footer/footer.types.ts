import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { FooterSlots } from './footer.variants.js'

export type FooterProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the footer as a different HTML element.
     * @default 'footer'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific footer slots.
     */
    ui?: Partial<Record<FooterSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Content rendered above the main footer row.
     * Designed for FooterColumns.
     */
    top?: Snippet

    /**
     * Left area of the main row, typically copyright.
     * Last in the mobile stack, first on lg+.
     */
    left?: Snippet

    /**
     * Center area of the main row, typically navigation links.
     */
    children?: Snippet

    /**
     * Right area of the main row, typically social buttons.
     * First in the mobile stack, last on lg+.
     */
    right?: Snippet

    /**
     * Content rendered below the main footer row.
     */
    bottom?: Snippet
}
