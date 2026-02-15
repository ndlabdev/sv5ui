import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { FieldGroupSlots, FieldGroupVariantProps } from './field-group.variants.js'

export type FieldGroupProps = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
    /**
     * The HTML element to render as.
     * @default 'div'
     */
    as?: keyof HTMLElementTagNameMap

    /**
     * Controls the size of all child components in the group.
     * @default 'md'
     */
    size?: NonNullable<FieldGroupVariantProps['size']>

    /**
     * Controls the layout direction of the group.
     * @default 'horizontal'
     */
    orientation?: NonNullable<FieldGroupVariantProps['orientation']>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific field group slots.
     */
    ui?: Partial<Record<FieldGroupSlots, ClassNameValue>>

    /**
     * The child content of the field group.
     */
    children?: Snippet
}
