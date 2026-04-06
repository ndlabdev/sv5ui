import type { Snippet } from 'svelte'
import type { HTMLFormAttributes } from 'svelte/elements'
import type { ClassNameValue } from 'tailwind-merge'
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type { FormSlots } from './form.variants.js'

// ==================== STANDARD SCHEMA V1 ====================
// Re-exported from @standard-schema/spec (types-only, zero runtime cost).
// Zod 3.24+, Valibot 1.0+, Yup 1.7+ all implement this shape via their
// `~standard` property — they are passed to Form directly without adapters.

export type { StandardSchemaV1 }

export type StandardSchemaV1InferInput<Schema extends StandardSchemaV1> =
    StandardSchemaV1.InferInput<Schema>

export type StandardSchemaV1InferOutput<Schema extends StandardSchemaV1> =
    StandardSchemaV1.InferOutput<Schema>

// ==================== JOI (STRUCTURAL TYPE) ====================
// Joi does NOT implement Standard Schema as of v18, so it's detected via
// duck typing and handled by a dedicated adapter. We do not import from 'joi'
// at runtime to avoid forcing users to install it.

export interface JoiSchema {
    validate: (
        value: unknown,
        options?: object
    ) => {
        value: unknown
        error?: {
            details: Array<{ message: string; path: Array<string | number> }>
        }
    }
    validateAsync: (value: unknown, options?: object) => Promise<unknown>
    $_root: unknown
    type: string
}

// ==================== FORM SCHEMA UNION ====================

// Either a Standard Schema (Zod / Valibot / Yup 1.7+) or a Joi schema.
export type FormSchema = StandardSchemaV1 | JoiSchema

// Infer input type from any supported schema.
export type InferInput<Schema> = Schema extends StandardSchemaV1
    ? StandardSchemaV1InferInput<Schema>
    : never

// Infer output type from any supported schema.
export type InferOutput<Schema> = Schema extends StandardSchemaV1
    ? StandardSchemaV1InferOutput<Schema>
    : never

// Resolve the data type based on whether transform is enabled.
export type FormData<S, T extends boolean = true> = T extends true ? InferOutput<S> : InferInput<S>

// ==================== ERROR TYPES ====================

export interface FormError<P extends string = string> {
    name?: P
    message: string
}

export interface FormErrorWithId extends FormError {
    id?: string
}

// ==================== EVENT TYPES ====================

export type FormInputEvents = 'input' | 'blur' | 'change' | 'focus'

export type FormSubmitEvent<T = unknown> = SubmitEvent & { data: T }

export type FormErrorEvent = SubmitEvent & {
    errors: FormErrorWithId[]
}

// ==================== EXCEPTIONS ====================

export class FormValidationException extends Error {
    formId: string | number
    errors: FormErrorWithId[]
    constructor(formId: string | number, errors: FormErrorWithId[]) {
        super('Form validation exception')
        this.name = 'FormValidationException'
        this.formId = formId
        this.errors = errors
        Object.setPrototypeOf(this, FormValidationException.prototype)
    }
}

// ==================== INTERNAL REGISTRY TYPES ====================

export interface FormFieldRegistryEntry {
    id?: string
    pattern?: RegExp
    eagerValidation?: boolean
    validateOnInputDelay?: number
}

export interface NestedFormEntry {
    formId: string | number
    name?: string
    validate: (opts?: FormValidateOpts) => Promise<unknown | false>
    clear: (name?: string | RegExp) => void
    reset: () => void
    setErrors: (errs: FormError[], name?: string | RegExp) => void
}

// ==================== VALIDATE OPTIONS ====================

export interface FormValidateOpts {
    name?: string | string[]
    silent?: boolean
    nested?: boolean
    transform?: boolean
}

// ==================== PUBLIC API ====================

export interface FormApi<T = unknown> {
    validate(opts?: FormValidateOpts): Promise<T | false>
    submit(): Promise<void>
    clear(name?: string | RegExp): void
    getErrors(name?: string | RegExp): FormErrorWithId[]
    setErrors(errs: FormError[], name?: string | RegExp): void
    /**
     * Reset form tracking state: clears all errors, dirty/touched/blurred field
     * sets, and resets submitCount to 0. Does NOT modify `state` — you own that
     * and should reassign it yourself if you want to restore initial values.
     */
    reset(): void
    readonly errors: FormErrorWithId[]
    readonly loading: boolean
    readonly disabled: boolean
    readonly dirty: boolean
    readonly dirtyFields: ReadonlySet<string>
    readonly touchedFields: ReadonlySet<string>
    readonly blurredFields: ReadonlySet<string>
    /** Number of times `submit()` has been called (whether validation passed or not). */
    readonly submitCount: number
}

// ==================== PROPS ====================

export type FormProps<
    S extends FormSchema | undefined = FormSchema | undefined,
    T extends boolean = true,
    N extends boolean = false
> = Omit<HTMLFormAttributes, 'class' | 'id' | 'name' | 'onsubmit' | 'onerror'> & {
    /** Bindable reference to the root DOM element. */
    ref?: HTMLElement | null

    /**
     * Bindable form API — methods and reactive state accessors.
     *
     * For typed access to `validate()` / `submit()` results, annotate the
     * consumer variable explicitly:
     *
     * ```ts
     * import type { FormApi } from 'sv5ui'
     * import type { z } from 'zod'
     *
     * const schema = z.object({ email: z.string().email() })
     * let form = $state<FormApi<z.infer<typeof schema>>>()
     * ```
     */
    api?: FormApi<unknown>

    /** Optional explicit id for the form (used as key for internal bus). */
    id?: string | number

    /**
     * Schema to validate the form state.
     * Standard Schema (Zod 3.24+, Valibot 1.0+, Yup 1.7+) or Joi.
     */
    schema?: S

    /** The object representing the current state of the form. Bindable. */
    state?: S extends FormSchema ? (N extends false ? Partial<InferInput<S>> : never) : object

    /**
     * Custom validation function. Runs alongside `schema` if both provided.
     */
    validate?: (
        state: S extends FormSchema ? Partial<InferInput<S>> : object
    ) => FormError[] | Promise<FormError[]>

    /**
     * Input events that trigger field-level validation.
     * Submit always triggers full validation regardless.
     * @default ['input', 'blur', 'change']
     */
    validateOn?: FormInputEvents[]

    /**
     * Debounce delay in ms for `input` event validation.
     * @default 300
     */
    validateOnInputDelay?: number

    /** Disable all inputs inside the form (propagated via context). */
    disabled?: boolean

    /**
     * When `true`, the form is automatically disabled during async submit.
     * @default true
     */
    loadingAuto?: boolean

    /**
     * When `true`, apply schema transformations on submit.
     * @default true
     */
    transform?: T

    /**
     * When `true`, this form attaches to its parent Form and validates alongside it.
     * @default false
     */
    nested?: N & boolean

    /**
     * Dotted path of this form's state within its parent. Only meaningful when `nested = true`.
     */
    name?: N extends true ? string : never

    /** Submit handler. Called with validated (and optionally transformed) data. */
    onsubmit?: (
        event: FormSubmitEvent<S extends FormSchema ? FormData<S, T> : object>
    ) => void | Promise<void>

    /** Error handler. Called when validation fails on submit. */
    onerror?: (event: FormErrorEvent) => void

    /** Additional CSS classes for the root element. */
    class?: ClassNameValue

    /** Override styles for specific form slots. */
    ui?: Partial<Record<FormSlots, ClassNameValue>>

    /** Default slot — receives reactive `errors` and `loading`. */
    children?: Snippet<[{ errors: FormErrorWithId[]; loading: boolean }]>
}
