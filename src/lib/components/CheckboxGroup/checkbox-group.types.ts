import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { CheckboxGroupVariantProps, CheckboxGroupSlots } from './checkbox-group.variants.js'

export type CheckboxGroupItem = {
    /**
     * The unique value for this checkbox item.
     */
    value: string

    /**
     * Label text displayed next to the checkbox.
     */
    label?: string

    /**
     * Description text displayed below the label.
     */
    description?: string

    /**
     * Whether this individual checkbox item is disabled.
     * @default false
     */
    disabled?: boolean
}

export type CheckboxGroupProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The list of selected values. Supports two-way binding with `bind:value`.
     * @default []
     */
    value?: string[]

    /**
     * Callback when the selected values change.
     */
    onValueChange?: (value: string[]) => void

    /**
     * The list of checkbox items to render.
     */
    items?: CheckboxGroupItem[]

    /**
     * Sets the color scheme for the checkboxes.
     * @default 'primary'
     */
    color?: NonNullable<CheckboxGroupVariantProps['color']>

    /**
     * Controls the dimensions of the checkbox group.
     * @default 'md'
     */
    size?: NonNullable<CheckboxGroupVariantProps['size']>

    /**
     * Controls the visual style of each checkbox item.
     * @default 'list'
     */
    variant?: NonNullable<CheckboxGroupVariantProps['variant']>

    /**
     * Controls the position of the checkbox indicator.
     * @default 'start'
     */
    indicator?: NonNullable<CheckboxGroupVariantProps['indicator']>

    /**
     * Controls the layout direction of the items.
     * @default 'vertical'
     */
    orientation?: NonNullable<CheckboxGroupVariantProps['orientation']>

    /**
     * The name attribute for the checkbox inputs (used in form submission).
     */
    name?: string

    /**
     * Whether the checkbox group is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * Whether the checkbox group is required.
     * @default false
     */
    required?: boolean

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
     * Icon displayed when a checkbox is checked.
     * @default Uses `icons.check` from app config
     */
    icon?: string

    /**
     * Legend text displayed above the checkbox group.
     */
    legend?: string

    /**
     * The HTML id attribute for the checkbox group.
     */
    id?: string

    /**
     * Custom snippet for the legend.
     */
    legendSlot?: Snippet<[{ legend?: string }]>

    /**
     * Custom snippet for each item's label.
     */
    labelSlot?: Snippet<[{ item: CheckboxGroupItem }]>

    /**
     * Custom snippet for each item's description.
     */
    descriptionSlot?: Snippet<[{ item: CheckboxGroupItem }]>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific checkbox group slots.
     */
    ui?: Partial<Record<CheckboxGroupSlots, ClassNameValue>>
}
