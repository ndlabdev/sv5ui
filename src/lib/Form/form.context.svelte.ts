import { getContext } from 'svelte'
import { SvelteSet } from 'svelte/reactivity'
import {
    FormValidationException,
    type FormError,
    type FormErrorWithId,
    type FormErrorEvent,
    type FormFieldRegistryEntry,
    type FormInputEvents,
    type FormSchema,
    type FormSubmitEvent,
    type FormValidateOpts,
    type NestedFormEntry
} from './form.types.js'
import { getAtPath, setAtPath, validateSchema } from './validate-schema.js'

// ==================== CONTEXT KEY ====================

export const FORM_CONTEXT_KEY = Symbol('sv5ui:form')

export function getFormContext<T = unknown>(): FormContext<T> | undefined {
    return getContext<FormContext<T> | undefined>(FORM_CONTEXT_KEY)
}

// ==================== OPTIONS ====================

export interface FormContextOptions<T> {
    getState: () => T
    getSchema: () => FormSchema | undefined
    getCustomValidate: () => ((state: T) => FormError[] | Promise<FormError[]>) | undefined
    getValidateOn: () => FormInputEvents[]
    getValidateOnInputDelay: () => number
    getDisabled: () => boolean
    getLoadingAuto: () => boolean
    getTransform: () => boolean
    getName: () => string | undefined
    getOnSubmit: () => ((event: FormSubmitEvent<unknown>) => void | Promise<void>) | undefined
    getOnError: () => ((event: FormErrorEvent) => void) | undefined
}

// ==================== HELPERS ====================

function matchesName(errorName: string | undefined, target: string): boolean {
    if (!errorName) return false
    return errorName === target || errorName.startsWith(target + '.')
}

function matchesTarget(errorName: string | undefined, target: string | RegExp): boolean {
    if (!errorName) return false
    if (target instanceof RegExp) return target.test(errorName)
    return matchesName(errorName, target)
}

function addFormPath(error: FormError, formPath?: string): FormError {
    if (!formPath || !error.name) return error
    return { ...error, name: `${formPath}.${error.name}` }
}

// ==================== FORM CONTEXT CLASS ====================

export class FormContext<T = unknown> {
    // ---------- Reactive state ----------
    errors = $state<FormErrorWithId[]>([])
    loading = $state(false)
    submitCount = $state(0)
    dirtyFields = new SvelteSet<string>()
    touchedFields = new SvelteSet<string>()
    blurredFields = new SvelteSet<string>()

    // ---------- Non-reactive internals ----------
    // These maps are intentionally plain (not SvelteMap): they are private and
    // never read from reactive contexts (templates / $derived), so reactivity
    // would only add proxy overhead without any subscriber to notify.
    formId: string | number
    #opts: FormContextOptions<T>
    #parentCtx?: FormContext
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    #fieldRegistry = new Map<string, FormFieldRegistryEntry>()
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    #nestedForms = new Map<string | number, NestedFormEntry>()
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    #timers = new Map<string, ReturnType<typeof setTimeout>>()
    #transformedState: Record<string, unknown> | null = null
    #disposed = false
    /**
     * Re-entrancy guard for submit(). Independent of `loading` because users
     * can set `loadingAuto: false` (which keeps `loading` at `false` during
     * an in-flight submit). Without a separate flag, rapid clicks would
     * concurrently run the validation pipeline and double-count submitCount.
     */
    #submitting = false
    /**
     * Cached Set view of `validateOn` for O(1) membership lookup on every
     * event handler (onBlur / onInput / onChange / onFocus). Rebuilt lazily
     * when the underlying array reference changes.
     */
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    #validateOnSet = new Set<FormInputEvents>()
    #validateOnRef: FormInputEvents[] | null = null

    constructor(opts: FormContextOptions<T>, formId: string | number, parentCtx?: FormContext) {
        this.#opts = opts
        this.formId = formId
        this.#parentCtx = parentCtx
    }

    // ==================== GETTERS ====================

    get dirty(): boolean {
        return this.dirtyFields.size > 0
    }

    get disabled(): boolean {
        return this.#opts.getDisabled() || this.loading
    }

