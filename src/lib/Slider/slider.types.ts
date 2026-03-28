import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { SliderVariantProps, SliderSlots } from './slider.variants.js'

export type SliderProps = Omit<HTMLAttributes<HTMLElement>, 'class'> & {
    /**
     * Bindable reference to the root DOM element.
     */
    ref?: HTMLElement | null

    /**
     * The current value. Use `number` for a single thumb, `number[]` for a range slider.
     * Supports two-way binding with `bind:value`.
     * @default 0
     */
    value?: number | number[]

    /**
     * Callback fired continuously while the user drags a thumb.
     */
    onValueChange?: (value: number | number[]) => void

    /**
     * Callback fired once when the user releases the thumb.
     */
    onValueCommit?: (value: number | number[]) => void

    /**
     * The minimum allowed value.
     * @default 0
     */
    min?: number

    /**
     * The maximum allowed value.
     * @default 100
     */
    max?: number

    /**
     * The increment amount, or an array of discrete snap values.
     * @default 1
     */
    step?: number | number[]

    /**
     * The orientation of the slider.
     * @default 'horizontal'
     */
    orientation?: NonNullable<SliderVariantProps['orientation']>

    /**
     * Whether the slider is disabled.
     * @default false
     */
    disabled?: boolean

    /**
     * Whether to automatically sort thumb values when they cross each other (range mode).
     * @default true
     */
    autoSort?: boolean

    /**
     * Color scheme of the slider.
     * @default 'primary'
     */
    color?: NonNullable<SliderVariantProps['color']>

    /**
     * Size of the slider track and thumbs.
     * @default 'md'
     */
    size?: NonNullable<SliderVariantProps['size']>

    /**
     * Show a floating value label above each thumb.
     * @default false
     */
    tooltip?: boolean

    /**
     * The name attribute for hidden inputs used in form submission.
     */
    name?: string

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific slider slots.
     */
    ui?: Partial<Record<SliderSlots, ClassNameValue>>
}
