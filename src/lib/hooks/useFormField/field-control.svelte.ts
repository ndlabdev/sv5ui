import type { FormFieldContext } from './useFormField.svelte.js'

type Props = Record<string, unknown>

export type ControlSupport = {
    invalid?: boolean
    required?: boolean
    labelledBy?: boolean
}

const ARIA_KEYS = [
    'aria-describedby',
    'aria-invalid',
    'aria-label',
    'aria-labelledby',
    'aria-errormessage',
    'aria-details',
    'aria-required'
]

const FOCUS_KEYS = ['onfocus', 'onblur']

export function mergeIds(...lists: unknown[]): string | undefined {
    const ids = lists
        .filter((list): list is string => typeof list === 'string')
        .flatMap((list) => list.split(/\s+/))
        .filter(Boolean)
    const unique = ids.filter((id, index) => ids.indexOf(id) === index)
    return unique.length ? unique.join(' ') : undefined
}

export function splitControlProps(
    props: Props,
    options: { focus?: boolean } = {}
): { root: Props; control: Props } {
    const keys = options.focus ? [...ARIA_KEYS, ...FOCUS_KEYS] : ARIA_KEYS
    const root: Props = {}
    const control: Props = {}
    for (const [key, value] of Object.entries(props)) {
        if (keys.includes(key)) control[key] = value
        else root[key] = value
    }
    return { root, control }
}

function fieldDescribedBy(field: FormFieldContext): string {
    if (field.describedBy !== undefined) return field.describedBy
    return field.error !== undefined && field.error !== false
        ? `${field.ariaId}-error`
        : `${field.ariaId}-description ${field.ariaId}-help`
}

const flag = (value: boolean | undefined) => (value ? true : undefined)

export function fieldLabelledBy(field: FormFieldContext | undefined, user: Props): unknown {
    const named = user['aria-label'] !== undefined || user['aria-labelledby'] !== undefined
    return named ? user['aria-labelledby'] : field?.labelId
}

export function fieldControlAttributes(
    field: FormFieldContext | undefined,
    user: Props,
    invalid: boolean,
    support: ControlSupport
): Props {
    const attributes: Props = {
        'aria-describedby': mergeIds(user['aria-describedby'], field && fieldDescribedBy(field))
    }
    if (support.invalid) attributes['aria-invalid'] = user['aria-invalid'] ?? flag(invalid)
    if (support.required)
        attributes['aria-required'] = user['aria-required'] ?? flag(field?.required)
    if (support.labelledBy) attributes['aria-labelledby'] = fieldLabelledBy(field, user)
    return attributes
}

export function composeHandlers<E extends Event>(...handlers: unknown[]): (event: E) => void {
    return (event) => {
        for (const handler of handlers) {
            if (typeof handler === 'function') handler(event)
        }
    }
}

export function reportControlId(
    field: FormFieldContext | undefined,
    id: () => string | undefined,
    { labelable = true }: { labelable?: boolean } = {}
): void {
    $effect(() => {
        const current = id()
        field?.setControlId?.(current, labelable)
        return () => field?.setControlId?.(undefined)
    })
}

const leavesOrEnters = (event: FocusEvent) =>
    !(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)

export function groupFocusHandlers(user: Props): {
    onfocusin: (event: FocusEvent) => void
    onfocusout: (event: FocusEvent) => void
} {
    return {
        onfocusin: (event) => {
            if (leavesOrEnters(event)) composeHandlers(user.onfocus)(event)
            composeHandlers(user.onfocusin)(event)
        },
        onfocusout: (event) => {
            if (leavesOrEnters(event)) composeHandlers(user.onblur)(event)
            composeHandlers(user.onfocusout)(event)
        }
    }
}
