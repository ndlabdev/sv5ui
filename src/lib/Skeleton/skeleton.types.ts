import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { SkeletonSlots } from './skeleton.variants.js'

export type SkeletonProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * Renders the skeleton as a different HTML element.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Override styles for specific skeleton slots.
     */
    ui?: Partial<Record<SkeletonSlots, ClassNameValue>>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Default slot content.
     */
    children?: Snippet
}
