import type { Snippet } from 'svelte'
import type { HTMLAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { FormFieldSlots, FormFieldVariantProps } from './form-field.variants.js'

export type FormFieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'class'> & {
    /**
     * The name of the form field, used for matching form errors.
     */
    name?: string

    /**
     * The label text displayed above the form control.
     */
    label?: string

    /**
     * Additional description text displayed below the label.
     */
    description?: string

    /**
     * Hint text displayed next to the label (right side).
     */
    hint?: string

    /**
     * Help text displayed below the form control.
     */
    help?: string

    /**
     * Error message to display. When set, replaces the help text.
     * Can be a string (error message) or boolean (error state without message).
     */
    error?: string | boolean

    /**
     * Controls the size of the form field labels and text.
     * @default 'md'
     */
    size?: NonNullable<FormFieldVariantProps['size']>

    /**
     * Whether the field is required. Adds an asterisk indicator to the label.
     * @default false
     */
    required?: boolean

    /**
     * Controls the layout direction.
     * @default 'vertical'
     */
    orientation?: NonNullable<FormFieldVariantProps['orientation']>

    /**
     * Additional CSS classes for the root element.
     */
    class?: ClassNameValue

    /**
     * Override styles for specific form field slots.
     */
    ui?: Partial<Record<FormFieldSlots, ClassNameValue>>

    /**
     * The default slot content (form control).
     */
    children?: Snippet<[{ error?: string | boolean }]>

    /**
     * Custom label slot.
     */
    labelSlot?: Snippet<[{ label?: string }]>

    /**
     * Custom hint slot.
     */
    hintSlot?: Snippet<[{ hint?: string }]>

    /**
     * Custom description slot.
     */
    descriptionSlot?: Snippet<[{ description?: string }]>

    /**
     * Custom help slot.
     */
    helpSlot?: Snippet<[{ help?: string }]>

    /**
     * Custom error slot.
     */
    errorSlot?: Snippet<[{ error?: string | boolean }]>
}
