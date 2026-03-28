import type { PinInput as PinInputPrimitive } from 'bits-ui'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { PinInputVariantProps, PinInputSlots } from './pin-input.variants.js'

export type PinInputProps = Pick<
    PinInputPrimitive.RootProps,
    | 'disabled'
    | 'textalign'
    | 'onComplete'
    | 'pasteTransformer'
    | 'pushPasswordManagerStrategy'
    | 'inputId'
> &
    Omit<HTMLAttributes<HTMLElement>, 'class' | 'children'> & {
        /**
         * Bindable reference to the root DOM element.
         */
        ref?: HTMLElement | null

        /**
         * The current value. Supports two-way binding with `bind:value`.
         * @default ''
         */
        value?: string

        /**
         * The initial value when uncontrolled.
         */
        defaultValue?: string

        /**
         * Callback fired when the value changes.
         */
        onValueChange?: (value: string) => void

        /**
         * The name attribute for the hidden input (used in form submission).
         */
        name?: string

        /**
         * Whether the field is required.
         */
        required?: boolean

        /**
         * Number of cells (characters).
         * @default 5
         */
        length?: number

        /**
         * Input type. Use 'number' to restrict to digits only.
         * @default 'text'
         */
        type?: 'text' | 'number'

        /**
         * Mask the input, showing ● instead of typed characters.
         * @default false
         */
        mask?: boolean

        /**
         * Enable OTP mode (sets autocomplete="one-time-code").
         * @default false
         */
        otp?: boolean

        /**
         * Placeholder character displayed in each empty cell.
         * @default '○'
         */
        placeholder?: string

        /**
         * Automatically focus the input on mount.
         * @default false
         */
        autofocus?: boolean

        /**
         * Delay in milliseconds before autofocusing.
         * @default 0
         */
        autofocusDelay?: number

        /**
         * Highlight all cells with the active color ring (e.g. for error state).
         * @default false
         */
        highlight?: boolean

        /**
         * Prevent responsive text size changes on mobile.
         * @default false
         */
        fixed?: boolean

        /**
         * Color scheme of the input cells.
         * @default 'primary'
         */
        color?: NonNullable<PinInputVariantProps['color']>

        /**
         * Size of each cell.
         * @default 'md'
         */
        size?: NonNullable<PinInputVariantProps['size']>

        /**
         * Visual style of the input cells.
         * @default 'outline'
         */
        variant?: NonNullable<PinInputVariantProps['variant']>

        /**
         * Additional CSS classes for the root element.
         */
        class?: ClassNameValue

        /**
         * Override styles for specific slots.
         */
        ui?: Partial<Record<PinInputSlots, ClassNameValue>>
    }
