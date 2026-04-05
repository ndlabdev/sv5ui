import { getContext } from 'svelte'
import type { FormFieldProps } from '../FormField/form-field.types.js'
import { getFormContext } from '../Form/form.context.svelte.js'

/**
 * Symbol key for the FormField context. Using a Symbol instead of a string
 * prevents collisions with unrelated `getContext('formField')` calls from
 * user code or other libraries.
 */
export const FORM_FIELD_CONTEXT_KEY: unique symbol = Symbol('sv5ui:form-field')

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
    return getContext<FormFieldContext | undefined>(FORM_FIELD_CONTEXT_KEY)
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
    const fieldCtx = getContext<FormFieldContext | undefined>(FORM_FIELD_CONTEXT_KEY)
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

/**
 * Wires native DOM input events to the parent Form's event emitters while
 * preserving any user-supplied handlers. Reduces boilerplate in wrapper
 * components (Input, Textarea, etc.) from ~20 lines of handler definitions
 * to 4 lines:
 *
 * ```svelte
 * <script>
 *   const events = wireFormEvents({ onblur, oninput, onchange, onfocus })
 * </script>
 *
 * <input {...events} />
 * ```
 *
 * Each handler fires the Form emitter first, then calls the user handler
 * (if any) with the original event.
 */
type InputEventHandler<E extends Event = Event> = (event: E) => void
type FocusEventHandler = InputEventHandler<FocusEvent>

export function wireFormEvents(userHandlers: {
    onblur?: FocusEventHandler | null
    oninput?: InputEventHandler | null
    onchange?: InputEventHandler | null
    onfocus?: FocusEventHandler | null
}) {
    const emit = useFormFieldEmit()
    return {
        onblur(event: FocusEvent) {
            emit.onBlur()
            userHandlers.onblur?.(event)
        },
        oninput(event: Event) {
            emit.onInput()
            userHandlers.oninput?.(event)
        },
        onchange(event: Event) {
            emit.onChange()
            userHandlers.onchange?.(event)
        },
        onfocus(event: FocusEvent) {
            emit.onFocus()
            userHandlers.onfocus?.(event)
        }
    }
}
