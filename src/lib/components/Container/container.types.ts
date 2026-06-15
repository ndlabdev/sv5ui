import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { ContainerSlots } from './container.variants.js'

export type ContainerProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Sets the HTML element type to render.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific container slots.
     * Available slots: root.
     */
    ui?: Partial<Record<ContainerSlots, ClassNameValue>>
}
