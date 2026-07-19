import type { Snippet } from 'svelte'
import type { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'
import type { ClassNameValue } from 'tailwind-merge'
import type { ToggleVariantProps } from '../Toggle/toggle.variants.js'
import type { ToggleGroupVariantProps, ToggleGroupSlots } from './toggle-group.variants.js'

export type ToggleGroupItem = {
    /**
     * The unique value identifying this item within the group.
     */
    value: string

    /**
     * Text content displayed inside the item.
     */
    label?: string

    /**
     * Renders the item in icon-only mode without a label.
     * Supports any valid Iconify icon name.
     */
    icon?: string

    /**
     * Icon placed before the label.
     * Supports any valid Iconify icon name.
     */
    leadingIcon?: string

    /**
     * Icon placed after the label.
     * Supports any valid Iconify icon name.
     */
    trailingIcon?: string

    /**
     * Accessible name for the item, required for icon-only items.
     */
    ariaLabel?: string

    /**
     * Whether this individual item is disabled.
     * @default false
     */
    disabled?: boolean
}

type ToggleGroupSingleRootProps = Extract<ToggleGroupPrimitive.RootProps, { type: 'single' }>

type ToggleGroupPassthroughProps = Omit<
    ToggleGroupSingleRootProps,
    | 'type'
    | 'value'
    | 'onValueChange'
    | 'child'
    | 'children'
    | 'class'
    | 'ref'
    | 'disabled'
    | 'loop'
    | 'orientation'
    | 'rovingFocus'
>

export type ToggleGroupValueProps =
    | {
          /**
           * Selection mode: only one item can be pressed at a time.
           * @default 'single'
           */
          type?: 'single'

          /**
           * The pressed item's value. Supports two-way binding with `bind:value`.
           */
          value?: string

          /**
           * Callback when the pressed value changes.
           */
          onValueChange?: (value: string) => void
      }
    | {
          /**
           * Selection mode: multiple items can be pressed at once.
           */
          type: 'multiple'

          /**
           * The pressed items' values. Supports two-way binding with `bind:value`.
           */
          value?: string[]

          /**
           * Callback when the pressed values change.
           */
          onValueChange?: (value: string[]) => void
      }

export type ToggleGroupProps = ToggleGroupPassthroughProps &
    ToggleGroupValueProps & {
        /**
         * Bindable reference to the root DOM element.
         */
        ref?: HTMLElement | null

        /**
         * The list of toggle items to render.
         */
        items?: ToggleGroupItem[]

        /**
         * Controls the visual style of the items.
         * @default 'ghost'
         */
        variant?: NonNullable<ToggleVariantProps['variant']>

        /**
         * Sets the color scheme applied to pressed items.
         * @default 'primary'
         */
        color?: NonNullable<ToggleVariantProps['color']>

        /**
         * Controls the dimensions and text size of the items.
         * @default 'md'
         */
        size?: NonNullable<ToggleVariantProps['size']>

        /**
         * Controls the keyboard navigation and layout direction.
         * @default 'horizontal'
         */
        orientation?: NonNullable<ToggleGroupVariantProps['orientation']>

        /**
         * Renders the items flush against each other for a segmented-control look.
         * When false, items keep a small gap (toolbar look).
         * @default false
         */
        attached?: boolean

        /**
         * Stretches the group to the full container width with equal-width items.
         * @default false
         */
        block?: boolean

        /**
         * Forces equal width and height on every item, ideal for icon-only groups.
         * @default false
         */
        square?: boolean

        /**
         * Disables the whole group and prevents interaction.
         * @default false
         */
        disabled?: boolean

        /**
         * Whether keyboard navigation loops from the last item back to the first.
         * @default true
         */
        loop?: boolean

        /**
         * Whether arrow keys move focus between items (roving focus).
         * When false, items are reached with the Tab key instead.
         * @default true
         */
        rovingFocus?: boolean

        /**
         * Custom snippet for each item's content, replacing the default
         * icon and label rendering.
         */
        itemSlot?: Snippet<[{ item: ToggleGroupItem }]>

        /**
         * Additional CSS classes for the root element.
         */
        class?: ClassNameValue

        /**
         * Override styles for specific toggle group slots.
         */
        ui?: Partial<Record<ToggleGroupSlots, ClassNameValue>>
    }
