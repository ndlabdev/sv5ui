import type { Snippet } from 'svelte'
import type { Switch as SwitchPrimitive } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { SwitchVariantProps, SwitchSlots } from './switch.variants.js'

export type SwitchProps = Pick<
    SwitchPrimitive.RootProps,
    'disabled' | 'name' | 'value' | 'required'
> & {
    /**
     * The checked state of the switch. Supports two-way binding with `bind:checked`.
     * @default false
     */
    checked?: boolean

    /**
     * Callback when the checked state changes.
     */
    onCheckedChange?: (checked: boolean) => void

    /**
     * Sets the color scheme for the switch.
     * @default 'primary'
     */
    color?: NonNullable<SwitchVariantProps['color']>

    /**
     * Controls the dimensions of the switch.
     * @default 'md'
     */
    size?: NonNullable<SwitchVariantProps['size']>

    /**
     * Renders a loading spinner inside the thumb.
     * @default false
     */
    loading?: boolean

    /**
     * Icon displayed as the loading indicator.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * Icon displayed inside the thumb when checked.
     */
    checkedIcon?: string

    /**
     * Icon displayed inside the thumb when unchecked.
     */
    uncheckedIcon?: string

    /**
     * Label text displayed next to the switch.
     */
    label?: string

    /**
     * Description text displayed below the label.
     */
    description?: string

    /**
     * The HTML id attribute for the switch.
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
     * Override styles for specific switch slots.
     */
    ui?: Partial<Record<SwitchSlots, ClassNameValue>>
}
