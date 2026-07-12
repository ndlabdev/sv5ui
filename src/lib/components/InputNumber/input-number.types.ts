import type { Snippet } from 'svelte'
import type { HTMLInputAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { InputNumberSlots, InputNumberVariantProps } from './input-number.variants.js'
import type { InputVariantProps } from '../Input/input.variants.js'
import type { ButtonProps } from '../Button/button.types.js'

export type InputNumberProps = Omit<
    HTMLInputAttributes,
    'class' | 'size' | 'value' | 'type' | 'min' | 'max' | 'step' | 'children'
> & {
    /**
     * Bind a reference to the underlying HTMLInputElement.
     */
    ref?: HTMLInputElement | null

    /**
     * The current numeric value. Supports two-way binding with `bind:value`.
     *
     * `null` represents an empty field. While the user is typing, the value
     * tracks the parsed input without clamping; on commit (blur or Enter) it
     * is clamped to `min`/`max` and rounded to the format precision.
     * @default null
     */
    value?: number | null

    /**
     * Called whenever the bound value changes (on typing and on commit).
     */
    onValueChange?: (value: number | null) => void

    /**
     * The smallest value allowed. Values below it are clamped on commit and
     * the decrement control is disabled at the boundary.
     */
    min?: number

    /**
     * The largest value allowed. Values above it are clamped on commit and
     * the increment control is disabled at the boundary.
     */
    max?: number

    /**
     * Amount applied by the steppers, arrow keys, and wheel.
     * @default 1 (0.01 when `formatOptions.style` is `'percent'`)
     */
    step?: number

    /**
     * Snap stepper, keyboard, and wheel operations to the nearest multiple of
     * `step`, counting from `min` (or 0 when no `min` is set). Typed values are
     * never snapped, only clamped. Set to `false` to step relative to the
     * current value instead.
     * @default true
     */
    stepSnapping?: boolean

    /**
     * `Intl.NumberFormat` options controlling how the value is displayed and
     * parsed: decimals, currency, percent, units, sign display, etc.
     *
     * @example { style: 'currency', currency: 'USD' }
     * @example { style: 'percent' }
     * @example { minimumFractionDigits: 2, maximumFractionDigits: 2 }
     */
    formatOptions?: Intl.NumberFormatOptions

    /**
     * BCP 47 locale used for formatting and parsing.
     * @default 'en'
     */
    locale?: string

    /**
     * Placement of the stepper buttons: `'horizontal'` puts decrement/increment
     * on opposite sides with centered text, `'vertical'` stacks them on the
     * trailing side.
     * @default 'horizontal'
     */
    orientation?: NonNullable<InputNumberVariantProps['orientation']>

    /**
     * Icon for the increment button.
     * Supports any valid Iconify icon name.
     * @default 'lucide:plus' ('lucide:chevron-up' when vertical)
     */
    incrementIcon?: string

    /**
     * Icon for the decrement button.
     * Supports any valid Iconify icon name.
     * @default 'lucide:minus' ('lucide:chevron-down' when vertical)
     */
    decrementIcon?: string

    /**
     * Props forwarded to the increment `<Button>`, merged over the defaults
     * (`variant: 'link'`, `color: 'surface'`, the resolved size, and the
     * increment icon). Use it to restyle the stepper or add behavior.
     *
     * @example { variant: 'soft', color: 'primary' }
     */
    increment?: ButtonProps

    /**
     * Props forwarded to the decrement `<Button>`, merged over the same
     * defaults as `increment`.
     */
    decrement?: ButtonProps

    /**
     * Accessible label for the increment button.
     * @default 'Increase'
     */
    incrementAriaLabel?: string

    /**
     * Accessible label for the decrement button.
     * @default 'Decrease'
     */
    decrementAriaLabel?: string

    /**
     * Disable changing the value with the mouse wheel while the field is
     * focused.
     * @default false
     */
    disableWheelChange?: boolean

    /**
     * Invert the wheel direction: scrolling up decrements instead of
     * incrementing.
     * @default false
     */
    invertWheelChange?: boolean

    /**
     * The HTML `id` attribute for the input element. Used by a parent
     * `<FormField>` so the label's `for` attribute can target the field.
     */
    id?: string

    /**
     * The name used for the hidden input element carrying the raw numeric
     * value, enabling native form submission. Also used by a parent `<Form>`
     * to look up validation state.
     */
    name?: string

    /** @default false */
    required?: boolean

    /** @default false */
    disabled?: boolean

    /** @default false */
    readonly?: boolean

    /**
     * Controls the visual style of the field, mirroring `<Input>` variants.
     * @default 'outline'
     */
    variant?: NonNullable<InputVariantProps['variant']>

    /**
     * Sets the color scheme for focus ring and highlight.
     * @default 'primary'
     */
    color?: NonNullable<InputVariantProps['color']>

    /**
     * Controls the dimensions and text size of the field.
     * @default 'md'
     */
    size?: NonNullable<InputVariantProps['size']>

    /**
     * Emphasizes ring color like focus state, even when not focused.
     * Automatically enabled when used inside a FormField with an error.
     * @default false
     */
    highlight?: boolean

    /**
     * Custom content for the increment button, replacing the default icon.
     */
    incrementSlot?: Snippet

    /**
     * Custom content for the decrement button, replacing the default icon.
     */
    decrementSlot?: Snippet

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific slots.
     */
    ui?: Partial<Record<InputNumberSlots, ClassNameValue>>
}
