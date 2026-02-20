import type { Snippet } from 'svelte'
import type { Checkbox as CheckboxPrimitive } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { CheckboxVariantProps, CheckboxSlots } from './checkbox.variants.js'

export type CheckboxProps = Pick<
    CheckboxPrimitive.RootProps,
    'disabled' | 'name' | 'value' | 'required'
> & {
    /**
     * The checked state of the checkbox. Supports two-way binding with `bind:checked`.
     * @default false
     */
    checked?: boolean

    /**
     * Callback when the checked state changes.
     */
    onCheckedChange?: (checked: boolean) => void

    /**
     * Whether the checkbox is in an indeterminate state.
     * @default false
     */
    indeterminate?: boolean

    /**
     * Callback when the indeterminate state changes.
     */
    onIndeterminateChange?: (indeterminate: boolean) => void

    /**
     * Sets the color scheme for the checkbox.
     * @default 'primary'
     */
    color?: NonNullable<CheckboxVariantProps['color']>

    /**
     * Controls the dimensions of the checkbox.
     * @default 'md'
     */
    size?: NonNullable<CheckboxVariantProps['size']>

    /**
     * Renders a loading spinner inside the checkbox.
     * @default false
     */
    loading?: boolean

    /**
     * Icon displayed as the loading indicator.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Icon displayed when checked.
     * @default Uses `icons.check` from app config
     */
    icon?: string

    /**
     * Icon displayed when in indeterminate state.
     * @default 'lucide:minus'
     */
    indeterminateIcon?: string

    /**
     * Label text displayed next to the checkbox.
     */
    label?: string

    /**
     * Description text displayed below the label.
     */
    description?: string

    /**
     * The HTML id attribute for the checkbox.
     */
    id?: string

    /**
     * Custom snippet for the label.
     */
    labelSlot?: Snippet<[{ label?: string }]>

    /**
     * Custom snippet for the description.
     */
    descriptionSlot?: Snippet<[{ description?: string }]>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific checkbox slots.
     */
    ui?: Partial<Record<CheckboxSlots, ClassNameValue>>
}
