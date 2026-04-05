import { getContext } from 'svelte'
import type { FormFieldProps } from '../FormField/form-field.types.js'
import { getFormContext } from '../Form/form.context.svelte.js'

export interface FormFieldContext {
    name?: string
    size: NonNullable<FormFieldProps['size']>
    error?: string | boolean
    ariaId: string
    /** Whether input events should validate this field before first blur. */
    eagerValidation?: boolean
    /** Per-field override for the input debounce delay. */
    validateOnInputDelay?: number
    /** Regex pattern used to match form errors for this field (in addition to exact name). */
    errorPattern?: RegExp
}

/**
 * Access the nearest FormField context. Returns `undefined` when used outside a FormField.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useFormField } from 'sv5ui'
 *
 *   const formField = useFormField()
 *   const hasError = $derived(formField?.error !== undefined && formField?.error !== false)
 * </script>
 * ```
 */
export function useFormField(): FormFieldContext | undefined {
    return getContext<FormFieldContext | undefined>('formField')
}

/**
 * Event emitter helpers for inputs nested inside a `<FormField>` within a `<Form>`.
 * Each returned function is a safe no-op when used outside a Form, so inputs can
 * unconditionally wire them to their native events.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useFormFieldEmit } from 'sv5ui'
 *   const emit = useFormFieldEmit()
 * </script>
 *
 * <input onblur={emit.onBlur} oninput={emit.onInput} onchange={emit.onChange} onfocus={emit.onFocus} />
 * ```
 */
export function useFormFieldEmit() {
    const fieldCtx = getContext<FormFieldContext | undefined>('formField')
    const formCtx = getFormContext()

    return {
        onBlur(): void {
            const n = fieldCtx?.name
            if (n) formCtx?.onBlur(n)
        },
        onFocus(): void {
            const n = fieldCtx?.name
            if (n) formCtx?.onFocus(n)
        },
        onChange(): void {
            const n = fieldCtx?.name
            if (n) formCtx?.onChange(n)
        },
        onInput(): void {
            const n = fieldCtx?.name
            if (n) formCtx?.onInput(n, fieldCtx?.eagerValidation)
        }
    }
}
