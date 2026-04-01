import { getContext } from 'svelte'
import type { FormFieldProps } from '../FormField/form-field.types.js'

export interface FormFieldContext {
    name?: string
    size: NonNullable<FormFieldProps['size']>
    error?: string | boolean
    ariaId: string
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
