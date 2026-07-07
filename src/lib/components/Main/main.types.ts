import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { MainSlots } from './main.variants.js'

export type MainProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the main container as a different HTML element.
     * @default 'main'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific main slots.
     */
    ui?: Partial<Record<MainSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Content rendered inside the main container.
     */
    children?: Snippet
}