    /**
     * Current state. For nested forms, read the sub-tree from parent state by name.
     * Falls back to `{}` if the parent hasn't initialized the sub-object yet —
     * avoids crashing downstream validators when consumers forget to prefill it.
     */
    get state(): T {
        const name = this.#opts.getName()
        if (this.#parentCtx && name) {
            const sub = getAtPath(this.#parentCtx.state as Record<string, unknown>, name)
            return (sub ?? {}) as T
        }
        return this.#opts.getState()
    }

    // ==================== ERROR QUERIES ====================

    getErrors(name?: string | RegExp): FormErrorWithId[] {
        if (!name) return this.errors
        return this.errors.filter((e) => matchesTarget(e.name, name))
    }

    setErrors(errs: FormError[], name?: string | RegExp): void {
        const resolved = this.#resolveErrorIds(errs)
        if (!name) {
            this.errors = resolved
        } else {
            const kept = this.errors.filter((e) => !matchesTarget(e.name, name))
            this.errors = [...kept, ...resolved]
        }
        // Cascade to nested forms so errors set on the parent propagate to the
        // child's own `errors` array. Each child receives only the errors whose
        // names fall under its path, with the path prefix stripped.
        for (const form of this.#nestedForms.values()) {
            if (!form.name) continue
            if (name && !matchesTarget(form.name, name)) continue
            const childErrs: FormError[] = errs
                .filter((e) => e.name && matchesName(e.name, form.name!))
                .map((e) => ({
                    ...e,
                    name: e.name!.slice(form.name!.length + 1) || undefined
                }))
            form.setErrors(childErrs)
        }
    }

    clear(name?: string | RegExp): void {
        if (!name) {
            this.errors = []
            // Cascade to nested forms
            for (const form of this.#nestedForms.values()) {
                form.clear()
            }
            return
        }
        this.errors = this.errors.filter((e) => !matchesTarget(e.name, name))
        // Cascade to matching nested forms. Reuses `matchesTarget` where the
        // "error name" is the child form's path — if `name` equals the path
        // or targets a field inside the path, we clear the whole child.
        for (const form of this.#nestedForms.values()) {
            if (form.name && matchesTarget(form.name, name)) {
                form.clear()
            }
        }
    }

    /**
     * Reset all form tracking state: errors, dirty/touched/blurred field sets,
     * and submitCount. Does NOT modify `state` (caller owns that). Cascades to
     * nested forms.
     */
    reset(): void {
        this.errors = []
        this.dirtyFields.clear()
        this.touchedFields.clear()
        this.blurredFields.clear()
        this.submitCount = 0
        // Cascade to nested forms
        for (const form of this.#nestedForms.values()) {
            form.reset()
        }
    }

    // ==================== FIELD REGISTRY ====================

    registerField(name: string, entry: FormFieldRegistryEntry): void {
        this.#fieldRegistry.set(name, entry)
    }

    unregisterField(name: string): void {
        this.#fieldRegistry.delete(name)
    }

    // ==================== NESTED FORMS ====================

    attachChild(childFormId: string | number, entry: NestedFormEntry): void {
        this.#nestedForms.set(childFormId, entry)
    }

    detachChild(childFormId: string | number): void {
        this.#nestedForms.delete(childFormId)
    }

    // ==================== EVENT HANDLERS ====================

    onFocus(name: string): void {
        this.touchedFields.add(name)
        if (this.#getValidateOnSet().has('focus')) {
            void this.#validateField(name)
        }
    }

    onBlur(name: string): void {
        this.touchedFields.add(name)
        this.blurredFields.add(name)
        if (this.#getValidateOnSet().has('blur')) {
            void this.#validateField(name)
        }
    }

    onChange(name: string): void {
        this.touchedFields.add(name)
        this.dirtyFields.add(name)
        if (this.#getValidateOnSet().has('change')) {
            void this.#validateField(name)
        }
    }

    onInput(name: string, eager = false): void {
        this.touchedFields.add(name)
        this.dirtyFields.add(name)
        if (!this.#getValidateOnSet().has('input')) return
        const entryEager = this.#fieldRegistry.get(name)?.eagerValidation
        if (!eager && !entryEager && !this.blurredFields.has(name)) return
        this.#debounceField(name)
    }

    /**
     * Returns a cached Set for validateOn lookups. Invalidates the cache when
     * the underlying array reference from `getValidateOn()` changes, so prop
     * updates still take effect.
     */
    #getValidateOnSet(): Set<FormInputEvents> {
        const arr = this.#opts.getValidateOn()
        if (arr !== this.#validateOnRef) {
            this.#validateOnRef = arr
            // eslint-disable-next-line svelte/prefer-svelte-reactivity
            this.#validateOnSet = new Set(arr)
        }
        return this.#validateOnSet
    }

    // ==================== VALIDATION CORE ====================

    // The validation pipeline inherently has 6 sequential stages (nested → custom →
    // schema → merge → scope → transform) mirroring Nuxt UI's Form.vue. Decomposing
    // further would fragment the logic across helpers without reducing real complexity.
    // eslint-disable-next-line complexity
    async validate(opts: FormValidateOpts = {}): Promise<T | false> {
        const state = this.state
        const names = opts.name ? (Array.isArray(opts.name) ? opts.name : [opts.name]) : undefined

        // 1. Nested forms validation (when opts.nested is true). Runs in two modes:
        //
        //    (a) Full-form validate — `names` is undefined: every child validates
        //        everything it owns, results contribute to `nestedResults` for
        //        merging into the transformed state in stage 6.
        //
        //    (b) Field-scoped validate — `names` has values: only children whose
        //        path is a prefix of, or equals, any requested name are called,
        //        and they receive only the matching sub-name(s). E.g. parent
        //        validate({ name: 'address.street', nested: true }) reaches a
        //        child form named 'address' and calls child.validate({ name:
        //        'street', nested: true }).
        let nestedErrors: FormError[] = []
        const nestedResults: Array<{ name?: string; value: unknown }> = []
        if (opts.nested) {
            for (const form of this.#nestedForms.values()) {
                // Figure out which of the requested names belong to this child.
                let childNames: string[] | undefined
                if (names) {
                    if (!form.name) continue
                    const formPath = form.name
                    const matched: string[] = []
                    for (const n of names) {
                        if (n === formPath) {
                            // targeting whole child — pass undefined (full)
                            matched.length = 0
                            matched.push('')
                            break
                        }
                        if (matchesName(n, formPath)) {
                            matched.push(n.slice(formPath.length + 1))
                        }
                    }
                    if (matched.length === 0) continue
                    childNames = matched[0] === '' ? undefined : matched
                }

                try {
                    const result = await form.validate({
                        name: childNames,
                        silent: false,
                        nested: true,
                        transform: opts.transform
                    })
                    if (result !== false) {
                        nestedResults.push({ name: form.name, value: result })
                    }
                } catch (err) {
                    if (err instanceof FormValidationException) {
                        nestedErrors = nestedErrors.concat(
                            err.errors.map((e) => addFormPath(e, form.name))
                        )
                    } else {
                        throw err
                    }
                }
            }
        }

        // 2. Custom validate
        let customErrors: FormError[] = []
        const customValidate = this.#opts.getCustomValidate()
        if (customValidate) {
            try {
                const result = await customValidate(state)
                customErrors = result ?? []
            } catch (err) {
                customErrors = [
                    {
                        message: err instanceof Error ? err.message : 'Custom validation failed'
                    }
                ]
            }
        }

        // 3. Schema validation. Reset transformed state first — a previous
        // successful run may have populated it, and we don't want that leaking
        // into stage 6 if the current run fails validation.
        let schemaErrors: FormError[] = []
        const schema = this.#opts.getSchema()
        if (schema) {
            this.#transformedState = null
            try {
                const result = await validateSchema<Record<string, unknown>>(
                    state as unknown,
                    schema
                )
                if (result.errors) {
                    schemaErrors = result.errors
                } else {
                    this.#transformedState = (result.value as Record<string, unknown>) ?? null
                }
            } catch (err) {
                schemaErrors = [
                    {
                        message: err instanceof Error ? err.message : 'Schema validation failed'
                    }
                ]
            }
        } else {
            this.#transformedState = null
        }

        // 4. Merge and resolve error ids
        const allErrors = this.#resolveErrorIds([...customErrors, ...schemaErrors, ...nestedErrors])

        // 5. Scope by field names if requested (field-level validation)
        if (names) {
            const scoped = this.#filterErrorsByNames(allErrors, names)
            const untouched = this.errors.filter((e) => !this.#matchesAnyName(e, names))
            const scopedMatching = allErrors.filter((e) => this.#matchesAnyName(e, names))
            this.errors = [...untouched, ...scopedMatching]
            if (scoped.length > 0) {
                if (opts.silent) return false
                throw new FormValidationException(this.formId, scoped)
            }
        } else {
            this.errors = allErrors
            if (allErrors.length > 0) {
                if (opts.silent) return false
                throw new FormValidationException(this.formId, allErrors)
            }
        }

        // 6. Apply transform (merge nested results into either the schema-
        // transformed state or a shallow clone of the current state). Runs for
        // both full-form and field-scoped validation so that a field-level
        // validate of a nested path still produces a transformed payload.
        if (opts.transform) {
            const base =
                (this.#transformedState as Record<string, unknown>) ??
                ({ ...(state as Record<string, unknown>) } as Record<string, unknown>)
            for (const nr of nestedResults) {
                if (nr.name) {
                    setAtPath(base, nr.name, nr.value)
                } else if (nr.value && typeof nr.value === 'object') {
                    Object.assign(base, nr.value)
                }
            }
            return base as unknown as T
        }

        return state
    }

    // ==================== SUBMIT ====================

    /**
     * Run full validation and fire onsubmit / onerror.
     *
     * @param sourceEvent - Real SubmitEvent from the `<form>` submit handler,
     *   forwarded to the user's onsubmit / onerror so they can read `submitter`,
     *   `preventDefault`, etc. When called programmatically (via the public API),
     *   a fresh SubmitEvent is synthesized.
     */
    async submit(sourceEvent?: SubmitEvent): Promise<void> {
        // Re-entrancy guard: independent of `loading` so double-submit is blocked
        // even when `loadingAuto: false`.
        if (this.#submitting) return
        this.#submitting = true

        this.submitCount++
        const loadingAuto = this.#opts.getLoadingAuto()
        if (loadingAuto) this.loading = true

        const event: SubmitEvent = sourceEvent ?? new SubmitEvent('submit')

        try {
            const data = await this.validate({
                nested: true,
                transform: this.#opts.getTransform()
            })
            if (data === false) return

            const onsubmit = this.#opts.getOnSubmit()
            const submitEvent = Object.assign(event, { data })
            await onsubmit?.(submitEvent as FormSubmitEvent<unknown>)
            this.dirtyFields.clear()
        } catch (err) {
            if (err instanceof FormValidationException) {
                const onerror = this.#opts.getOnError()
                const errorEvent = Object.assign(event, { errors: err.errors })
                onerror?.(errorEvent as FormErrorEvent)
                return
            }
            throw err
        } finally {
            if (loadingAuto) this.loading = false
            this.#submitting = false
        }
    }

    // ==================== DISPOSAL ====================

    dispose(): void {
        this.#disposed = true
        for (const t of this.#timers.values()) clearTimeout(t)
        this.#timers.clear()
        this.#fieldRegistry.clear()
        this.#nestedForms.clear()
        // Clear reactive state too — handles the edge case where a consumer
        // retains a reference to the context after component unmount.
        this.errors = []
        this.loading = false
        this.submitCount = 0
        this.dirtyFields.clear()
        this.touchedFields.clear()
        this.blurredFields.clear()
        this.#transformedState = null
        this.#submitting = false
    }

    // ==================== PRIVATE: VALIDATION HELPERS ====================

    #validateField(name: string): Promise<T | false> {
        return this.validate({ name, silent: true })
    }

    #resolveErrorIds(errs: FormError[]): FormErrorWithId[] {
        // Skip allocation when there's nothing to enrich — most FormErrorWithId
        // upgrades are no-ops because the error's name isn't in the registry.
        return errs.map((err) => {
            if (!err.name) return err
            const id = this.#fieldRegistry.get(err.name)?.id
            if (id === undefined) return err
            return { ...err, id }
        })
    }

    #matchesAnyName(error: FormErrorWithId, names: string[]): boolean {
        if (!error.name) return false
        for (const n of names) {
            if (matchesName(error.name, n)) return true
            const pattern = this.#fieldRegistry.get(n)?.pattern
            if (pattern && pattern.test(error.name)) return true
        }
        return false
    }

    #filterErrorsByNames(all: FormErrorWithId[], names: string[]): FormErrorWithId[] {
        return all.filter((e) => this.#matchesAnyName(e, names))
    }

    #debounceField(name: string): void {
        const delay =
            this.#fieldRegistry.get(name)?.validateOnInputDelay ??
            this.#opts.getValidateOnInputDelay()
        const existing = this.#timers.get(name)
        if (existing) clearTimeout(existing)
        this.#timers.set(
            name,
            setTimeout(() => {
                this.#timers.delete(name)
                if (!this.#disposed) void this.#validateField(name)
            }, delay)
        )
    }
}
