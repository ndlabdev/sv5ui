<script lang="ts" module>
    import type { FormProps, FormSchema } from './form.types.js'

    export type Props<
        S extends FormSchema | undefined = FormSchema | undefined,
        T extends boolean = true,
        N extends boolean = false
    > = FormProps<S, T, N>
</script>

<script
    lang="ts"
    generics="S extends FormSchema | undefined = FormSchema | undefined, T extends boolean = true, N extends boolean = false"
>
    import { setContext, onMount, onDestroy, untrack } from 'svelte'
    import type { HTMLAttributes } from 'svelte/elements'
    import { formVariants, formDefaults } from './form.variants.js'
    import { FormContext, FORM_CONTEXT_KEY, getFormContext } from './form.context.svelte.js'
    import { getComponentConfig } from '../config.js'
    import type { FormApi, FormErrorWithId } from './form.types.js'

    const config = getComponentConfig('form', formDefaults)

    let {
        ref = $bindable(null),
        api = $bindable<FormApi<unknown> | undefined>(),
        id,
        schema,
        state = $bindable({} as never),
        validate: customValidate,
        validateOn = ['input', 'blur', 'change'],
        validateOnInputDelay = 300,
        disabled = false,
        loadingAuto = true,
        transform = true as T,
        nested = false as N,
        name,
        onsubmit,
        onerror,
        class: className,
        ui,
        children,
        ...restProps
    }: Props<S, T, N> = $props()

    // Generate a stable form id. Both `id` and `nested` are effectively init-only
    // (they should not change over a form instance's lifetime), so `untrack`
    // silences Svelte's state_referenced_locally warning.
    const formId: string | number = untrack(
        () =>
            (id as string | number | undefined) ??
            (typeof crypto !== 'undefined' && 'randomUUID' in crypto
                ? crypto.randomUUID()
                : `sv5ui-form-${Math.random().toString(36).slice(2)}`)
    )

    // Parent context captured once at init — `nested` is effectively immutable
    // over a form instance's lifetime. We warn (dev-only) if it's mutated later.
    const parentCtx = untrack(() => (nested ? getFormContext() : undefined))
    const initialNested = untrack(() => nested)
    $effect(() => {
        if (nested !== initialNested) {
            // eslint-disable-next-line no-console
            console.warn(
                '[sv5ui Form] The `nested` prop was changed after mount. This is ' +
                    'not supported — nested/standalone status is fixed at mount time. ' +
                    'Unmount and remount the Form to toggle.'
            )
        }
    })

    // Create the reactive form context. All config is passed via getter closures
    // so that reactive prop changes are visible inside the class.
    const ctx = new FormContext(
        {
            getState: () => state as unknown,
            getSchema: () => schema as FormSchema | undefined,
            getCustomValidate: () =>
                customValidate as
                    | ((s: unknown) => ReturnType<NonNullable<typeof customValidate>>)
                    | undefined,
            getValidateOn: () => validateOn,
            getValidateOnInputDelay: () => validateOnInputDelay,
            getDisabled: () => disabled,
            getLoadingAuto: () => loadingAuto,
            getTransform: () => transform,
            getName: () => name as string | undefined,
            getOnSubmit: () =>
                onsubmit as
                    | ((
                          e: import('./form.types.js').FormSubmitEvent<unknown>
                      ) => void | Promise<void>)
                    | undefined,
            getOnError: () => onerror
        },
        formId,
        parentCtx
    )

    setContext(FORM_CONTEXT_KEY, ctx)

    // Build the bindable API object. Getters ensure reactive state reads stay live.
    const apiObject: FormApi<unknown> = {
        validate: (opts) => ctx.validate(opts) as Promise<unknown | false>,
        submit: () => ctx.submit(),
        clear: (name) => ctx.clear(name),
        getErrors: (name) => ctx.getErrors(name),
        setErrors: (errs, name) => ctx.setErrors(errs, name),
        reset: () => ctx.reset(),
        get errors() {
            return ctx.errors
        },
        get loading() {
            return ctx.loading
        },
        get disabled() {
            return ctx.disabled
        },
        get dirty() {
            return ctx.dirty
        },
        get dirtyFields() {
            return ctx.dirtyFields as ReadonlySet<string>
        },
        get touchedFields() {
            return ctx.touchedFields as ReadonlySet<string>
        },
        get blurredFields() {
            return ctx.blurredFields as ReadonlySet<string>
        },
        get submitCount() {
            return ctx.submitCount
        }
    }

    // Sync the api object to the bindable prop once at setup time. `apiObject`
    // is a stable reference built from getters, so there's nothing reactive to
    // track — direct assignment is sufficient.
    api = apiObject as typeof api

    // Nested form attach/detach lifecycle.
    onMount(() => {
        if (parentCtx && nested) {
            parentCtx.attachChild(formId, {
                formId,
                name: name as string | undefined,
                validate: (opts) => ctx.validate(opts) as Promise<unknown | false>,
                clear: (n) => ctx.clear(n),
                reset: () => ctx.reset(),
                setErrors: (errs, n) => ctx.setErrors(errs, n)
            })
        }
    })

    onDestroy(() => {
        if (parentCtx && nested) parentCtx.detachChild(formId)
        ctx.dispose()
    })

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault()
        // Forward the real SubmitEvent so user handlers can read `submitter`,
        // `target`, etc. When `api.submit()` is called programmatically, ctx.submit
        // synthesizes a fresh event instead.
        await ctx.submit(event)
    }

    // `formVariants` has no variants (only a single `root` slot), so its
    // output is stable — compute once at setup rather than via $derived.
    const variantSlots = formVariants()
    const classes = $derived({
        root: variantSlots.root({
            class: [config.slots.root, className, ui?.root]
        })
    })

    // Slot props for children
    const slotProps = $derived({
        errors: ctx.errors as FormErrorWithId[],
        loading: ctx.loading
    })
</script>

{#if nested}
    <div
        {...restProps as unknown as HTMLAttributes<HTMLDivElement>}
        bind:this={ref}
        id={typeof id === 'number' ? String(id) : id}
        class={classes.root}
    >
        {@render children?.(slotProps)}
    </div>
{:else}
    <form
        {...restProps}
        bind:this={ref}
        id={typeof id === 'number' ? String(id) : id}
        class={classes.root}
        onsubmit={handleSubmit}
    >
        {@render children?.(slotProps)}
    </form>
{/if}
