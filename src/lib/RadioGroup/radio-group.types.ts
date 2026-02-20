import type { Snippet } from 'svelte'
import type { RadioGroup as RadioGroupPrimitive } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { RadioGroupVariantProps, RadioGroupSlots } from './radio-group.variants.js'

export type RadioGroupItem = {
    /**
     * The unique value for this radio item.
     */
    value: string

    /**
     * Label text displayed next to the radio.
     */
    label?: string

    /**
     * Description text displayed below the label.
     */
    description?: string

    /**
     * Whether this individual radio item is disabled.
     * @default false
     */
    disabled?: boolean
}

export type RadioGroupProps = Pick<
    RadioGroupPrimitive.RootProps,
    'disabled' | 'name' | 'required' | 'loop'
> & {
    /**
     * The selected value. Supports two-way binding with `bind:value`.
     */
    value?: string

    /**
     * Callback when the value changes.
     */
    onValueChange?: (value: string) => void

    /**
     * The list of radio items to render.
     */
    items?: RadioGroupItem[]

    /**
     * Sets the color scheme for the radio indicators.
     * @default 'primary'
     */
    color?: NonNullable<RadioGroupVariantProps['color']>

    /**
     * Controls the dimensions of the radio group.
     * @default 'md'
     */
    size?: NonNullable<RadioGroupVariantProps['size']>

    /**
     * Controls the layout direction.
     * @default 'vertical'
     */
    orientation?: NonNullable<RadioGroupVariantProps['orientation']>

    /**
     * Legend text displayed above the radio group.
     */
    legend?: string

    /**
     * Renders a loading spinner and disables interaction.
     * @default false
     */
    loading?: boolean

    /**
     * Icon displayed as the loading indicator.
     * @default Uses `icons.loading` from app config
     */
    loadingIcon?: string

    /**
     * The HTML id attribute for the radio group.
     */
    id?: string

    /**
     * Custom snippet for the legend.
     */
    legendSlot?: Snippet<[{ legend?: string }]>

    /**
     * Custom snippet for each item's label.
     */
    labelSlot?: Snippet<[{ item: RadioGroupItem }]>

    /**
     * Custom snippet for each item's description.
     */
    descriptionSlot?: Snippet<[{ item: RadioGroupItem }]>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific radio group slots.
     */
    ui?: Partial<Record<RadioGroupSlots, ClassNameValue>>
}
